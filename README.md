# Habitual ✦

A modern habit tracking app built with React, Vite, and Supabase. Track your daily habits, visualize progress with analytics, and stay consistent with smart reminders.

## Features

- **Authentication** — Email & password sign up / sign in via Supabase Auth
- **Habit Management** — Create, edit, and delete habits with emoji, category, and monthly goal
- **Calendar Grid** — Visual month-by-month habit completion grid (mark today only)
- **Analytics** — Weekly, monthly, and yearly reports with charts and performance rankings
- **Smart Insights** — Auto-generated suggestions based on streaks and completion rates
- **Browser Reminders** — Native browser notifications at your set reminder time
- **Auto Theme** — Automatically switches between light (6AM–7PM) and dark (7PM–6AM) mode
- **Habit Detail** — Per-habit stats, 6-month trend chart, and monthly heatmap

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS v3, shadcn/ui |
| Routing | React Router v7 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Charts | Recharts |
| Animations | Framer Motion |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sachindigharra/Habitual.git
cd Habitual
git checkout develop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and run this SQL in the **SQL Editor**:

```sql
CREATE TABLE habits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  emoji text,
  goal_per_month int,
  reminder_time text,
  color text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE habit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date text NOT NULL,
  completed boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own habits" ON habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users own logs" ON habit_logs FOR ALL USING (auth.uid() = user_id);
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the app

```bash
npm run dev
```

## Branch Structure

```
main      → stable base setup
develop   → full feature implementation
```

## Project Structure

```
src/
├── components/
│   ├── analytics/      # Weekly, Monthly, Yearly reports
│   ├── dashboard/      # Calendar grid, stats, insights
│   ├── habits/         # HabitCard, HabitFormDialog
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── supabase.js     # Supabase client
│   ├── AuthContext.jsx # Auth state & methods
│   ├── DataContext.jsx # Habits & logs state
│   ├── habitUtils.js   # Streak, completion rate helpers
│   └── reminderService.js # Browser notification scheduler
└── pages/
    ├── Login.jsx
    ├── Dashboard.jsx
    ├── Habits.jsx
    ├── Analytics.jsx
    └── HabitDetail.jsx
```

## License

MIT
