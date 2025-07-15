import React, { useState, useEffect } from "react";
import "./ProfileSearch.css";
import pfp from "../../assets/pfp.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfileSearch() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await axios.get(
          "http://localhost:8000/profiles/summaries/"
        );
        setProfiles(response.data);
      } catch (error) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

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
        {loading ? (
          <div>Loading...</div>
        ) : profiles.length === 0 ? (
          <div>No profiles found.</div>
        ) : (
          chunkArray(profiles, 3).map((row, rowIdx) => (
            <div
              className="profile-container"
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 0,
                justifyContent: "flex-start",
              }}
              key={rowIdx}
            >
              {row.map((profile, idx) => (
                <div
                  className="profile-cards"
                  key={profile.id || idx}
                  style={{ flex: "1 1 0", maxWidth: "25.5%" }}
                >
                  <div className="profile-card-header">
                    <img
                      src={profile.candidate?.profile_image || pfp}
                      alt=""
                      className="card-pfp"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = pfp;
                      }}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-details">
                      <h2 className="card-title">
                        {profile.candidate?.name || "No Name"}
                      </h2>
                      <h2 className="card-desc">
                        {profile.candidate?.title || "No Title"}
                      </h2>
                    </div>
                  </div>
                  <div className="profile-card-footer">
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/update-profile/${profile.id}`)} // just change the path of the profile details page with the profile-details
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfileSearch;
