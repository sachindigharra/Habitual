import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getStreak, isCompleted, getCompletionRate, CATEGORY_CONFIG } from "@/lib/habitUtils";
import { Trophy, TrendingDown } from "lucide-react";

export default function MonthlyReport({ habits, logs }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysUpToToday = eachDayOfInterval({
    start: monthStart,
    end: isBefore(monthEnd, today) ? monthEnd : today,
  });

  const stats = useMemo(() => {
    let completed = 0;
    let total = 0;

    daysUpToToday.forEach((day) => {
      habits.forEach((habit) => {
        total++;
        if (isCompleted(logs, habit.id, day)) completed++;
      });
    });

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    let longestStreak = 0;
    let mostConsistent = null;
    let leastConsistent = null;
    let bestRate = 0;
    let worstRate = 100;

    habits.forEach((habit) => {
      const streak = getStreak(logs, habit.id);
      if (streak > longestStreak) longestStreak = streak;

      const habitRate = getCompletionRate(logs, habit.id, monthStart, today);
      if (habitRate >= bestRate) {
        bestRate = habitRate;
        mostConsistent = habit;
      }
      if (habitRate <= worstRate) {
        worstRate = habitRate;
        leastConsistent = habit;
      }
    });

    // Habit performance ranking
    const rankings = habits
      .map((h) => ({
        ...h,
        rate: getCompletionRate(logs, h.id, monthStart, today),
      }))
      .sort((a, b) => b.rate - a.rate);

    return { completed, missed: total - completed, rate, longestStreak, mostConsistent, leastConsistent, rankings, bestRate, worstRate };
  }, [habits, logs, daysUpToToday, monthStart]);

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Missed", value: stats.missed },
  ];
  const COLORS = ["hsl(152, 60%, 42%)", "hsl(220, 10%, 90%)"];

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-5">
      <h3 className="text-sm font-bold">{format(today, "MMMM yyyy")}</h3>

      <div className="flex items-center gap-6">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold">{stats.rate}%</div>
          <div className="text-xs text-muted-foreground">Monthly completion rate</div>
          <div className="text-xs text-accent font-semibold">🔥 {stats.longestStreak} day streak</div>
        </div>
      </div>

      {/* Top & Bottom Habits */}
      <div className="grid grid-cols-2 gap-3">
        {stats.mostConsistent && (
          <div className="bg-primary/5 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">Most Consistent</span>
            </div>
            <div className="text-xs font-semibold">{stats.mostConsistent.emoji} {stats.mostConsistent.name}</div>
            <div className="text-[10px] text-muted-foreground">{stats.bestRate}% rate</div>
          </div>
        )}
        {stats.leastConsistent && (
          <div className="bg-destructive/5 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-[10px] font-bold text-destructive">Needs Work</span>
            </div>
            <div className="text-xs font-semibold">{stats.leastConsistent.emoji} {stats.leastConsistent.name}</div>
            <div className="text-[10px] text-muted-foreground">{stats.worstRate}% rate</div>
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground">Performance Ranking</h4>
        {stats.rankings.map((habit, idx) => {
          const cat = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.health;
          return (
            <div key={habit.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-4">#{idx + 1}</span>
              <span className="text-sm">{habit.emoji || cat.emoji}</span>
              <span className="text-xs font-medium flex-1 truncate">{habit.name}</span>
              <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${habit.rate}%` }} />
              </div>
              <span className="text-[10px] font-bold w-8 text-right">{habit.rate}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}