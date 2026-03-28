import { format } from "date-fns"
import { formatDistance, formatPace, formatDuration } from "@/lib/runUtils"
import { Calendar, MapPin, Zap, Clock, TrendingUp, Radio } from "lucide-react"
import { motion } from "framer-motion"

export default function RunHistory({ runs }) {
  if (runs.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-10 text-center">
        <div className="text-4xl mb-3">🏃</div>
        <h3 className="font-semibold mb-1">No runs yet</h3>
        <p className="text-sm text-muted-foreground">Start your first run above</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold px-1">Run Sessions</h3>
      {runs.map((run, idx) => {
        const isActive = run.status === "active"
        return (
          <motion.div
            key={run.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-card rounded-2xl border p-4 space-y-3 ${
              isActive ? "border-primary/40 bg-primary/5" : "border-border/50"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {format(new Date(run.date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(run.created_at), "hh:mm a")}
                </span>
                {isActive ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse" /> LIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <MapPin className="w-3 h-3 text-primary mx-auto mb-0.5" />
                <div className="text-sm font-bold">
                  {isActive ? "—" : formatDistance(run.distance_meters)}
                </div>
                <div className="text-[10px] text-muted-foreground">Distance</div>
              </div>
              <div className="text-center">
                <Zap className="w-3 h-3 text-accent mx-auto mb-0.5" />
                <div className="text-sm font-bold">
                  {isActive ? "—" : `${formatPace(run.avg_pace_seconds)}/km`}
                </div>
                <div className="text-[10px] text-muted-foreground">Avg Pace</div>
              </div>
              <div className="text-center">
                <Clock className="w-3 h-3 text-chart-3 mx-auto mb-0.5" />
                <div className="text-sm font-bold">
                  {isActive ? "Running..." : formatDuration(run.duration_seconds)}
                </div>
                <div className="text-[10px] text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-3 h-3 text-violet-500 mx-auto mb-0.5" />
                <div className="text-sm font-bold">
                  {isActive ? "—" : `${run.elevation_gain}m`}
                </div>
                <div className="text-[10px] text-muted-foreground">Elevation</div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
