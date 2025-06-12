import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Forecast from "./pages/Forecast/Forecast";
import Favorites from "./pages/Favorites/Favorites";
import TravelPlanner from "./pages/TravelPlanner/TravelPlanner";
import WeatherMap from "./pages/WeatherMap/WeatherMap";

import "./global.css"; // dein Haupt-CSS

const App: React.FC = () => (
  <Router>
    <div className="app-container">
      <Sidebar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/travel-planner" element={<TravelPlanner />} />
          <Route path="/weather-map" element={<WeatherMap />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
