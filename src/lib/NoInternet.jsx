import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Wifi } from 'lucide-react'

export default function NoInternet({ onRetry }) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    setRetrying(true)
    await new Promise((r) => setTimeout(r, 1500))
    if (navigator.onLine) {
      onRetry?.()
      window.location.reload()
    }
    setRetrying(false)
  }

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
            <Wifi className="w-14 h-14 text-muted-foreground/40" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-destructive/10 border-2 border-background flex items-center justify-center">
            <span className="text-lg font-black text-destructive">✕</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">No Internet Connection</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It looks like you're offline. Please check your Wi-Fi or mobile data and try again.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 rounded-2xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Try these steps:</p>
          {["Check your Wi-Fi or mobile data", "Disable and re-enable airplane mode", "Move closer to your router"].map((tip, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>

        {/* Retry */}
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Checking connection...' : 'Try Again'}
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
