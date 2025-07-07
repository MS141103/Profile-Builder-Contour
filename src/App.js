import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CreateProfile from "./Components/CreateProfile/CreateProfile";
import ProfileSearch from "./Components/ProfileSearch/ProfileSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/search-profile" element={<ProfileSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
