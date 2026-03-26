import { AlertTriangle, TrendingUp, Lightbulb, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const CONFIG = {
  danger: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/5 border-destructive/20" },
  warning: { icon: AlertTriangle, color: "text-accent", bg: "bg-accent/5 border-accent/20" },
  suggestion: { icon: Lightbulb, color: "text-chart-3", bg: "bg-chart-3/5 border-chart-3/20" },
  success: { icon: Sparkles, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
  good: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
};

export default function SmartInsightCard({ insight, habitName, habitEmoji }) {
  if (!insight) return null;
  const { icon: Icon, color, bg } = CONFIG[insight.type] || CONFIG.good;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-start gap-3 p-3 rounded-xl border ${bg}`}
    >
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
      <div className="min-w-0">
        <span className="text-xs font-semibold">
          {habitEmoji} {habitName}
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">{insight.message}</p>
      </div>
    </motion.div>
  );
}