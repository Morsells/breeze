import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";

interface HourlyForecastItem {
  time: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  precipitation?: number;
}

interface HourlyForecastProps {
  forecast: HourlyForecastItem[];
  className?: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
};

const weatherColors = {
  sunny: "text-accent",
  cloudy: "text-muted-foreground",
  rainy: "text-primary",
  snowy: "text-blue-400",
};

export function HourlyForecast({ forecast, className }: HourlyForecastProps) {
  return (
    <Card className={`p-6 shadow-card ${className}`}>
      <h3 className="font-semibold text-lg mb-4">24-Hour Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {forecast.map((item, index) => {
          const IconComponent = weatherIcons[item.condition];
          return (
            <div 
              key={index} 
              className="flex-shrink-0 text-center p-3 rounded-lg hover:bg-secondary/50 transition-smooth min-w-[80px]"
            >
              <div className="text-sm text-muted-foreground mb-2">{item.time}</div>
              <div className={`mb-2 flex justify-center ${weatherColors[item.condition]}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="font-semibold">{item.temperature}°</div>
              {item.precipitation && (
                <div className="text-xs text-primary mt-1">{item.precipitation}%</div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}