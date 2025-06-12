import React from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Forecast from "./pages/Forecast/Forecast";
import Favorites from "./pages/Favorites/Favorites";
import TravelPlanner from "./pages/TravelPlanner/TravelPlanner";
import WeatherMap from "./pages/WeatherMap/WeatherMap";

import "./global.css";

const App: React.FC = () => (
  <Router>
    <div className="app-root">
      <Header />
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
