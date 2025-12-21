import { useTickets } from "@/hooks/use-tickets";
import { StatsCard } from "@/components/StatsCard";
import { MessageSquare, CheckCircle2, Clock, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { stats, isLoading } = useTickets();

  if (isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Loading dashboard...</div>;
  }

  // Mock data for the chart since the API currently only returns totals
  const chartData = [
    { name: 'Mon', tickets: 4 },
    { name: 'Tue', tickets: 7 },
    { name: 'Wed', tickets: 5 },
    { name: 'Thu', tickets: 12 },
    { name: 'Fri', tickets: 9 },
    { name: 'Sat', tickets: 3 },
    { name: 'Sun', tickets: stats.total > 0 ? 6 : 0 },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Tickets" 
          value={stats.total} 
          icon={MessageSquare} 
          color="primary" 
          trend="12% vs last week"
        />
        <StatsCard 
          label="Open Tickets" 
          value={stats.open} 
          icon={Clock} 
          color="warning" 
        />
        <StatsCard 
          label="Closed Tickets" 
          value={stats.closed} 
          icon={CheckCircle2} 
          color="success" 
        />
        <StatsCard 
          label="Avg Response" 
          value={14} 
          icon={Activity} 
          color="primary" 
          trend="min"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Ticket Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#202225', 
                    borderColor: '#2f3136', 
                    borderRadius: '8px',
                    color: '#fff' 
                  }}
                />
                <Bar dataKey="tickets" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#5865F2" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  TK
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">New ticket created by User#{1000+i}</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
