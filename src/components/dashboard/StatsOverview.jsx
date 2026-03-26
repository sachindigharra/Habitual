import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Flame, Target } from "lucide-react";

export default function StatsOverview({ totalCompleted, totalMissed, longestStreak, completionRate }) {
  const stats = [
    { label: "Completed", value: totalCompleted, icon: CheckCircle2, color: "text-primary" },
    { label: "Missed", value: totalMissed, icon: XCircle, color: "text-destructive" },
    { label: "Best Streak", value: longestStreak, icon: Flame, color: "text-accent" },
    { label: "Rate", value: `${completionRate}%`, icon: Target, color: "text-chart-3" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="bg-card rounded-2xl p-3 border border-border/50 text-center"
        >
          <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
          <div className="text-lg font-bold">{stat.value}</div>
          <div className="text-[10px] text-muted-foreground font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}