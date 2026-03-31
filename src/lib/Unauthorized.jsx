import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, ShieldOff } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-sm w-full"
      >
        {/* Icon */}
        <div className="mx-auto w-32 h-32 rounded-3xl bg-destructive/10 flex items-center justify-center">
          <ShieldOff className="w-14 h-14 text-destructive/50" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Session Expired</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your session has expired or you are not authorized to view this page. Please sign in again to continue.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <LogIn className="w-4 h-4" /> Sign In Again
        </button>

        {/* Branding */}
        <div className="flex items-center justify-center gap-2">
          <img src="/favicon.svg" alt="Habitual" className="w-5 h-5 rounded-md" />
          <span className="text-xs text-muted-foreground font-medium">Habitual</span>
        </div>
      </motion.div>
    </div>
  )
}
