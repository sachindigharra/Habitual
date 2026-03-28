import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, Square, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"
import { getTotalDistance, getPace, getElevationGain } from "@/lib/runUtils"
import RunMap from "@/components/running/RunMap"
import RunStats from "@/components/running/RunStats"
import RunHistory from "@/components/running/RunHistory"

const GPS_OPTIONS = { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
const MIN_DISTANCE = 5 // meters — ignore jitter below this

export default function Running() {
  const { user } = useAuth()
  const [status, setStatus] = useState("idle") // idle | running | paused
  const [route, setRoute] = useState([])
  const [duration, setDuration] = useState(0)
  const [runs, setRuns] = useState([])
  const [gpsError, setGpsError] = useState("")
  const [acquiring, setAcquiring] = useState(false)
  const [activeRunId, setActiveRunId] = useState(null)
  const [startTime, setStartTime] = useState(null)

  const watchIdRef = useRef(null)
  const timerRef = useRef(null)
  const lastPointRef = useRef(null)

  const distance = getTotalDistance(route)
  const pace = getPace(distance, duration)
  const elevation = getElevationGain(route)

  // Load run history
  const loadRuns = useCallback(async () => {
    const { data } = await supabase
      .from("runs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
    setRuns(data || [])
  }, [user])

  useEffect(() => { loadRuns() }, [loadRuns])

  // GPS watch
  const startGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.")
      return
    }
    setAcquiring(true)
    setGpsError("")

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setAcquiring(false)
        const point = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          alt: pos.coords.altitude ?? 0,
          accuracy: pos.coords.accuracy,
          ts: Date.now(),
        }
        // Skip low accuracy or jitter
        if (pos.coords.accuracy > 30) return

        setRoute((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1]
            const R = 6371000
            const toRad = (d) => (d * Math.PI) / 180
            const dLat = toRad(point.lat - last.lat)
            const dLng = toRad(point.lng - last.lng)
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(last.lat)) * Math.cos(toRad(point.lat)) * Math.sin(dLng / 2) ** 2
            const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            if (d < MIN_DISTANCE) return prev
          }
          return [...prev, point]
        })
        lastPointRef.current = point
      },
      (err) => {
        setAcquiring(false)
        setGpsError(`GPS error: ${err.message}`)
      },
      GPS_OPTIONS
    )
  }, [])

  const stopGPS = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  // Timer
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const handleStart = async () => {
    const now = new Date()
    setStatus("running")
    setRoute([])
    setDuration(0)
    setStartTime(now)

    // Insert active session immediately so it shows in history
    const { data } = await supabase.from("runs").insert({
      user_id: user.id,
      date: format(now, "yyyy-MM-dd"),
      duration_seconds: 0,
      distance_meters: 0,
      elevation_gain: 0,
      avg_pace_seconds: 0,
      route: [],
      status: "active",
    }).select().single()
    if (data) setActiveRunId(data.id)
    loadRuns()
    startGPS()
    startTimer()
  }

  const handlePause = () => {
    setStatus("paused")
    stopGPS()
    stopTimer()
  }

  const handleResume = () => {
    setStatus("running")
    startGPS()
    startTimer()
  }

  const handleStop = async () => {
    stopGPS()
    stopTimer()
    setStatus("idle")

    if (activeRunId) {
      await supabase.from("runs").update({
        duration_seconds: duration,
        distance_meters: Math.round(distance),
        elevation_gain: elevation,
        avg_pace_seconds: Math.round(pace),
        route: route,
        status: "completed",
      }).eq("id", activeRunId)
      setActiveRunId(null)
    }
    loadRuns()
    setRoute([])
    setDuration(0)
    setStartTime(null)
  }

  useEffect(() => () => { stopGPS(); stopTimer() }, [stopGPS, stopTimer])

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Outdoor Running</h2>

      {/* GPS Error */}
      {gpsError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive">
          {gpsError}
        </div>
      )}

      {/* Acquiring GPS */}
      {acquiring && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-sm text-accent flex items-center gap-2">
          <MapPin className="w-4 h-4 animate-pulse" />
          Acquiring GPS signal...
        </div>
      )}

      {/* Map */}
      <RunMap route={route} isTracking={status === "running"} />

      {/* Live Stats */}
      <RunStats distance={distance} pace={pace} duration={duration} elevation={elevation} />

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {status === "idle" && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5" /> Start Run
          </motion.button>
        )}

        {status === "running" && (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-semibold text-sm"
            >
              <Pause className="w-5 h-5" /> Pause
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-3 bg-destructive text-white rounded-2xl font-semibold text-sm"
            >
              <Square className="w-5 h-5" /> Stop & Save
            </motion.button>
          </>
        )}

        {status === "paused" && (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleResume}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm"
            >
              <Play className="w-5 h-5" /> Resume
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-3 bg-destructive text-white rounded-2xl font-semibold text-sm"
            >
              <Square className="w-5 h-5" /> Stop & Save
            </motion.button>
          </>
        )}
      </div>

      {/* History */}
      <RunHistory runs={runs} />
    </div>
  )
}
