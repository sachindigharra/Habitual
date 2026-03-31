import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function PageNotFound() {
  const navigate = useNavigate()
  const location = useLocation()
  const pageName = location.pathname.substring(1)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-sm w-full"
      >
        {/* Icon */}
        <div className="relative mx-auto w-32 h-32">
          <div className="w-32 h-32 rounded-3xl bg-muted flex items-center justify-center">
            <span className="text-6xl">🗺️</span>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-destructive/10 border-2 border-background flex items-center justify-center">
            <span className="text-lg font-black text-destructive">!</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-7xl font-black text-muted-foreground/20 tracking-tighter">404</h1>
          <h2 className="text-xl font-bold">Page Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page{' '}
            {pageName && (
              <span className="font-medium text-foreground">"{pageName}"</span>
            )}{' '}
            doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/Dashboard')}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        {/* Branding */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <img src="/favicon.svg" alt="Habitual" className="w-5 h-5 rounded-md" />
          <span className="text-xs text-muted-foreground font-medium">Habitual</span>
        </div>
      </motion.div>
    </div>
  )
}
