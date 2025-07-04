import "./Home.css";
import Navbar from "./Navbar";
import createProfile from "../assets/create-profile.png";
import searchProfile from "../assets/search-profile.png";

function Home() {
  return (
    <>
      <div className="home">
        <Navbar></Navbar>

        <div class="other-pages row row-cols-1 row-cols-md-2 g-4">
          <div className="home-text">
            <h2 className="secondary-text">
              Centralized Employee Profiles for Streamlined Oversight, Enhanced Collaboration, and Informed Decision-Making Across the Workforce.
            </h2>
          </div>
          <div class="col">
            <div class="card content text-white position-relative text-center hover-card">
              <div class="icon-circle position-absolute top-0 start-50 translate-middle">
                <img
                  className="icon"
                  src={createProfile}
                  alt="Create Profile"
                />
              </div>

              <div class="card-body mt-4">
                <h3 class="card-title">Create Profile</h3>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card content text-white position-relative text-center hover-card">
              <div class="icon-circle position-absolute top-0 start-50 translate-middle">
                <img
                  className="icon"
                  src={searchProfile}
                  alt="Search Profile"
                />
              </div>

              <div class="card-body mt-4">
                <h3 class="card-title">Search Profiles</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
