import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListChecks, BarChart3, Plus, Sun, Moon, LogOut, Footprints, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import HabitFormDialog from "./habits/HabitFormDialog";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { path: "/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/Habits", icon: ListChecks, label: "Habits" },
  { path: "/Analytics", icon: BarChart3, label: "Analytics" },
  { path: "/Running", icon: Footprints, label: "Running" },
  { path: "/Study", icon: BookOpen, label: "Study" },
];

// Dark mode: 7PM (19:00) → 6AM (06:00), Light mode: 6AM → 7PM
function shouldBeDark() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6;
}

function applyTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
}

export default function Layout() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const autoDark = shouldBeDark();
    applyTheme(autoDark);
    return autoDark;
  });

  // Auto-switch theme every minute based on time
  useEffect(() => {
    const interval = setInterval(() => {
      const autoDark = shouldBeDark();
      setIsDark((prev) => {
        if (prev !== autoDark) applyTheme(autoDark);
        return autoDark;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-[1000] bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-lg">✦</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Habitual</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddHabit(true)}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-24 pt-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <HabitFormDialog open={showAddHabit} onOpenChange={setShowAddHabit} />
    </div>
  );
}
