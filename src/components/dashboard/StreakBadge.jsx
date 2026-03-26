import { Flame } from "lucide-react";

export default function StreakBadge({ streak }) {
  if (streak === 0) return null;

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent">
      <Flame className="w-3 h-3" />
      <span className="text-xs font-bold">{streak}</span>
    </div>
  );
}