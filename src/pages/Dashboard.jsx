import { useState, useMemo } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isBefore, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import HabitCalendarGrid from "@/components/dashboard/HabitCalendarGrid";
import StatsOverview from "@/components/dashboard/StatsOverview";
import SmartInsightCard from "@/components/dashboard/SmartInsightCard";
import { getStreak, getCompletionRate, getMissedConsecutiveDays, getSmartInsight } from "@/lib/habitUtils";
import { useData } from "@/lib/DataContext";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits, logs, toggleLog } = useData();

  const activeHabits = habits.filter((h) => h.is_active !== false);

  const handleToggle = (habitId, date, wasCompleted) => {
    const dateStr = format(date, "yyyy-MM-dd");
    toggleLog(habitId, dateStr, wasCompleted);
  };

  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysUpToToday = eachDayOfInterval({
    start: monthStart,
    end: isBefore(monthEnd, today) ? monthEnd : today,
  });

  const monthStats = useMemo(() => {
    let completed = 0;
    let total = 0;
    let longestStreak = 0;

    activeHabits.forEach((habit) => {
      const streak = getStreak(logs, habit.id);
      if (streak > longestStreak) longestStreak = streak;

      daysUpToToday.forEach((day) => {
        total++;
        const dateStr = format(day, "yyyy-MM-dd");
        if (logs.some((l) => l.habit_id === habit.id && l.date === dateStr && l.completed)) {
          completed++;
        }
      });
    });

    return {
      totalCompleted: completed,
      totalMissed: total - completed,
      longestStreak,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [activeHabits, logs, daysUpToToday]);

  const insights = useMemo(() => {
    return activeHabits
      .map((habit) => {
        const rate = getCompletionRate(logs, habit.id, monthStart, today);
        const missed = getMissedConsecutiveDays(logs, habit.id);
        const insight = getSmartInsight(rate, missed);
        if (insight) return { ...insight, habitName: habit.name, habitEmoji: habit.emoji };
        return null;
      })
      .filter(Boolean)
      .slice(0, 3);
  }, [activeHabits, logs, monthStart]);

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Overview */}
      <StatsOverview {...monthStats} />

      {/* Calendar Grid */}
      {activeHabits.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-sm font-semibold">Habit Grid</h3>
            <div className="flex items-center gap-3 ml-auto text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Done</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-destructive/15 inline-block" /> Missed</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-secondary inline-block" /> Today</span>
            </div>
          </div>
          <HabitCalendarGrid
            habits={activeHabits}
            logs={logs}
            currentMonth={currentMonth}
            onToggle={handleToggle}
          />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-semibold mb-1">No habits yet</h3>
          <p className="text-sm text-muted-foreground">Tap + to create your first habit</p>
        </div>
      )}

      {/* Smart Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold px-1">Smart Insights</h3>
          {insights.map((insight, idx) => (
            <SmartInsightCard
              key={idx}
              insight={insight}
              habitName={insight.habitName}
              habitEmoji={insight.habitEmoji}
            />
          ))}
        </div>
      )}
    </div>
  );
}