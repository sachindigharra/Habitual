import { Toaster } from '@/components/ui/toaster'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import PageNotFound from '@/lib/PageNotFound'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Habits from '@/pages/Habits'
import Analytics from '@/pages/Analytics'
import HabitDetail from '@/pages/HabitDetail'
import Login from '@/pages/Login'
import Running from '@/pages/Running'
import Study from '@/pages/Study'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import { DataProvider } from '@/lib/DataContext'

function ProtectedRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/Dashboard" replace />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Habits" element={<Habits />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/HabitDetail" element={<HabitDetail />} />
          <Route path="/Running" element={<Running />} />
          <Route path="/Study" element={<Study />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </DataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App
