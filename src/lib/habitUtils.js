import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays, differenceInDays, startOfWeek, endOfWeek, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";

export function getDaysInMonth(date) {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export function getLogsForHabit(logs, habitId) {
  return logs.filter((l) => l.habit_id === habitId && l.completed);
}

export function isCompleted(logs, habitId, date) {
  const dateStr = format(date, "yyyy-MM-dd");
  return logs.some((l) => l.habit_id === habitId && l.date === dateStr && l.completed);
}

export function getStreak(logs, habitId) {
  const completedDates = logs
    .filter((l) => l.habit_id === habitId && l.completed)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (completedDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  const todayStr = format(currentDate, "yyyy-MM-dd");
  
  // Check if today is completed
  if (completedDates[0] !== todayStr) {
    // Check if yesterday was completed
    const yesterdayStr = format(subDays(currentDate, 1), "yyyy-MM-dd");
    if (completedDates[0] !== yesterdayStr) return 0;
    currentDate = subDays(currentDate, 1);
  }

  for (let i = 0; i < 365; i++) {
    const dateStr = format(subDays(currentDate, i), "yyyy-MM-dd");
    if (completedDates.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getCompletionRate(logs, habitId, startDate, endDate) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const completed = days.filter((d) => isCompleted(logs, habitId, d)).length;
  return days.length > 0 ? Math.round((completed / days.length) * 100) : 0;
}

export function getEffectiveStart(habit, periodStart) {
  const createdAt = habit.created_at ? new Date(habit.created_at) : null;
  if (!createdAt) return periodStart;
  return createdAt > periodStart ? createdAt : periodStart;
}

export function getMissedConsecutiveDays(logs, habitId) {
  let missed = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    if (!isCompleted(logs, habitId, date)) {
      missed++;
    } else {
      break;
    }
  }
  return missed;
}

export function getSmartInsight(completionRate, missedDays) {
  if (missedDays >= 10) {
    return { type: "danger", message: "This habit needs a restart. Consider setting a smaller goal." };
  }
  if (missedDays >= 5) {
    return { type: "warning", message: "You've been missing this habit. Let's get back on track!" };
  }
  if (completionRate < 40) {
    return { type: "suggestion", message: "This may be too ambitious. Consider reducing the goal." };
  }
  if (completionRate > 90) {
    return { type: "success", message: "Amazing consistency! Try increasing the challenge." };
  }
  if (completionRate > 70) {
    return { type: "good", message: "Great progress! Keep it up." };
  }
  return null;
}

export const CATEGORY_CONFIG = {
  health: { label: "Health", emoji: "💧", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  learning: { label: "Learning", emoji: "📚", color: "text-violet-500", bg: "bg-violet-500/10" },
  fitness: { label: "Fitness", emoji: "💪", color: "text-orange-500", bg: "bg-orange-500/10" },
  productivity: { label: "Productivity", emoji: "⚡", color: "text-amber-500", bg: "bg-amber-500/10" },
  mindfulness: { label: "Mindfulness", emoji: "🧘", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  social: { label: "Social", emoji: "🤝", color: "text-blue-500", bg: "bg-blue-500/10" },
};