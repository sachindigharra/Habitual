import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function DailyLogEntry({ dayNumber, existingLog, onSave }) {
  const [content, setContent] = useState(existingLog?.content || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    await onSave(content.trim())
    setSaving(false)
  }

  if (existingLog) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Day {dayNumber} — Logged ✓</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{existingLog.content}</p>
      </motion.div>
    )
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Day {dayNumber} — What did you learn today?</span>
      </div>
      <Textarea
        placeholder="Write what you learned today... (topic, key points, insights)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none text-sm"
      />
      <Button onClick={handleSave} disabled={saving || !content.trim()} className="w-full">
        {saving ? "Saving..." : "Save Today's Learning"}
      </Button>
    </div>
  )
}
