import { useMemo } from "react";
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isBefore } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { isCompleted, CATEGORY_CONFIG } from "@/lib/habitUtils";
import { Award, TrendingUp } from "lucide-react";

export default function YearlyReport({ habits, logs }) {
  const today = new Date();
  const yearStart = startOfYear(today);

  const stats = useMemo(() => {
    const months = eachMonthOfInterval({ start: yearStart, end: today });
    let totalCompleted = 0;
    let totalPossible = 0;
    let bestMonth = { name: "", rate: 0 };

    const monthlyData = months.map((month) => {
      const mStart = startOfMonth(month);
      const mEnd = endOfMonth(month);
      const end = isBefore(mEnd, today) ? mEnd : today;
      const days = eachDayOfInterval({ start: mStart, end });

      let completed = 0;
      let total = 0;
      days.forEach((day) => {
        habits.forEach((habit) => {
          total++;
          if (isCompleted(logs, habit.id, day)) completed++;
        });
      });

      totalCompleted += completed;
      totalPossible += total;

      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      if (rate > bestMonth.rate) {
        bestMonth = { name: format(month, "MMMM"), rate };
      }

      return {
        month: format(month, "MMM"),
        completed,
        rate,
      };
    });

    // Category breakdown
    const categoryStats = {};
    habits.forEach((habit) => {
      const cat = habit.category || "health";
      if (!categoryStats[cat]) categoryStats[cat] = { completed: 0, total: 0 };

      const days = eachDayOfInterval({ start: yearStart, end: today });
      days.forEach((day) => {
        categoryStats[cat].total++;
        if (isCompleted(logs, habit.id, day)) categoryStats[cat].completed++;
      });
    });

    const categoryData = Object.entries(categoryStats).map(([cat, data]) => ({
      name: CATEGORY_CONFIG[cat]?.label || cat,
      rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      emoji: CATEGORY_CONFIG[cat]?.emoji || "🎯",
    }));

    const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return { totalCompleted, overallRate, bestMonth, monthlyData, categoryData };
  }, [habits, logs, yearStart]);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-5">
      <h3 className="text-sm font-bold">{format(today, "yyyy")} Overview</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalCompleted}</div>
          <div className="text-[10px] text-muted-foreground">Total Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.overallRate}%</div>
          <div className="text-[10px] text-muted-foreground">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold">{stats.bestMonth.name || "—"}</span>
          </div>
          <div className="text-[10px] text-muted-foreground">Best Month</div>
        </div>
      </div>

      {/* Yearly Trend */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Monthly Trend
        </h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} formatter={(v) => [`${v}%`, "Rate"]} />
              <Line type="monotone" dataKey="rate" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 42%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Monthly Completions</h4>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
              <Bar dataKey="completed" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis */}
      {stats.categoryData.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">Category Performance</h4>
          {stats.categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="text-sm">{cat.emoji}</span>
              <span className="text-xs font-medium flex-1">{cat.name}</span>
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${cat.rate}%` }} />
              </div>
              <span className="text-[10px] font-bold w-8 text-right">{cat.rate}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}