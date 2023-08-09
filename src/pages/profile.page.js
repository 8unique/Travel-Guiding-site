import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeftOnRectangleIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  PresentationChartLineIcon,
  FolderOpenIcon,
  UserIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import { setProfileSection } from "../redux/actions";

import useIsDesktop from "../hooks/useIsDesktop";
import ProfileAccount from "../components/profileAccount.component";
import ProfileSettings from "../components/profileSettings.component";
import ProfileBusinessDashboard from "../components/profileBusinessDashboard.component";
import ProfileBookings from "../components/profileBookings.component";
import ProfileBusiness from "../components/profileBusiness.component";
import ProfileBusinessAddresses from "../components/profileBusinessAddresses.component";

const Profile = () => {
  const isDesktop = useIsDesktop();
  const dispatch = useDispatch();
  const { currentUser, profileSection } = useSelector((state) => state);

  return (
    <div
      id="profile"
      style={{
        minHeight: "84vh",
      }}
    >
      <div className="container position-relative py-4">
        <div className="row gap-4">
          <div className="col-md-auto gap-3">
            <ul className="nav nav-pills profile-sidebar gap-1">
              <li className="nav-item">
                <button
                  className={`secondary-btn ${
                    profileSection === 0 && "active"
                  }`}
                  onClick={() => dispatch(setProfileSection(0))}
                >
                  <UserCircleIcon />
                  <span>Account</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`secondary-btn ${
                    profileSection === 1 && "active"
                  }`}
                  onClick={(e) => dispatch(setProfileSection(1))}
                >
                  <FolderOpenIcon />
                  <span>Bookings</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`secondary-btn ${
                    profileSection === 2 && "active"
                  }`}
                  onClick={() => dispatch(setProfileSection(2))}
                >
                  <Cog6ToothIcon />
                  <span>Settings</span>
                </button>
              </li>
              {currentUser.user_type === "Business Owner" &&
                (isDesktop ? (
                  <>
                    <li className="nav-item">
                      <div className="" id="businessOwnerAccordion">
                        <button
                          className="secondary-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#businessOwnerSettings"
                          aria-expanded="false"
                        >
                          <BriefcaseIcon />
                          <span>Business</span>
                        </button>
                        <div
                          id="businessOwnerSettings"
                          className="collapse"
                          data-bs-parent="#businessOwnerAccordion"
                        >
                          <ul className="nav nav-pills">
                            <li className="nav-item">
                              <button
                                className={`secondary-btn ${
                                  profileSection === 3 && "active"
                                }`}
                                onClick={(e) => dispatch(setProfileSection(3))}
                              >
                                <div style={{ paddingLeft: 15 }}>
                                  <PresentationChartLineIcon />
                                  <span>Dashboard</span>
                                </div>
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`secondary-btn ${
                                  profileSection === 4 && "active"
                                }`}
                                onClick={(e) => dispatch(setProfileSection(4))}
                              >
                                <div style={{ paddingLeft: 15 }}>
                                  <UserIcon />
                                  <span>Profile</span>
                                </div>
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`secondary-btn ${
                                  profileSection === 5 && "active"
                                }`}
                                onClick={(e) => dispatch(setProfileSection(5))}
                              >
                                <div style={{ paddingLeft: 15 }}>
                                  <MapPinIcon style={{ marginTop: -3 }} />
                                  <span>Addresses</span>
                                </div>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <button
                        className={`secondary-btn ${
                          profileSection === 3 && "active"
                        }`}
                        onClick={(e) => dispatch(setProfileSection(3))}
                      >
                        <UserIcon />
                        <span>Profile</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`secondary-btn ${
                          profileSection === 4 && "active"
                        }`}
                        onClick={(e) => dispatch(setProfileSection(4))}
                      >
                        <PresentationChartLineIcon />
                        <span>Dashboard</span>
                      </button>
                    </li>
                  </>
                ))}
              <li className="nav-item">
                <Link to="/register" className="secondary-btn">
                  <ArrowLeftOnRectangleIcon />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
          <div
            className={`${isDesktop ? "col" : "col-md-auto"} profile-details`}
          >
            {profileSection === 0 ? (
              <ProfileAccount />
            ) : profileSection === 1 ? (
              <>
                <ProfileBookings />
              </>
            ) : profileSection === 2 ? (
              <ProfileSettings />
            ) : profileSection === 3 ? (
              <ProfileBusinessDashboard />
            ) : profileSection === 4 ? (
              <ProfileBusiness />
            ) : profileSection === 5 ? (
              <ProfileBusinessAddresses />
            ) : (
              <ProfileAccount />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
