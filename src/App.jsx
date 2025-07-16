import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import DisplayProfile from "./components/DisplayProfile/DisplayProfile";
import CreateProfile from "./components/CreateProfile/CreateProfile";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import ProfileSearch from "./components/ProfileSearch/ProfileSearch";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <>
//       <Navbar onLogin={() => setIsLoggedIn(true)} />
//       <Home isLoggedIn={isLoggedIn} />
//       <DisplayProfile/>
//       <CreateProfile/>
//       {/* <UpdateProfile/> */}
//       {/* <ProfileSearch/> */}
//     </>
//   );
// }

// export default App;

import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import CreateProfile from "./components/CreateProfile/CreateProfile";
// import ProfileSearch from "./components/ProfileSearch/ProfileSearch";
// import UpdateProfile from "./components/UpdateProfile/UpdateProfile";

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

