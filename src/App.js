import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CreateProfile from "./Components/CreateProfile/CreateProfile";
import ProfileSearch from "./Components/ProfileSearch/ProfileSearch";
import UpdateProfile from "./Components/UpdateProfile/UpdateProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/search-profile" element={<ProfileSearch />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
