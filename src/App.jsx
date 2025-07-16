import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import DisplayProfile from "./components/DisplayProfile/DisplayProfile";
import CreateProfile from "./components/CreateProfile/CreateProfile";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import ProfileSearch from "./components/ProfileSearch/ProfileSearch";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar onLogin={() => setIsLoggedIn(true)} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/display-profile/:id" element={<DisplayProfile />} />
        <Route path="/search-profile" element={<ProfileSearch />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
