import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/lib/DataContext";

const CATEGORIES = [
  { value: "health", label: "Health", emoji: "💧" },
  { value: "learning", label: "Learning", emoji: "📚" },
  { value: "fitness", label: "Fitness", emoji: "💪" },
  { value: "productivity", label: "Productivity", emoji: "⚡" },
  { value: "mindfulness", label: "Mindfulness", emoji: "🧘" },
  { value: "social", label: "Social", emoji: "🤝" },
];

const EMOJIS = ["💧", "📚", "💪", "⚡", "🧘", "🤝", "🏃", "✍️", "🎯", "🍎", "💤", "🎵", "🧠", "🌱", "☀️", "🔥"];

export default function HabitFormDialog({ open, onOpenChange, habit }) {
  const { createHabit, updateHabit } = useData();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "health",
    emoji: "💧",
    goal_per_month: 30,
    reminder_time: "09:00",
    color: "emerald",
    is_active: true,
  });

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name || "",
        category: habit.category || "health",
        emoji: habit.emoji || "💧",
        goal_per_month: habit.goal_per_month || 30,
        reminder_time: habit.reminder_time || "09:00",
        color: habit.color || "emerald",
        is_active: habit.is_active !== false,
      });
    } else {
      setForm({ name: "", category: "health", emoji: "💧", goal_per_month: 30, reminder_time: "09:00", color: "emerald", is_active: true });
    }
  }, [habit, open]);

  const handleSave = () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (habit) {
      updateHabit(habit.id, form);
    } else {
      createHabit(form);
    }
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{habit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label>Habit Name</Label>
            <Input
              placeholder="e.g. Drink 2L Water"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm({ ...form, emoji: e })}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    form.emoji === e
                      ? "bg-primary/10 ring-2 ring-primary scale-110"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal (days/month)</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={form.goal_per_month}
                onChange={(e) => setForm({ ...form, goal_per_month: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Reminder Time</Label>
              <Input
                type="time"
                value={form.reminder_time}
                onChange={(e) => setForm({ ...form, reminder_time: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="w-full">
            {saving ? "Saving..." : habit ? "Update Habit" : "Create Habit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}