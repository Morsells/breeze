import { Card } from "@/components/ui/card";
import { Sunrise, Sunset } from "lucide-react";

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
  className?: string;
}

export function SunriseSunset({ sunrise, sunset, className }: SunriseSunsetProps) {
  return (
    <Card className={`p-6 shadow-card ${className}`}>
      <h3 className="font-semibold text-lg mb-4">Sun Times</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-accent/10">
            <Sunrise className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="font-semibold">{sunrise}</div>
            <div className="text-sm text-muted-foreground">Sunrise</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Sunset className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold">{sunset}</div>
            <div className="text-sm text-muted-foreground">Sunset</div>
          </div>
        </div>
      </div>
    </Card>
  );
}