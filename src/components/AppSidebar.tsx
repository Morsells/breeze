
import { useState, useEffect } from "react";
import { 
  Home, 
  Calendar, 
  MapPin, 
  Heart, 
  Map,
  Search,
  Moon,
  Sun,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { weatherService } from "@/services/weatherService";
import { GeocodingResult } from "@/types/weather";

const navigation = [
  { title: "Home", url: "/", icon: Home },
  { title: "5-day Forecast", url: "/forecast", icon: Calendar },
  { title: "Travel Planner", url: "/travel", icon: MapPin },
  { title: "Saved Cities", url: "/saved", icon: Heart },
  { title: "Weather Map", url: "/map", icon: Map },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = (path: string) =>
    isActive(path) 
      ? "bg-primary text-primary-foreground" 
      : "hover:bg-secondary/50 transition-smooth";

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length >= 2) {
        try {
          const results = await weatherService.searchCities(searchQuery);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCitySelect = (city: GeocodingResult) => {
    setSearchQuery(`${city.name}, ${city.country}`);
    setShowResults(false);
    // You can emit an event or use context to update the main weather data
    window.dispatchEvent(new CustomEvent('locationChange', { 
      detail: { lat: city.lat, lon: city.lon, name: city.name } 
    }));
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Breeze
          </h1>
          <div className="flex gap-2">
            <SidebarTrigger className="h-8 w-8" />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8 w-8 p-0"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for your preferred city..."
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((city, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-secondary/50 transition-colors"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={`${getNavClasses(item.url)} flex items-center gap-3 p-3 rounded-lg font-medium`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
