import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MapPin, Calendar, AlertTriangle, Package, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { weatherService } from "../services/weatherService";
import { useToast } from "../hooks/use-toast";

// Platzhalterbild für Städte (Avatar mit Stadtnamen)
function getCityPlaceholder(city: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(city)}&background=0D8ABC&color=fff&size=512&font-size=0.45`;
}

// Packing-Empfehlungen dynamisch generieren
function getPackingRecommendations(dest: any) {
  const items: string[] = [];
  const allForecasts = dest.forecast?.map((x: string) => x.toLowerCase()) || [];
  const temps = dest.temps?.map((x: string) =>
    typeof x === "string" ? parseInt(x) : x
  ) || [];

  const hasRain = allForecasts.some((f) => f.includes("rain") || f.includes("shower"));
  const hasSnow = allForecasts.some((f) => f.includes("snow"));
  const hasSun = allForecasts.some((f) => f.includes("sun") || f.includes("clear"));
  const hasCloud = allForecasts.some((f) => f.includes("cloud"));
  const hasWind = allForecasts.some((f) => f.includes("wind"));

  const minTemp = temps.length ? Math.min(...temps) : 15;
  const maxTemp = temps.length ? Math.max(...temps) : 20;

  items.push("Valid travel documents (passport/ID, tickets)");
  items.push("Reusable water bottle");
  items.push("Snacks for the journey");
  items.push("Phone charger and adapters");

  if (hasRain) items.push("Umbrella or raincoat");
  if (hasSnow) items.push("Warm hat, scarf, gloves");
  if (hasWind) items.push("Windproof jacket");
  if (hasCloud) items.push("Layered clothing for uncertain weather");
  if (hasSun) items.push("Sunscreen and sunglasses");

  if (maxTemp > 27) items.push("Very light, breathable clothes");
  if (minTemp < 10) items.push("Thick sweater or fleece");
  if (minTemp < 5) items.push("Winter jacket, thermal underwear");

  items.push("Comfortable walking shoes");
  if (minTemp < 16 || hasCloud) items.push("Light jacket for evening");
  if (maxTemp > 22 && hasSun) items.push("Cap/hat for sun protection");
  if (hasRain) items.push("Waterproof footwear");

  return [...new Set(items)];
}

const STORAGE_KEY = "travel_destinations_v2";

const initialDestinations = [
  {
    city: "Paris, France",
    image: "/assets/images/paris.jpeg",
    weather: "Loading...",
    alert: null,
    days: [],
    forecast: [],
    temps: [],
    tripDate: "May 30, 2025",
    lat: 48.8566,
    lon: 2.3522
  },
  {
    city: "Lyon, France",
    image: "/assets/images/lyon.jpeg",
    weather: "Loading...",
    alert: null,
    days: [],
    forecast: [],
    temps: [],
    tripDate: "June 03, 2025",
    lat: 45.75,
    lon: 4.85
  }
];

export default function Travel() {
  // Lade destinations aus localStorage (oder nutze initialDestinations)
  const [destinations, setDestinations] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
    return initialDestinations;
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newImg, setNewImg] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const toast = useToast();

  // Wetter für Paris/Lyon nachladen, falls nötig
  useEffect(() => {
    async function updateWeather(idx: number, lat: number, lon: number) {
      try {
        const forecastData = await weatherService.get5DayForecast(lat, lon);
        const weatherDesc = forecastData[0]?.description
          ? forecastData[0].description.charAt(0).toUpperCase() +
          forecastData[0].description.slice(1)
          : "No data";
        const days = forecastData.map((d: any) => d.date?.replace(".", "") || "");
        const forecast = forecastData.map((d: any) => d.condition || "");
        const temps = forecastData.map((d: any) => `${d.high ?? "?"}°C`);
        const alert = forecast.some((desc: string) => desc.toLowerCase().includes("rain")) ? "Rain expected" : null;

        setDestinations((old) =>
          old.map((dest, i) =>
            i === idx
              ? {
                ...dest,
                weather: weatherDesc,
                alert,
                days,
                forecast,
                temps
              }
              : dest
          )
        );
      } catch {
        setDestinations((old) =>
          old.map((dest, i) =>
            i === idx
              ? { ...dest, weather: "Weather unavailable", days: [], forecast: [], temps: [] }
              : dest
          )
        );
      }
    }

    destinations.forEach((dest, idx) => {
      if (dest.days.length === 0 && typeof dest.lat === "number" && typeof dest.lon === "number") {
        updateWeather(idx, dest.lat, dest.lon);
      }
    });
    // eslint-disable-next-line
  }, []);

  // Persistiere destinations in localStorage bei jeder Änderung!
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
    }
  }, [destinations]);

  // Wetter holen für neue Stadt
  async function handleAddDestination() {
    if (!newCity || !newDate) return;
    setLoadingAdd(true);
    try {
      // Geocoding via searchCities
      const cities = await weatherService.searchCities(newCity);
      const location = cities && cities[0];
      if (!location || !location.lat || !location.lon) {
        toast.toast({
          variant: "destructive",
          description: "Location not found. Try a different name!"
        });
        setLoadingAdd(false);
        return;
      }

      // Wetter holen
      const forecastData = await weatherService.get5DayForecast(location.lat, location.lon);

      // Daten aufbereiten für Card:
      const days = forecastData.map((d: any) => d.date?.replace(".", "") || "");
      const forecast = forecastData.map((d: any) => d.condition || "");
      const temps = forecastData.map((d: any) => `${d.high ?? "?"}°C`);
      const weather = forecastData[0]?.description
        ? forecastData[0].description.charAt(0).toUpperCase() + forecastData[0].description.slice(1)
        : "No data";
      const alert = forecast.some((desc: string) => desc.toLowerCase().includes("rain")) ? "Rain expected" : null;

      setDestinations([
        ...destinations,
        {
          city: location.name || newCity,
          image: newImg
            ? newImg
            : getCityPlaceholder(location.name || newCity),
          weather,
          alert,
          days,
          forecast,
          temps,
          tripDate: newDate
        }
      ]);
      setNewCity("");
      setNewDate("");
      setNewImg("");
      setAddOpen(false);
    } catch (e) {
      toast.toast({
        variant: "destructive",
        description: "Weather data not found for this location."
      });
    }
    setLoadingAdd(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#156180] to-[#184463] dark:from-[#156180] dark:to-[#184463] relative transition-colors">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Travel Planner</h1>
          <p className="text-lg font-medium text-white">
            Plan your trip with weather insights
          </p>
        </div>
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {destinations.map((destination, idx) => (
            <Card key={idx} className="bg-white/90 dark:bg-[#11181f] rounded-2xl overflow-hidden shadow-lg border-0 transition-colors">
              <div className="h-56 bg-[#f5f8fa] dark:bg-[#191e24] flex items-center justify-center relative">
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
                    <div className="font-bold text-gray-900 dark:text-white text-lg">{destination.city}</div>
                    <div className="text-gray-600 dark:text-white/70 text-sm mt-1">
                      Trip Date: <span className="font-semibold">{destination.tripDate}</span>
                    </div>
                  </div>
                  {destination.alert && (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-300 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{destination.alert}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 mb-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-white/70 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Next 5 days</span>
                  </div>
                  <div className="font-medium text-gray-800 dark:text-white mt-1">{destination.weather}</div>
                </div>
                {/* Forecast row */}
                <div className="flex gap-3 bg-[#f3f5f8] dark:bg-[#181d24] rounded-xl py-3 px-3 justify-between mb-4">
                  {destination.days.length === 0 ? (
                    <div className="w-full flex justify-center items-center text-gray-500">
                      <Loader2 className="animate-spin mr-2" /> Loading...
                    </div>
                  ) : (
                    destination.days.map((day, i) => (
                      <div key={i} className="flex flex-col items-center min-w-[48px]">
                        <div className="text-base md:text-xl">{destination.forecast[i]}</div>
                        <div className="text-xs text-gray-600 dark:text-white/60">{day}</div>
                        <div className="text-xs text-gray-900 dark:text-white font-bold">{destination.temps[i]}</div>
                      </div>
                    ))
                  )}
                </div>
                <Button
                  className="w-full mt-1 rounded-md border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
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
        <Card className="bg-white/90 dark:bg-[#11181f] p-6 rounded-2xl shadow-lg border-0 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Packing Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {destinations
              .flatMap(dest => getPackingRecommendations(dest))
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#f3f5f8] dark:bg-[#181d24] p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-gray-900 dark:text-white/90">{item}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>
      {/* Floating Add Button */}
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
              <div className="mb-2">
                <span className="font-semibold text-gray-700 dark:text-cyan-300">Expected Weather: </span>
                <span>{selectedDestination.weather}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700 dark:text-cyan-300">Temperatures: </span>
                <span>{selectedDestination.temps.join(" / ")}</span>
              </div>
              <div className="font-semibold mb-1 text-cyan-400">Packing Tips:</div>
              <ul className="list-disc pl-6 text-gray-900 dark:text-white/90">
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
              <label className="font-medium text-gray-900 dark:text-white block mb-1">City & Country</label>
              <input
                className="w-full rounded-md p-2 bg-[#f5f8fa] dark:bg-[#191e24] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20"
                type="text"
                placeholder="e.g. Rome, Italy"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                disabled={loadingAdd}
              />
            </div>
            <div>
              <label className="font-medium text-gray-900 dark:text-white block mb-1">Trip Date</label>
              <input
                className="w-full rounded-md p-2 bg-[#f5f8fa] dark:bg-[#191e24] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20"
                type="text"
                placeholder="e.g. July 10, 2025"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                disabled={loadingAdd}
              />
            </div>
            <div>
              <label className="font-medium text-gray-900 dark:text-white block mb-1">Image URL (optional)</label>
              <input
                className="w-full rounded-md p-2 bg-[#f5f8fa] dark:bg-[#191e24] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20"
                type="text"
                placeholder="/assets/images/rome.jpeg"
                value={newImg}
                onChange={e => setNewImg(e.target.value)}
                disabled={loadingAdd}
              />
            </div>
            <Button
              className="w-full mt-2 flex items-center justify-center"
              onClick={handleAddDestination}
              disabled={!newCity || !newDate || loadingAdd}
            >
              {loadingAdd && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Add Destination
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Among Us Easter Egg */}
      <img
        src="/assets/images/amogus.jpeg"
        alt="amogus"
        className="fixed left-3 bottom-3 w-7 h-7 opacity-60 z-40 select-none pointer-events-none"
      />
    </div>
  );
}
