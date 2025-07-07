import React from "react";
import "./ProfileSearch.css";
import pfp from "../../assets/pfp.png";

function ProfileSearch() {
  return (
    <div>
      <h2 className="profile-search-title">Search Profile</h2>
      <input className="search-bar" placeholder="Search..." />
      <div className="tags-section">
        <h2 className="tags-title">Tags:</h2>
        <p className="tags"></p>
        <p className="tags"></p>
        <p className="tags"></p>
        <p className="tags"></p>
        <p className="tags"></p>
        <p className="tags"></p>
        <p className="tags"></p>
      </div>
      <div className="profile-list">
        <div className="profile-container">
          {/* <div className="profile-cards">
            <img src={pfp} alt="" className="card-pfp" />
            <h2 className="card-title">Abdul Salam</h2>
          </div> */}
          <div className="profile-cards"></div>
          <div className="profile-cards"></div>
          <div className="profile-cards"></div>
        </div>
        <div className="profile-container">
          <div className="profile-cards"></div>
          <div className="profile-cards"></div>
          <div className="profile-cards"></div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSearch;
