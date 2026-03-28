import { Zap, Map, Clock, TrendingUp } from "lucide-react"
import { formatDistance, formatPace, formatDuration } from "@/lib/runUtils"

export default function RunStats({ distance, pace, duration, elevation }) {
  const stats = [
    { label: "Distance", value: formatDistance(distance), icon: Map, color: "text-primary" },
    { label: "Pace", value: `${formatPace(pace)} /km`, icon: Zap, color: "text-accent" },
    { label: "Duration", value: formatDuration(duration), icon: Clock, color: "text-chart-3" },
    { label: "Elevation", value: `${elevation} m`, icon: TrendingUp, color: "text-violet-500" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
          </div>
          <div className="text-xl font-bold">{s.value}</div>
        </div>
      ))}
    </div>
  )
}
