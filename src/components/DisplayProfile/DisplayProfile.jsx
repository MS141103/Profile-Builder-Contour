import React, { useState, useEffect } from "react";
import axios from "axios";
import profileIcon from "../../assets/profile.png";
import "./DisplayProfile.css";
import { useParams, useNavigate } from "react-router-dom";

const DisplayProfile = () => {
  const { id: candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchProfileAndVersions = async () => {
      try {
        setLoading(true);

        const profileRes = await axios.get(
          `${BASE_URL}/profiles/candidates/${candidateId}/`
        );
        const profile = profileRes.data;

        const versionsRes = await axios.get(
          `${BASE_URL}/profiles/summaries/${candidateId}/versions/`
        );
        const summaries = versionsRes.data;

        const versions = summaries.map((summary, index) => ({
          name: `Version ${summaries.length - index}`,
          disabled: false,
          content: {
            id: profile.employee_id,
            name: profile.name,
            title: profile.title || "N/A",
            location: profile.location || "Unknown",
            email: profile.email,
            skills: profile.skills || [],
            details: summary.summary_text || "No details provided.",
            updated_at: summary.updated_at || "Unknown",
            img: profile.profile_image
              ? `${BASE_URL}${profile.profile_image}`
              : profileIcon,
          },
        }));

        setCandidate({ versions });
        setCurrentVersionIndex(0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndVersions();
  }, [candidateId]);

  const handleDownloadPDF = () => {
    const selectedVersion = candidate.versions[currentVersionIndex];

    axios({
      url: `${BASE_URL}/profiles/export_pdf/${candidateId}/`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Candidate_${candidateId}_Summary.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;
  if (!candidate) return <p className="text-center mt-5">Profile not found.</p>;

  const selectedVersion = candidate.versions[currentVersionIndex];
  const {
    id,
    name,
    title,
    location,
    email,
    skills,
    details,
    updated_at,
    img,
  } = selectedVersion.content;

  const formattedDate = new Date(updated_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-8 bg-white p-4 rounded shadow-sm">
          <div className="d-flex align-items-center mb-4">
            <img
              src={img || profileIcon}
              alt="Profile"
              className="rounded-circle me-4"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profileIcon;
              }}
            />
            <div>
              <p>ID: {id}</p>
              <h2 className="fw-bold mb-1">{name}</h2>
              <p className="text-muted mt-1">{email}</p>
              <p className="text-muted">{title}</p>
              <p className="text-muted">{location}</p>
            </div>
            <div className="ms-auto text-end">
              <div className="text-muted mb-2">Last Updated: {formattedDate}</div>
              <button
                className="btn btn-outline-primary me-2 fw-bold"
                onClick={handleDownloadPDF}
              >
                <i className="bi bi-download m-2"></i>
              </button>
              <button
                className="btn btn-primary fw-bold"
                onClick={() => navigate(`/update-profile/${candidateId}`)}
              >
                <i className="bi bi-pencil-square m-2"></i>
              </button>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="badge bg-light text-dark px-3 py-2 border rounded-pill"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mb-4 p-4 bg-light rounded-4">
            <h5 className="fw-bold">Details</h5>
            <p>{details}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-4">
          <div className="p-3 bg-white rounded shadow-sm h-100">
            <h5 className="fw-bold mb-3">Profile Versions</h5>
            <ul className="list-unstyled ms-3 border-start ps-3">
              {candidate.versions.map((version, index) => (
                <li key={index} className="mb-2 position-relative">
                  <span className="tree-dot"></span>
                  <button
                    className={`btn rounded-pill ${
                      version.disabled
                        ? "btn-outline-secondary disabled"
                        : currentVersionIndex === index
                        ? "btn-primary text-white"
                        : "btn-outline-primary"
                    }`}
                    onClick={() =>
                      !version.disabled && setCurrentVersionIndex(index)
                    }
                    disabled={version.disabled}
                  >
                    {version.name}
                  </button>
                  {index === 0 && !version.disabled && (
                    <span className="badge bg-success ms-2">Latest</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayProfile;
