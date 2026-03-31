import { differenceInDays, format, parseISO } from "date-fns"

export const STUDY_METHODS = [
  {
    id: "147",
    name: "1-4-7 Japanese Rule",
    emoji: "🇯🇵",
    description: "Learn on Day 1, revise on Day 4 and Day 7 for maximum retention.",
    revisionDays: [4, 7],
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    id: "spaced",
    name: "Spaced Repetition",
    emoji: "🧠",
    description: "Revise at increasing intervals: Day 1 → 3 → 7 → 14 → 30.",
    revisionDays: [3, 7, 14, 30],
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    id: "micro",
    name: "Daily Micro-Learning",
    emoji: "⚡",
    description: "15–30 min of focused learning every day. Simple daily log.",
    revisionDays: [7],
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
]

export function getMethodById(id) {
  return STUDY_METHODS.find((m) => m.id === id) || STUDY_METHODS[0]
}

export function getDayNumber(startedAt) {
  return differenceInDays(new Date(), parseISO(startedAt)) + 1
}

export function getRevisionsDue(logs, method, currentDay) {
  const revisionDays = method.revisionDays
  const due = []

  logs.forEach((log) => {
    revisionDays.forEach((offset) => {
      const targetDay = log.day_number + offset
      if (targetDay === currentDay) {
        const alreadyRevised = (log.revised_days || []).includes(targetDay)
        if (!alreadyRevised) {
          due.push({ log, targetDay, offset })
        }
      }
    })
  })
  return due
}

export function getStreak(logs) {
  if (logs.length === 0) return 0
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  let expected = format(new Date(), "yyyy-MM-dd")

  for (const log of sorted) {
    if (log.date === expected) {
      streak++
      const d = new Date(expected)
      d.setDate(d.getDate() - 1)
      expected = format(d, "yyyy-MM-dd")
    } else {
      break
    }
  }
  return streak
}

export function getTodayLog(logs) {
  const today = format(new Date(), "yyyy-MM-dd")
  return logs.find((l) => l.date === today) || null
}
