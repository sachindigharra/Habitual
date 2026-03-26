/**
 * Reminder service using browser Notifications API.
 * Aligns checks to the exact start of each minute to never miss a reminder.
 */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return await Notification.requestPermission()
}

// Tracks which habit+date combos have already fired today
const firedToday = new Set()

/** @type {ReturnType<typeof setTimeout> | null} */
let reminderTimeout = null
/** @type {ReturnType<typeof setInterval> | null} */
let reminderInterval = null

function checkAndFire(habits) {
  if (Notification.permission !== 'granted') return

  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const today = now.toDateString()

  habits.forEach((habit) => {
    if (!habit.reminder_time || habit.is_active === false) return

    const key = `${habit.id}_${today}_${currentTime}`
    if (habit.reminder_time === currentTime && !firedToday.has(key)) {
      firedToday.add(key)
      new Notification('⏰ Habit Reminder', {
        body: `Time to: ${habit.emoji || '🎯'} ${habit.name}`,
        icon: '/favicon.svg',
        tag: key,
        requireInteraction: true,
      })
    }
  })
}

export function scheduleReminders(habits) {
  clearReminders()

  // Check immediately in case app just loaded at reminder time
  checkAndFire(habits)

  // Align to the next exact minute boundary
  const now = new Date()
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

  reminderTimeout = setTimeout(() => {
    checkAndFire(habits)
    // Then check every minute exactly
    reminderInterval = setInterval(() => checkAndFire(habits), 60_000)
  }, msUntilNextMinute)
}

export function clearReminders() {
  if (reminderTimeout) {
    clearTimeout(reminderTimeout)
    reminderTimeout = null
  }
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }
}
