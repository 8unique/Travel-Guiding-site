import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import TravelerRegister from "./travelerRegister.page";
import OwnerRegister from "./ownerRegister.page";

const Regsiter = () => {
  const [proceed, setProceed] = useState(false);
  const [userType, setUserType] = useState(0);

  useEffect(() => {
    document.title = "Travel Guide - Register";
  }, []);

  return (
    <div
      id="login"
      className="d-flex flex-column justify-content-center position-relative"
      style={{
        minHeight: "85vh",
      }}
    >
      <div className="container text-center">
        <div
          className="form-wrapper text-center"
          data-aos="fade-down"
          data-aos-delay="175"
          data-aos-duration="800"
        >
          <h1 className="primary-h">Register your account</h1>
          {!proceed ? (
            <>
              <p className="primary-p my-3 text-center">
                Select your user type from below to get started.
              </p>
              <div className="hstack mb-3 gap-3 justify-content-center">
                <div className="form-check">
                  <input
                    className="form-check-input shadow-none"
                    type="radio"
                    name="userType"
                    value={0}
                    onChange={(e) => setUserType(0)}
                    id="register-traveler"
                    checked={userType === 0}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="register-traveler"
                  >
                    Traveler
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input shadow-none"
                    type="radio"
                    name="userType"
                    value={1}
                    onChange={(e) => setUserType(1)}
                    id="register-business-owner"
                    checked={userType === 1}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="register-business-owner"
                  >
                    Business Owner
                  </label>
                </div>
              </div>
              <button
                type="button"
                className="primary-btn w-100 mt-2"
                onClick={() => setProceed(true)}
              >
                Proceed
              </button>
            </>
          ) : (
            proceed &&
            (userType === 0 ? (
              <TravelerRegister setProceed={setProceed} />
            ) : (
              userType === 1 && <OwnerRegister setProceed={setProceed} />
            ))
          )}

          <div className="hstack justify-content-center gap-2 mt-4">
            <p className="primary-p text-center my-auto">
              Already have an account?
            </p>{" "}
            <Link className="link" to="/login">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regsiter;
