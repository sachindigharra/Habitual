import { motion } from "framer-motion"
import { RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RevisionAlert({ revisionsDue, onMarkRevised }) {
  if (revisionsDue.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-amber-500" />
        Revisions Due Today
      </h3>
      {revisionsDue.map(({ log, targetDay, offset }, idx) => (
        <motion.div
          key={`${log.id}-${targetDay}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-500">
                📅 Day {log.day_number} content — +{offset} day revision
              </span>
              <p className="text-sm text-foreground leading-relaxed">{log.content}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            onClick={() => onMarkRevised(log.id, targetDay)}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Mark as Revised
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
