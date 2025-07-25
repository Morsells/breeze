import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MapPin, Calendar, AlertTriangle, Package, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

function makeDummyForecast() {
  return {
    days: ["01.07", "02.07", "03.07", "04.07"],
    forecast: ["☀️", "🌧️", "⛅", "☀️"],
    temps: ["25°C", "19°C", "22°C", "27°C"],
    weather: "Variable, 22°C",
    alert: "Rain possible"
  };
}

function getPackingRecommendations(dest: any) {
  const hasRain = dest.forecast?.some((f: string) => f.includes("🌧️") || f.includes("🌦️"));
  const hasSun = dest.forecast?.some((f: string) => f.includes("☀️"));
  const recommendations = [
    "Light jacket for evening",
    "Comfortable walking shoes",
    "Light layers for temperature changes",
  ];
  if (hasRain) recommendations.push("Umbrella or raincoat");
  if (hasSun) recommendations.push("Sunscreen and sunglasses");
  return recommendations;
}

export default function Travel() {
  const [destinations, setDestinations] = useState([
    {
      city: "Paris, France",
      image: "/assets/images/paris.jpeg",
      weather: "Sunny, 22°C",
      alert: null,
      days: ["30.05", "31.05", "01.06", "02.06"],
      forecast: ["☀️", "🌤️", "🌧️", "☀️"],
      temps: ["22°C", "20°C", "16°C", "23°C"],
      tripDate: "May 30, 2025"
    },
    {
      city: "Lyon, France",
      image: "/assets/images/lyon.jpeg",
      weather: "Partly Cloudy, 18°C",
      alert: "Rain expected",
      days: ["03.06", "04.06", "05.06", "06.06"],
      forecast: ["🌦️", "⛅", "☀️", "☀️"],
      temps: ["17°C", "22°C", "24°C", "25°C"],
      tripDate: "June 03, 2025"
    }
  ]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  // Für das Add-Modal
  const [addOpen, setAddOpen] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newImg, setNewImg] = useState("");

  function handleAddDestination() {
    if (!newCity || !newDate) return;
    const dummy = makeDummyForecast();
    setDestinations([
      ...destinations,
      {
        city: newCity,
        image: newImg ? newImg : "/assets/images/paris.jpeg",
        weather: dummy.weather,
        alert: dummy.alert,
        days: dummy.days,
        forecast: dummy.forecast,
        temps: dummy.temps,
        tripDate: newDate
      }
    ]);
    setNewCity("");
    setNewDate("");
    setNewImg("");
    setAddOpen(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#156180] to-[#184463] relative">
      <div className="container mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Travel Planner</h1>
          <p className="text-white/80">Plan your trip with weather insights</p>
        </div>
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {destinations.map((destination, idx) => (
            <Card key={idx} className="bg-[#11181f] rounded-2xl overflow-hidden shadow-lg border-0">
              <div className="h-56 bg-[#191e24] flex items-center justify-center relative">
                {destination.image ? (
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <MapPin className="h-12 w-12 text-cyan-400 mb-2" />
                    <p className="text-cyan-400/70">Destination Image</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-lg">{destination.city}</div>
                    <div className="text-white/70 text-sm mt-1">
                      Trip Date: <span className="font-semibold">{destination.tripDate}</span>
                    </div>
                  </div>
                  {destination.alert && (
                    <div className="flex items-center gap-1 text-amber-300 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{destination.alert}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 mb-3">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Next 5 days</span>
                  </div>
                  <div className="font-medium text-white mt-1">{destination.weather}</div>
                </div>
                {/* Forecast row */}
                <div className="flex gap-3 bg-[#181d24] rounded-xl py-3 px-3 justify-between mb-4">
                  {destination.days.map((day, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[48px]">
                      <div className="text-xl">{destination.forecast[i]}</div>
                      <div className="text-xs text-white/70">{day}</div>
                      <div className="text-xs text-white font-bold">{destination.temps[i]}</div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-1 rounded-md border border-white/10 bg-transparent text-white hover:bg-cyan-900"
                  onClick={() => {
                    setSelectedDestination(destination);
                    setDetailsOpen(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {/* Packing Recommendations Card */}
        <Card className="bg-[#11181f] p-6 rounded-2xl shadow-lg border-0">
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-white text-lg">Packing Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {destinations.flatMap(dest => getPackingRecommendations(dest)).filter((v, i, a) => a.indexOf(v) === i).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#181d24] p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Floating Add Button mit höherem Abstand */}
      <button
        className="fixed z-30 bottom-24 md:bottom-8 right-8 h-16 w-16 rounded-2xl bg-cyan-400/90 hover:bg-cyan-500 flex flex-col items-center justify-center text-white shadow-xl transition border-4 border-cyan-300 border-dashed"
        aria-label="Add new trip"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="w-8 h-8 mb-1" />
        <span className="text-xs font-bold">Add</span>
      </button>
      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDestination?.city} – Trip Details
            </DialogTitle>
          </DialogHeader>
          {selectedDestination && (
            <div>
              <img
                src={selectedDestination.image}
                alt={selectedDestination.city}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <div className="font-semibold mb-1">{selectedDestination.tripDate}</div>
              <div className="mb-1 text-white/80">{selectedDestination.weather}</div>
              <div className="font-semibold mb-1 text-cyan-400">Forecast:</div>
              <div className="flex gap-4 mb-3">
                {selectedDestination.forecast.map((f: string, i: number) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-2xl">{f}</span>
                    <span className="text-xs text-white/70">{selectedDestination.days[i]}</span>
                    <span className="text-xs text-white">{selectedDestination.temps[i]}</span>
                  </div>
                ))}
              </div>
              <div className="font-semibold mb-1 text-cyan-400">Packing Tips:</div>
              <ul className="list-disc pl-6 text-white/90">
                {getPackingRecommendations(selectedDestination).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                variant="outline"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Add Destination Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Destination</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-medium text-white block mb-1">City & Country</label>
              <input
                className="w-full rounded-md p-2 bg-[#191e24] text-white border border-white/20"
                type="text"
                placeholder="e.g. Rome, Italy"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium text-white block mb-1">Trip Date</label>
              <input
                className="w-full rounded-md p-2 bg-[#191e24] text-white border border-white/20"
                type="text"
                placeholder="e.g. July 10, 2025"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium text-white block mb-1">Image URL (optional)</label>
              <input
                className="w-full rounded-md p-2 bg-[#191e24] text-white border border-white/20"
                type="text"
                placeholder="/assets/images/rome.jpeg"
                value={newImg}
                onChange={e => setNewImg(e.target.value)}
              />
            </div>
            <Button
              className="w-full mt-2"
              onClick={handleAddDestination}
              disabled={!newCity || !newDate}
            >
              Add Destination
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Among Us Easter Egg */}
      <img
        src="/assets/images/amogus.jpeg"
        alt="amogus"
        className="fixed left-3 bottom-3 w-7 h-7 opacity-60 z-40 select-none"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
