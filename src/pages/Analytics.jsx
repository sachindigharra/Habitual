import { useData } from "@/lib/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyReport from "@/components/analytics/WeeklyReport";
import MonthlyReport from "@/components/analytics/MonthlyReport";
import YearlyReport from "@/components/analytics/YearlyReport";

export default function Analytics() {
  const { habits, logs } = useData();
  const activeHabits = habits.filter((h) => h.is_active !== false);

  if (activeHabits.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="font-semibold mb-1">No data yet</h3>
        <p className="text-sm text-muted-foreground">Create habits and start tracking to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Analytics</h2>

      <Tabs defaultValue="weekly">
        <TabsList className="w-full">
          <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
          <TabsTrigger value="yearly" className="flex-1">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="mt-4">
          <WeeklyReport habits={activeHabits} logs={logs} />
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <MonthlyReport habits={activeHabits} logs={logs} />
        </TabsContent>
        <TabsContent value="yearly" className="mt-4">
          <YearlyReport habits={activeHabits} logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}