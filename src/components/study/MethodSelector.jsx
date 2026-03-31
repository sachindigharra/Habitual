import { motion } from "framer-motion"
import { STUDY_METHODS } from "@/lib/studyUtils"
import { Check } from "lucide-react"

export default function MethodSelector({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Choose Your Learning Method</h3>
      {STUDY_METHODS.map((method, idx) => (
        <motion.button
          key={method.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          onClick={() => onSelect(method.id)}
          className={`w-full text-left p-4 rounded-2xl border transition-all ${
            selected === method.id
              ? `${method.bg} ${method.border} border-2`
              : "bg-card border-border/50 hover:border-border"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{method.emoji}</span>
              <div>
                <div className={`text-sm font-bold ${selected === method.id ? method.color : ""}`}>
                  {method.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{method.description}</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {method.revisionDays.map((d) => (
                    <span key={d} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.bg} ${method.color}`}>
                      Day +{d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {selected === method.id && (
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${method.bg}`}>
                <Check className={`w-3 h-3 ${method.color}`} />
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  )
}
