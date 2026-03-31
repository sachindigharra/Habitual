import { motion } from "framer-motion"
import { Flame, BookOpen, CheckCircle2, Calendar } from "lucide-react"
import { format, parseISO } from "date-fns"
import { getMethodById } from "@/lib/studyUtils"

export default function StudyProgress({ session, logs, streak }) {
  const method = getMethodById(session.method)
  const totalRevisions = logs.reduce((acc, l) => acc + (l.revised_days?.length || 0), 0)
  const totalDays = logs.length

  const stats = [
    { label: "Day Streak", value: streak, icon: Flame, color: "text-accent" },
    { label: "Days Logged", value: totalDays, icon: BookOpen, color: "text-primary" },
    { label: "Revisions Done", value: totalRevisions, icon: CheckCircle2, color: "text-violet-500" },
    { label: "Started", value: format(parseISO(session.started_at), "MMM d"), icon: Calendar, color: "text-chart-3" },
  ]

  return (
    <div className="space-y-4">
      {/* Method Badge */}
      <div className={`flex items-center gap-3 p-3 rounded-2xl border ${method.bg} ${method.border}`}>
        <span className="text-2xl">{method.emoji}</span>
        <div>
          <div className={`text-sm font-bold ${method.color}`}>{method.name}</div>
          <div className="text-xs text-muted-foreground">Active learning method</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="bg-card border border-border/50 rounded-2xl p-3 text-center"
          >
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Log Timeline */}
      {logs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground">Learning Timeline</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {[...logs].sort((a, b) => b.day_number - a.day_number).map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary">{log.day_number}</span>
                  </div>
                  <div className="w-px flex-1 bg-border/50 mt-1" />
                </div>
                <div className="bg-card border border-border/50 rounded-xl p-3 flex-1 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground">Day {log.day_number} · {log.date}</span>
                    {log.revised_days?.length > 0 && (
                      <span className="text-[10px] text-primary font-medium">
                        ✓ {log.revised_days.length} revision{log.revised_days.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{log.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
