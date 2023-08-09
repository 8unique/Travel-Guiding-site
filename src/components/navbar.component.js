import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

import { logo, loadingGif } from "../utils/images.util";

const Navbar = ({ loading }) => {
  const UserService = require("../services/user.service");

  const currentUser = useSelector((state) => state.currentUser);

  const handleLogout = async () => {
    await UserService.logoutUser();
  };

  return (
    <nav className="navbar navbar-expand-md justify-content-center position-sticky top-0">
      <div className="container">
        <div
          className=" d-flex w-50 me-auto"
          data-aos="zoom-out"
          data-aos-delay="50"
          data-aos-duration="700"
        >
          <a href="/" className="navbar-brand">
            <img
              src={logo}
              width="36px"
              style={{ marginRight: 10 }}
              alt="travel-guide-logo"
            />
            travel guide
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <Bars3BottomRightIcon />
        </button>
        <div className="navbar-collapse collapse w-100" id="navbar">
          <ul className="navbar-nav w-100 justify-content-center">
            <li
              className="nav-item"
              data-aos="zoom-out"
              data-aos-delay="75"
              data-aos-duration="700"
            >
              <a className="nav-link" href="/#about">
                About
              </a>
            </li>
            <li
              className="nav-item"
              data-aos="zoom-out"
              data-aos-delay="100"
              data-aos-duration="700"
            >
              <a className="nav-link" href="/#contact">
                Contact
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav ms-auto w-100 justify-content-end">
            {loading ? (
              <img src={loadingGif} alt="" style={{ width: 32 }} />
            ) : currentUser ? (
              <>
                <div
                  className="nav-item"
                  data-aos="zoom-out"
                  data-aos-delay="125"
                  data-aos-duration="700"
                >
                  <UserCircleIcon
                    className="profile-icon"
                    id="profile-dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  />
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="profile-dropdown"
                  >
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <li
                  className="nav-item"
                  data-aos="zoom-out"
                  data-aos-delay="125"
                  data-aos-duration="700"
                >
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li
                  className="nav-item"
                  data-aos="zoom-out"
                  data-aos-delay="150"
                  data-aos-duration="700"
                >
                  <Link to="/register" className="primary-btn">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
