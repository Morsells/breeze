import { Home, Calendar, MapPin, Heart, Map } from "lucide-react";
import { NavLink } from "react-router-dom";

const nav = [
  { title: "Home", url: "/", icon: Home },
  { title: "Forecast", url: "/forecast", icon: Calendar },
  { title: "Travel", url: "/travel", icon: MapPin },
  { title: "Saved", url: "/saved", icon: Heart },
  { title: "Map", url: "/map", icon: Map },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex justify-around items-center py-2 md:hidden shadow-lg">
      {nav.map((item) => (
        <NavLink
          to={item.url}
          key={item.title}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-2 ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
