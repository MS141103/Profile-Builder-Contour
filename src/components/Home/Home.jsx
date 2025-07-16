import "./Home.css";
import createProfile from "../../assets/create-profile.png";
import searchProfile from "../../assets/search-profile.png";

function Home({ isLoggedIn }) {
  return (
    <div className="home">
      {!isLoggedIn && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <h3 className="text-center fst-italic fw-semibold px-4 m-5">
            Streamline workforce management with a powerful Profile Builder —
            create, organize, and access employee profiles effortlessly,
            enabling smarter decisions, stronger teams, and seamless
            collaboration.
          </h3>
        </div>
      )}

      {isLoggedIn && (
        <div className="other-pages row row-cols-1 row-cols-md-2 g-4 px-4">
          <div className="home-text col-12">
            <h2 className="secondary-text text-center">
              Centralized Employee Profiles for Streamlined Oversight, Enhanced
              Collaboration, and Informed Decision-Making Across the Workforce.
            </h2>
          </div>
          <a href="" className="text-decoration-none">
            <div className="col">
              <div className="card content text-white position-relative text-center hover-card">
                <div className="icon-circle position-absolute top-0 start-50 translate-middle">
                  <img
                    className="icon"
                    src={createProfile}
                    alt="Create Profile"
                  />
                </div>
                <div className="card-body mt-4">
                  <h3 className="card-title">Create Profile</h3>
                </div>
              </div>
            </div>
          </a>

          <a href="" className="text-decoration-none">
            <div className="col">
              <div className="card content text-white position-relative text-center hover-card">
                <div className="icon-circle position-absolute top-0 start-50 translate-middle">
                  <img
                    className="icon"
                    src={searchProfile}
                    alt="Search Profile"
                  />
                </div>
                <div className="card-body mt-4">
                  <h3 className="card-title">Search Profiles</h3>
                </div>
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
