import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"
import {
  getMethodById, getDayNumber, getRevisionsDue,
  getStreak, getTodayLog, STUDY_METHODS
} from "@/lib/studyUtils"
import MethodSelector from "@/components/study/MethodSelector"
import DailyLogEntry from "@/components/study/DailyLogEntry"
import RevisionAlert from "@/components/study/RevisionAlert"
import StudyProgress from "@/components/study/StudyProgress"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Trash2 } from "lucide-react"

export default function Study() {
  const { user } = useAuth()
  const [session, setSession] = useState(null)
  const [logs, setLogs] = useState([])
  const [selectedMethod, setSelectedMethod] = useState("147")
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [view, setView] = useState("setup") // setup | active

  const loadSession = useCallback(async () => {
    const { data } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      setSession(data)
      setView("active")
      loadLogs(data.id)
    }
    setLoading(false)
  }, [user])

  const loadLogs = async (sessionId) => {
    const { data } = await supabase
      .from("study_logs")
      .select("*")
      .eq("session_id", sessionId)
      .order("day_number", { ascending: true })
    setLogs(data || [])
  }

  useEffect(() => { loadSession() }, [loadSession])

  const handleStart = async () => {
    setStarting(true)
    const method = getMethodById(selectedMethod)
    const { data } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        method: selectedMethod,
        topic: method.name,
        is_active: true,
      })
      .select()
      .single()
    setSession(data)
    setLogs([])
    setView("active")
    setStarting(false)

    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("📘 Study Mode Started!", {
        body: `You started ${method.name}. Log your first learning today!`,
        icon: "/favicon.svg",
      })
    }
  }

  const handleSaveLog = async (content) => {
    const dayNumber = getDayNumber(session.started_at)
    const today = format(new Date(), "yyyy-MM-dd")
    const existing = getTodayLog(logs)

    if (existing) {
      await supabase.from("study_logs").update({ content }).eq("id", existing.id)
    } else {
      await supabase.from("study_logs").insert({
        session_id: session.id,
        user_id: user.id,
        day_number: dayNumber,
        content,
        date: today,
        revised_days: [],
      })
    }
    loadLogs(session.id)
  }

  const handleMarkRevised = async (logId, targetDay) => {
    const log = logs.find((l) => l.id === logId)
    if (!log) return
    const updatedRevisions = [...(log.revised_days || []), targetDay]
    await supabase.from("study_logs").update({ revised_days: updatedRevisions }).eq("id", logId)
    loadLogs(session.id)
  }

  const handleEndSession = async () => {
    await supabase.from("study_sessions").update({ is_active: false }).eq("id", session.id)
    setSession(null)
    setLogs([])
    setView("setup")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const method = session ? getMethodById(session.method) : null
  const dayNumber = session ? getDayNumber(session.started_at) : 1
  const todayLog = getTodayLog(logs)
  const revisionsDue = session ? getRevisionsDue(logs, getMethodById(session.method), dayNumber) : []
  const streak = getStreak(logs)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Study Mode</h2>
            {session && (
              <p className="text-xs text-muted-foreground">Day {dayNumber} · {method?.name}</p>
            )}
          </div>
        </div>
        {session && (
          <button
            onClick={handleEndSession}
            className="flex items-center gap-1 text-xs text-destructive hover:opacity-80 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" /> End Session
          </button>
        )}
      </div>

      {/* Setup View */}
      {view === "setup" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <MethodSelector selected={selectedMethod} onSelect={setSelectedMethod} />
          <Button onClick={handleStart} disabled={starting} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {starting ? "Starting..." : "Start Study Session"}
          </Button>
        </motion.div>
      )}

      {/* Active View */}
      {view === "active" && session && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

          {/* Revision Alerts */}
          <RevisionAlert revisionsDue={revisionsDue} onMarkRevised={handleMarkRevised} />

          {/* Today's Log */}
          <DailyLogEntry
            dayNumber={dayNumber}
            existingLog={todayLog}
            onSave={handleSaveLog}
          />

          {/* Progress */}
          <StudyProgress session={session} logs={logs} streak={streak} />
        </motion.div>
      )}
    </div>
  )
}
