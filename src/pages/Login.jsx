import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function Login() {
  const { signIn, signUp, user } = useAuth()

  if (user) return <Navigate to="/Dashboard" replace />

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isSignUp) {
      // Check if email already exists before signing up
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      // Try sign up — Supabase returns specific error for duplicate emails
      const { data, error: signUpError } = await signUp(email, password)
      setLoading(false)

      if (signUpError) {
        // Handle duplicate email error
        if (
          signUpError.message.toLowerCase().includes('already registered') ||
          signUpError.message.toLowerCase().includes('already exists') ||
          signUpError.message.toLowerCase().includes('user already registered')
        ) {
          setError('This email is already registered. Please sign in instead.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      // Supabase returns identities as empty array when email already exists
      // but email confirmation is enabled (silent duplicate)
      if (data?.user && data.user.identities?.length === 0) {
        setError('This email is already registered. Please sign in instead.')
        return
      }

      setMessage(`✅ Registration successful! A confirmation email has been sent to ${email}. Please check your inbox and click the link to activate your account. You can then login with your registered email & password.`)
    } else {
      const { error: signInError } = await signIn(email, password)
      setLoading(false)

      if (signInError) {
        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          setError('Incorrect email or password. Please try again.')
        } else if (signInError.message.toLowerCase().includes('email not confirmed')) {
          setError('Please confirm your email before signing in. Check your inbox.')
        } else {
          setError(signInError.message)
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <img src="/favicon.svg" alt="Habitual" className="w-12 h-12 rounded-2xl mx-auto" />
          <h1 className="text-2xl font-bold">Habitual</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-sm text-primary">
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
            className="text-primary font-medium hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
