import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

const WeatherMap = () => {
  return (
    <div className="min-h-screen bg-clear">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Weather Map</h1>
          <p className="text-white/80">Interactive weather conditions worldwide</p>
        </div>

        {/* Map Container */}
        <Card className="h-[600px] shadow-card glass overflow-hidden">
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Weather Map</h3>
              <p className="text-muted-foreground max-w-md">
                Click on any location to view detailed weather information. 
                Use zoom and pan gestures to navigate around the globe.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>Pan • Zoom • Click to explore</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Map Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-accent"></div>
            <span className="text-sm">Sunny</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-sm">Rainy</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
            <span className="text-sm">Cloudy</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <span className="text-sm">Snow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;