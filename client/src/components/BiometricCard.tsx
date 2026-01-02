import { Card, CardContent } from "@/components/ui/card";

interface BiometricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  progress?: number;
  trend?: "up" | "down" | "stable";
}

export default function BiometricCard({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  progress = 0, 
  trend 
}: BiometricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up": return "fa-arrow-up text-green-500";
      case "down": return "fa-arrow-down text-red-500";
      case "stable": return "fa-minus text-slate-500";
      default: return "";
    }
  };

  return (
    <Card className="wellness-card glassmorphism hover:shadow-xl transition-all duration-300" data-testid={`biometric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
            <i className={`fas ${icon} text-white`}></i>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800 dark:text-white" data-testid={`biometric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{unit}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
          {trend && (
            <i className={`fas ${getTrendIcon()}`}></i>
          )}
        </div>
        
        {progress > 0 && (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
