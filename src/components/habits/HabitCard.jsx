import { format } from "date-fns";
import { motion } from "framer-motion";
import { Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import StreakBadge from "@/components/dashboard/StreakBadge";
import { CATEGORY_CONFIG } from "@/lib/habitUtils";
import { Link } from "react-router-dom";

export default function HabitCard({ habit, streak, completionRate, onEdit, onDelete }) {
  const cat = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.health;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <Link to={`/HabitDetail?id=${habit.id}`} className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center text-lg`}>
            {habit.emoji || cat.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{habit.name}</h3>
            <span className={`text-[10px] font-medium ${cat.color}`}>{cat.label}</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onEdit(habit)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => onDelete(habit)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StreakBadge streak={streak} />
          {habit.reminder_time && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {habit.reminder_time}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground">{completionRate}%</span>
        </div>
      </div>
    </motion.div>
  );
}