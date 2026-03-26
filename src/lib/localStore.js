/**
 * Local storage-based data store.
 * Replaces the Base44 SDK entity layer.
 * All data is persisted in localStorage under "habitTracker_*" keys.
 */

import { format } from "date-fns";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getKey(entity) {
  return `habitTracker_${entity}`;
}

function readAll(entity) {
  try {
    return JSON.parse(localStorage.getItem(getKey(entity)) || "[]");
  } catch {
    return [];
  }
}

function writeAll(entity, records) {
  localStorage.setItem(getKey(entity), JSON.stringify(records));
}

// ── Habits ──────────────────────────────────────────────────────────────────

export const HabitStore = {
  list() {
    return readAll("habits");
  },

  filter(predicate) {
    return readAll("habits").filter(predicate);
  },

  get(id) {
    return readAll("habits").find((h) => h.id === id) || null;
  },

  create(data) {
    const record = {
      id: generateId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      ...data,
    };
    const all = readAll("habits");
    all.push(record);
    writeAll("habits", all);
    return record;
  },

  update(id, data) {
    const all = readAll("habits");
    const idx = all.findIndex((h) => h.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data, updated_date: new Date().toISOString() };
    writeAll("habits", all);
    return all[idx];
  },

  delete(id) {
    const all = readAll("habits").filter((h) => h.id !== id);
    writeAll("habits", all);
  },
};

// ── HabitLogs ────────────────────────────────────────────────────────────────

export const HabitLogStore = {
  list() {
    return readAll("habitLogs");
  },

  findByHabitAndDate(habitId, dateStr) {
    return readAll("habitLogs").find(
      (l) => l.habit_id === habitId && l.date === dateStr
    ) || null;
  },

  create(data) {
    const record = {
      id: generateId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      ...data,
    };
    const all = readAll("habitLogs");
    all.push(record);
    writeAll("habitLogs", all);
    return record;
  },

  update(id, data) {
    const all = readAll("habitLogs");
    const idx = all.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data, updated_date: new Date().toISOString() };
    writeAll("habitLogs", all);
    return all[idx];
  },

  deleteByHabit(habitId) {
    const all = readAll("habitLogs").filter((l) => l.habit_id !== habitId);
    writeAll("habitLogs", all);
  },
};

// ── Seed sample data if store is empty ──────────────────────────────────────

export function seedIfEmpty() {
  if (HabitStore.list().length > 0) return;

  const habits = [
    { name: "Drink 2L Water", category: "health", emoji: "💧", goal_per_month: 30, reminder_time: "08:00", color: "emerald", is_active: true },
    { name: "Exercise 30min", category: "fitness", emoji: "💪", goal_per_month: 25, reminder_time: "07:00", color: "orange", is_active: true },
    { name: "Read 20 Pages", category: "learning", emoji: "📚", goal_per_month: 28, reminder_time: "21:00", color: "violet", is_active: true },
    { name: "Practice Coding", category: "productivity", emoji: "⚡", goal_per_month: 22, reminder_time: "10:00", color: "amber", is_active: true },
    { name: "Meditate 10min", category: "mindfulness", emoji: "🧘", goal_per_month: 30, reminder_time: "06:30", color: "cyan", is_active: true },
  ];

  const created = habits.map((h) => HabitStore.create(h));

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  // Simulate realistic patterns over current month up to today
  const completionPatterns = [
    // habit index → array of day numbers completed
    [1,2,3,4,5,6,7,8,10,11,12,14,15,16,17],
    [1,3,5,7,9,11,13,15],
    [1,2,3,4,6,8,10,12,14,16],
    [2,5,8,11,14],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
  ];

  created.forEach((habit, i) => {
    completionPatterns[i].forEach((day) => {
      if (day <= today.getDate()) {
        const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
        HabitLogStore.create({ habit_id: habit.id, date: dateStr, completed: true });
      }
    });
  });
}