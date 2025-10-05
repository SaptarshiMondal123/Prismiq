import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  percentage?: string;
  trend?: "up" | "down";
  color?: "primary" | "secondary" | "success" | "warning";
}

const StatCard = ({ title, value, icon, percentage, trend, color = "primary" }: StatCardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/30",
    secondary: "from-secondary/20 to-secondary/5 border-secondary/30",
    success: "from-green-500/20 to-green-500/5 border-green-500/30",
    warning: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30",
  };

  return (
    <div className={`card-space p-6 bg-gradient-to-br ${colorClasses[color]} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-background/50">
          {icon}
        </div>
        {percentage && (
          <span className="stat-badge text-secondary">
            {trend === "up" ? "↑" : "↓"} {percentage}
          </span>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-glow">{value}</p>
    </div>
  );
};

export default StatCard;
