
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Forecast from "./pages/Forecast";
import Travel from "./pages/Travel";
import SavedCities from "./pages/SavedCities";
import WeatherMap from "./pages/WeatherMap";
import NotFound from "./pages/NotFound";
import SidebarOpenButton from "@/components/ui/SidebarOpenButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <SidebarOpenButton />
            <AppSidebar />
            <SidebarInset className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/saved" element={<SavedCities />} />
                <Route path="/map" element={<WeatherMap />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
