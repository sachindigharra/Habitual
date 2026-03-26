import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, isBefore } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getStreak, getCompletionRate, getMissedConsecutiveDays, getSmartInsight, isCompleted, CATEGORY_CONFIG } from "@/lib/habitUtils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StreakBadge from "@/components/dashboard/StreakBadge";
import SmartInsightCard from "@/components/dashboard/SmartInsightCard";
import { useData } from "@/lib/DataContext";

export default function HabitDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const habitId = urlParams.get("id");
  const { habits, logs } = useData();

  const habit = habits.find((h) => h.id === habitId);

  const stats = useMemo(() => {
    if (!habit) return null;
    const today = new Date();
    const monthStart = startOfMonth(today);
    const streak = getStreak(logs, habit.id);
    const monthRate = getCompletionRate(logs, habit.id, monthStart, today);
    const missed = getMissedConsecutiveDays(logs, habit.id);
    const insight = getSmartInsight(monthRate, missed);

    // Last 6 months chart data
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const mStart = startOfMonth(month);
      const mEnd = endOfMonth(month);
      const end = isBefore(mEnd, today) ? mEnd : today;
      const days = eachDayOfInterval({ start: mStart, end });
      const completed = days.filter((d) => isCompleted(logs, habit.id, d)).length;
      monthlyData.push({
        month: format(month, "MMM"),
        completed,
        total: days.length,
        rate: days.length > 0 ? Math.round((completed / days.length) * 100) : 0,
      });
    }

    // Heatmap for current month
    const currentMonthDays = eachDayOfInterval({
      start: monthStart,
      end: isBefore(endOfMonth(today), today) ? endOfMonth(today) : today,
    });
    const heatmap = currentMonthDays.map((d) => ({
      date: d,
      completed: isCompleted(logs, habit.id, d),
    }));

    return { streak, monthRate, missed, insight, monthlyData, heatmap };
  }, [habit, logs]);

  if (!habit) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Habit not found</p>
        <Link to="/Habits" className="text-primary text-sm mt-2 inline-block">Back to habits</Link>
      </div>
    );
  }

  const cat = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.health;

  return (
    <div className="space-y-6">
      <Link to="/Habits" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl`}>
          {habit.emoji || cat.emoji}
        </div>
        <div>
          <h1 className="text-xl font-bold">{habit.name}</h1>
          <span className={`text-xs font-medium ${cat.color}`}>{cat.label}</span>
        </div>
        <div className="ml-auto">
          <StreakBadge streak={stats?.streak || 0} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats?.streak || 0}</div>
          <div className="text-[10px] text-muted-foreground">Current Streak</div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <div className="text-2xl font-bold">{stats?.monthRate || 0}%</div>
          <div className="text-[10px] text-muted-foreground">This Month</div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <div className="text-2xl font-bold">{habit.goal_per_month || 30}</div>
          <div className="text-[10px] text-muted-foreground">Monthly Goal</div>
        </div>
      </div>

      {/* Smart Insight */}
      {stats?.insight && (
        <SmartInsightCard insight={stats.insight} habitName={habit.name} habitEmoji={habit.emoji} />
      )}

      {/* Current Month Heatmap */}
      <div className="bg-card rounded-2xl border border-border/50 p-5">
        <h3 className="text-sm font-bold mb-3">{format(new Date(), "MMMM")} Progress</h3>
        <div className="flex flex-wrap gap-1">
          {stats?.heatmap.map(({ date, completed }) => (
            <div
              key={date.toISOString()}
              className={`w-7 h-7 rounded-md ${completed ? "bg-primary" : "bg-secondary"}`}
              title={`${format(date, "MMM d")} - ${completed ? "Completed" : "Not done"}`}
            />
          ))}
        </div>
      </div>

      {/* 6-Month Chart */}
      <div className="bg-card rounded-2xl border border-border/50 p-5">
        <h3 className="text-sm font-bold mb-3">6-Month Trend</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.monthlyData || []}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
              <Bar dataKey="completed" fill="hsl(152, 60%, 42%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}