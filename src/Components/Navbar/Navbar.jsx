import React from "react";
import logo from "../../assets/logo.svg";
import profileIcon from "../../assets/profile-icon.jpg";
import "./Navbar.css";

function Navbar({ onLogin }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleAuthClick = () => {
    setIsLoggedIn(true);
    onLogin(); // inform parent App
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <img src={logo} alt="logo" className="logo" />

        <div className="text-center flex-grow-1">
          <h1 className="heading m-0">Profile Builder</h1>
        </div>

        <div className="d-flex align-items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button className="btn btn-primary" onClick={handleAuthClick}>
                Sign up
              </button>
              <button className="btn btn-outline-primary" onClick={handleAuthClick}>
                Login
              </button>
            </>
          ) : (
            <a className="profile-icon-container" href="#">
              <img src={profileIcon} alt="Profile" className="profile-icon" />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
