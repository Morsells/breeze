import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  location: string;
  description: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  className?: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
};

const weatherGradients = {
  sunny: "bg-sunny",
  cloudy: "bg-cloudy", 
  rainy: "bg-rainy",
  snowy: "bg-clear",
};

export function WeatherCard({ 
  temperature, 
  condition, 
  location, 
  description, 
  humidity,
  windSpeed, 
  uvIndex,
  className 
}: WeatherCardProps) {
  const IconComponent = weatherIcons[condition];
  
  return (
    <Card className={`p-6 shadow-card hover:shadow-elevation transition-smooth glass ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${weatherGradients[condition]}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{location}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{temperature}°C</div>
          <div className="text-sm text-muted-foreground capitalize">{condition}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Humidity</div>
          <div className="font-semibold">{humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Wind</div>
          <div className="font-semibold">{windSpeed} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">UV Index</div>
          <div className="font-semibold">{uvIndex}</div>
        </div>
      </div>
    </Card>
  );
}