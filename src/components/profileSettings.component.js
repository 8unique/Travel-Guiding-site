import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { loadingGif } from "../utils/images.util";

import useIsDesktop from "../hooks/useIsDesktop";

const ProfileSettings = () => {
  const UserService = require("../services/user.service");

  const isDesktop = useIsDesktop();

  const currentUser = useSelector((state) => state.currentUser);

  const email = currentUser ? currentUser.email : "";
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validPassword, setValidPassword] = useState(undefined);

  const [error, setError] = useState({
    type: "ERROR",
    value: undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Travel Guide - Settings";
  }, []);

  useEffect(() => {
    setValidPassword(
      newPassword !== ""
        ? newPassword.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        : undefined
    );
  }, [newPassword]);

  const handleUpdatePassword = async () => {
    if (newPassword === "") {
      setError({
        type: "ERROR",
        value: "Please provide a secure password",
      });
    } else if (confirmPassword === "") {
      setError({
        type: "ERROR",
        value: "Please confirm your new password",
      });
    } else if (newPassword !== confirmPassword) {
      setError({
        type: "ERROR",
        value: "Passwords do not match",
      });
    } else if (!validPassword) {
      setError({
        type: "ERROR",
        value: "One or more password conditions haven't met",
      });
    } else {
      setLoading(true);
      setError({ type: "WAITING", value: "Updating..." });

      await UserService.updateUserPassword({
        email: email,
        currPassword: currPassword,
        newPassword: newPassword,
      })
        .then((res) => {
          setLoading(false);
          if (res) {
            setError({ type: "SUCCESS", value: `Password Updated` });
          }
        })
        .catch((err) => {
          setLoading(false);
          setError({ type: "ERROR", value: err });
        });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 3000);
    return () => clearInterval(timer);
  }, [error]);

  return (
    <>
      <h1 className="primary-h">Update your settings</h1>
      <p className="primary-p my-3">
        Need to change your password?
        <br /> Feel free to do so here.
      </p>
      <div className={`${isDesktop ? "w-50" : "w-100"} mt-4`}>
        <div className="mb-3 position-relative">
          <input
            type="password"
            value={currPassword}
            onChange={(e) => setCurrPassword(e.target.value)}
            className="form-control shadow-none"
            id="profile-curr-password"
            placeholder="Enter Current Password"
          />
          <p className="primary-p" style={{ fontSize: 12 }}>
            Ignore if Google Authenticated
          </p>
        </div>
        <div className="mb-3 position-relative">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control shadow-none"
            id="profile-new-password"
            placeholder="Enter New Password"
          />
          {validPassword === undefined ? (
            <ExclamationCircleIcon
              className="form-input-icon"
              tabIndex="-1"
              data-tip={`
                        <ul class="tooltip-ul">
                          <li>Minumum 8 characters</li>
                          <li>At least 1 uppercase letter</li>
                          <li>At least 1 lowercase letter</li>
                          <li>At least 1 number</li>
                          <li>At least 1 special character</li>
                        </ul>`}
            />
          ) : validPassword ? (
            <CheckCircleIcon
              className="form-input-icon"
              tabIndex="-1"
              data-tip="Password is secure"
              stroke="green"
            />
          ) : (
            <XCircleIcon
              className="form-input-icon"
              tabIndex="-1"
              data-tip="Password rquirements aren't met"
              stroke="red"
            />
          )}
        </div>
        <div className="mb-3 position-relative">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control shadow-none"
            id="profile-confirm-password"
            placeholder="Confirm New Password"
          />
        </div>
        {error.value && (
          <div
            className={`
            ${
              error.type === "ERROR"
                ? "alert-danger"
                : error.type === "WAITING"
                ? "alert-warning"
                : error.type === "SUCCESS" && "alert-success"
            } alert mb-3`}
            role="alert"
            style={{ width: "fit-content" }}
          >
            {error.value}
          </div>
        )}
        <button
          type="button"
          className="primary-btn w-50"
          disabled={loading}
          onClick={handleUpdatePassword}
        >
          {loading ? (
            <img
              src={loadingGif}
              alt=""
              style={{ marginRight: 8, width: 20 }}
            />
          ) : (
            "Update"
          )}
        </button>
      </div>
    </>
  );
};

export default ProfileSettings;
