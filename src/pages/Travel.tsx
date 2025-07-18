import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, AlertTriangle, Package } from "lucide-react";

const Travel = () => {
  const destinations = [
    {
      city: "Paris, France",
      image: "/lImage_Uploads/44fcccd8-e1cd-4cc7-858a-89358cdc6a75.png",
      weather: "Sunny, 22°C",
      alert: null,
    },
    {
      city: "Lyon, France", 
      image: "/Image_Uploads/44fcccd8-e1cd-4cc7-858a-89358cdc6a75.png",
      weather: "Partly Cloudy, 18°C",
      alert: "Rain expected",
    },
  ];

  const packingRecommendations = [
    "Light jacket for evening",
    "Umbrella (rain expected in Lyon)",
    "Comfortable walking shoes",
    "Sunscreen and sunglasses",
    "Light layers for temperature changes",
  ];

  return (
    <div className="min-h-screen bg-clear">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Travel Planner</h1>
          <p className="text-white/80">Plan your trip with weather insights</p>
        </div>

        {/* Destinations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {destinations.map((destination, index) => (
            <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevation transition-smooth glass">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Destination Image</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{destination.city}</h3>
                  {destination.alert && (
                    <div className="flex items-center gap-1 text-accent">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{destination.alert}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Next 5 days</span>
                  </div>
                  <div className="font-medium">{destination.weather}</div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Packing Recommendations */}
        <Card className="p-6 shadow-card glass">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Packing Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packingRecommendations.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Travel;