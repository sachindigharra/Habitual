import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { requestNotificationPermission, scheduleReminders, clearReminders } from '@/lib/reminderService'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])

  const reload = useCallback(async () => {
    if (!user) return
    const [{ data: habitsData }, { data: logsData }] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('habit_logs').select('*').eq('user_id', user.id),
    ])
    setHabits(habitsData || [])
    setLogs(logsData || [])
  }, [user])

  useEffect(() => { reload() }, [reload])

  // Request permission once and schedule reminders whenever habits change
  useEffect(() => {
    if (habits.length === 0) return
    requestNotificationPermission().then((permission) => {
      if (permission === 'granted') scheduleReminders(habits)
    })
    return () => clearReminders()
  }, [habits])

  const createHabit = useCallback(async (data) => {
    await supabase.from('habits').insert({ ...data, user_id: user.id })
    reload()
  }, [user, reload])

  const updateHabit = useCallback(async (id, data) => {
    await supabase.from('habits').update(data).eq('id', id)
    reload()
  }, [reload])

  const deleteHabit = useCallback(async (id) => {
    await supabase.from('habits').delete().eq('id', id)
    reload()
  }, [reload])

  const toggleLog = useCallback(async (habitId, dateStr, wasCompleted) => {
    const existing = logs.find(l => l.habit_id === habitId && l.date === dateStr)
    if (existing) {
      await supabase.from('habit_logs').update({ completed: !wasCompleted }).eq('id', existing.id)
    } else {
      await supabase.from('habit_logs').insert({ habit_id: habitId, date: dateStr, completed: true, user_id: user.id })
    }
    reload()
  }, [logs, user, reload])

  return (
    <DataContext.Provider value={{ habits, logs, createHabit, updateHabit, deleteHabit, toggleLog }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
