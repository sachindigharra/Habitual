import { format, isToday, isFuture, isBefore, startOfMonth } from "date-fns";
import { getDaysInMonth, isCompleted } from "@/lib/habitUtils";
import { motion } from "framer-motion";

export default function HabitCalendarGrid({ habits, logs, currentMonth, onToggle }) {
  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="min-w-[640px]">
        {/* Day headers */}
        <div className="flex gap-0.5 mb-1 pl-32">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={`flex-1 min-w-[24px] text-center text-[9px] font-medium ${
                isToday(day) ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {format(day, "d")}
            </div>
          ))}
        </div>

        {/* Habit rows */}
        <div className="space-y-1">
          {habits.map((habit, idx) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-0.5"
            >
              <div className="w-32 flex-shrink-0 flex items-center gap-2 pr-2">
                <span className="text-sm">{habit.emoji || "🎯"}</span>
                <span className="text-xs font-medium truncate">{habit.name}</span>
              </div>
              {days.map((day) => {
                const completed = isCompleted(logs, habit.id, day);
                const future = isFuture(day);
                const past = isBefore(day, today) && !isToday(day);
                const missed = past && !completed;
                const todayCell = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !future && onToggle(habit.id, day, completed)}
                    disabled={future || past}
                    className={`flex-1 min-w-[24px] aspect-square rounded-[4px] transition-all ${
                      future
                        ? "bg-muted/30 cursor-default"
                        : completed
                        ? "bg-primary hover:bg-primary/80"
                        : missed
                        ? "bg-destructive/15 hover:bg-destructive/25"
                        : todayCell
                        ? "bg-secondary ring-1 ring-primary/30 hover:bg-primary/10"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                    title={`${habit.name} - ${format(day, "MMM d")}`}
                  />
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}