import { useState } from "react";
import { startOfMonth } from "date-fns";
import { getStreak, getCompletionRate } from "@/lib/habitUtils";
import { useData } from "@/lib/DataContext";
import HabitCard from "@/components/habits/HabitCard";
import HabitFormDialog from "@/components/habits/HabitFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Habits() {
  const [editHabit, setEditHabit] = useState(null);
  const [deleteHabit, setDeleteHabit] = useState(null);
  const { habits, logs, deleteHabit: removeHabit } = useData();

  const handleDelete = () => {
    if (!deleteHabit) return;
    removeHabit(deleteHabit.id);
    setDeleteHabit(null);
  };

  const today = new Date();
  const monthStart = startOfMonth(today);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Habits</h2>
        <span className="text-sm text-muted-foreground">{habits.length} habits</span>
      </div>

      {habits.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-semibold mb-1">No habits created</h3>
          <p className="text-sm text-muted-foreground">Tap + in the header to create your first habit</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              streak={getStreak(logs, habit.id)}
              completionRate={getCompletionRate(logs, habit.id, monthStart, today)}
              onEdit={setEditHabit}
              onDelete={setDeleteHabit}
            />
          ))}
        </div>
      )}

      <HabitFormDialog
        open={!!editHabit}
        onOpenChange={(open) => !open && setEditHabit(null)}
        habit={editHabit}
      />

      <AlertDialog open={!!deleteHabit} onOpenChange={(open) => !open && setDeleteHabit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteHabit?.name}" and all its tracking data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}