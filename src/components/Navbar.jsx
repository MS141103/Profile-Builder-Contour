import logo from "../assets/logo.svg";
import profileIcon from "../assets/profile-icon.png";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <img src={logo} alt="logo" className="logo" />

        {/* Center: Heading */}
        <div className="text-center flex-grow-1">
          <h1 className="heading m-0">Profile Builder</h1>
        </div>

        {/* Right: Profile Icon */}
        <a className="profile-icon-container" href="">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
