import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { loadingGif } from "../utils/images.util";

import useIsDesktop from "../hooks/useIsDesktop";

const ProfileAccount = () => {
  const UserService = require("../services/user.service");

  const isDesktop = useIsDesktop();

  const currentUser = useSelector((state) => state.currentUser);

  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser.phone_number ? currentUser.phone_number : ""
  );

  const [validPhone, setValidPhone] = useState(undefined);

  const [error, setError] = useState({
    type: "ERROR",
    value: undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Travel Guide - Account";
  }, []);

  useEffect(() => {
    setValidPhone(
      phoneNumber !== "" ? phoneNumber.match(/^07[01245678]\d{7}$/) : undefined
    );
  }, [phoneNumber]);

  const handleSave = async () => {
    if (name === "") {
      setError({
        type: "ERROR",
        value: "Please provide your name",
      });
    } else if (!validPhone) {
      setError({
        type: "ERROR",
        value: "Please provide a valid phone number",
      });
    } else {
      setLoading(true);
      setError({ type: "WAITING", value: "Updating..." });

      await UserService.updateUserDetails({
        id: currentUser.id,
        name: name,
        phoneNumber: phoneNumber,
      })
        .then((res) => {
          setLoading(false);
          if (res) {
            setError({
              type: "SUCCESS",
              value: `Details Updated`,
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          setError({ type: "ERROR", value: err });
        });
    }
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 3000);
    return () => clearInterval(timer);
  }, [error]);

  return (
    <>
      <h1 className="primary-h">Update your details</h1>
      <p className="primary-p my-3">
        Need to update your contact info?
        <br />
        Feel free to do so here.
      </p>
      <hr />
      <div className={`${isDesktop ? "w-50" : "w-100"} mt-4`}>
        <div className="mb-3 position-relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control shadow-none"
            id="profile-email"
            placeholder="Enter Name"
          />
        </div>
        <div className="mb-3 position-relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control shadow-none"
            disabled={true}
            id="profile-email"
            placeholder="Enter Email"
          />
        </div>
        <div className="mb-3 position-relative">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            className="form-control shadow-none"
            id="profile-phonenumber"
            placeholder="Enter Phone Number"
          />
          {validPhone === undefined ? (
            <MinusCircleIcon className="form-input-icon" tabIndex="-1" />
          ) : validPhone ? (
            <CheckCircleIcon
              className="form-input-icon"
              tabIndex="-1"
              data-tip="Phone number valid"
              stroke="green"
            />
          ) : (
            <XCircleIcon
              className="form-input-icon"
              tabIndex="-1"
              data-tip="Invalid phone number format"
              stroke="red"
            />
          )}
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
          onClick={handleSave}
        >
          {loading ? (
            <img
              src={loadingGif}
              alt=""
              style={{ marginRight: 8, width: 20 }}
            />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </>
  );
};

export default ProfileAccount;
