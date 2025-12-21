import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "success" | "warning";
}

export function StatsCard({ label, value, icon: Icon, trend, color = "primary" }: StatsCardProps) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-yellow-500/10 text-yellow-500",
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:translate-y-[-2px] transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          {trend && (
            <p className="text-xs text-green-400 mt-2 font-medium flex items-center gap-1">
              <span>↑</span> {trend}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl transition-colors", colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className={cn(
        "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30",
        color === "primary" ? "bg-primary" : 
        color === "success" ? "bg-green-500" : "bg-yellow-500"
      )} />
    </div>
  );
}
