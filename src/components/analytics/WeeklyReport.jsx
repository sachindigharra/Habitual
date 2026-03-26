import { useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { isCompleted } from "@/lib/habitUtils";

export default function WeeklyReport({ habits, logs }) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: today });

  const stats = useMemo(() => {
    let completed = 0;
    let total = 0;

    const dailyData = weekDays.map((day) => {
      let dayCompleted = 0;
      habits.forEach((habit) => {
        total++;
        if (isCompleted(logs, habit.id, day)) {
          completed++;
          dayCompleted++;
        }
      });
      return { day: format(day, "EEE"), completed: dayCompleted, total: habits.length };
    });

    return {
      completed,
      missed: total - completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      dailyData,
    };
  }, [habits, logs, weekDays]);

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Missed", value: stats.missed },
  ];

  const COLORS = ["hsl(152, 60%, 42%)", "hsl(0, 72%, 55%)"];

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <h3 className="text-sm font-bold mb-4">This Week</h3>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{stats.completed}</div>
          <div className="text-[10px] text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-destructive">{stats.missed}</div>
          <div className="text-[10px] text-muted-foreground">Missed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.rate}%</div>
          <div className="text-[10px] text-muted-foreground">Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
              <Bar dataKey="completed" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}