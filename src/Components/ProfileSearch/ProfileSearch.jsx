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
        <p className="tags">Developer</p>
        <p className="tags">Sales</p>
        <p className="tags">HR</p>
        <p className="tags">Finance</p>
        <p className="tags">Designer</p>
        <p className="tags">Marketing</p>
        <p className="tags">IT</p>
      </div>
      <div className="profile-list">
        <div className="profile-container">
          <div className="profile-cards">
            <div className="profile-card-header">
              <img src={pfp} alt="" className="card-pfp" />
              <div className="card-details">
                <h2 className="card-title">Abdul Salam</h2>
                <h2 className="card-desc">Jr. Software Engineer</h2>
              </div>
            </div>
            <div className="profile-card-footer">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
          <div className="profile-cards">
            <div className="profile-card-header">
              <img src={pfp} alt="" className="card-pfp" />
              <div className="card-details">
                <h2 className="card-title">Abdul Salam</h2>
                <h2 className="card-desc">Jr. Software Engineer</h2>
              </div>
            </div>
            <div className="profile-card-footer">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
          <div className="profile-cards">
            <div className="profile-card-header">
              <img src={pfp} alt="" className="card-pfp" />
              <div className="card-details">
                <h2 className="card-title">Abdul Salam</h2>
                <h2 className="card-desc">Jr. Software Engineer</h2>
              </div>
            </div>
            <div className="profile-card-footer">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        </div>
        <div className="profile-container">
          <div className="profile-cards">
            <div className="profile-card-header">
              <img src={pfp} alt="" className="card-pfp" />
              <div className="card-details">
                <h2 className="card-title">Abdul Salam</h2>
                <h2 className="card-desc">Jr. Software Engineer</h2>
              </div>
            </div>
            <div className="profile-card-footer">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
          <div className="profile-cards">
            <div className="profile-card-header">
              <img src={pfp} alt="" className="card-pfp" />
              <div className="card-details">
                <h2 className="card-title">Abdul Salam</h2>
                <h2 className="card-desc">Jr. Software Engineer</h2>
              </div>
            </div>
            <div className="profile-card-footer">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
          <div className="profile-cards">
            <div className="profile-card-header">
              <img src={pfp} alt="" className="card-pfp" />
              <div className="card-details">
                <h2 className="card-title">Abdul Salam</h2>
                <h2 className="card-desc">Jr. Software Engineer</h2>
              </div>
            </div>
            <div className="profile-card-footer">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSearch;
