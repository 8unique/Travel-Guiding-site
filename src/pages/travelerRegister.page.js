import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";

import { googleIcon, loadingGif } from "../utils/images.util";

const TravelerRegister = ({ setProceed }) => {
  const UserService = require("../services/user.service");

  const [validEmail, setValidEmail] = useState(undefined);
  const [validPhone, setValidPhone] = useState(undefined);
  const [validPassword, setValidPassword] = useState(undefined);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({ type: "ERROR", value: undefined });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidEmail(
      email !== ""
        ? email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        : undefined
    );
  }, [email]);

  useEffect(() => {
    setValidPhone(
      phoneNumber !== "" ? phoneNumber.match(/^07[01245678]\d{7}$/) : undefined
    );
  }, [phoneNumber]);

  useEffect(() => {
    setValidPassword(
      password !== ""
        ? password.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        : undefined
    );
  }, [password]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const handleRegister = async () => {
    if (name === "") {
      setError({ type: "ERROR", value: "Please provide your name" });
      setError();
    } else if (!validEmail) {
      setError({ type: "ERROR", value: "Please provide a valid email" });
    } else if (!validPhone) {
      setError({ type: "ERROR", value: "Please provide a valid phone number" });
    } else if (!validPassword) {
      setError({
        type: "ERROR",
        value: "One or more password conditions haven't met",
      });
    } else if (password !== confirmPassword) {
      setError({
        type: "ERROR",
        value: "Passwords do not match",
      });
    } else {
      setLoading(true);
      setError({ type: "WAITING", value: "Registering..." });

      await UserService.registerUser({
        userType: 0,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
      })
        .then((res) => {
          setLoading(false);
          if (res === "Success") {
            resetFields();
            setError({ type: "SUCCESS", value: "Registered successfully!" });
          }
        })
        .catch((err) => {
          setLoading(false);
          setPassword("");
          setConfirmPassword("");
          setError({ type: "ERROR", value: err });
        });
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError({ type: "WAITING", value: "Authenticating..." });
    await UserService.loginUserWithGoogle()
      .then((res) => {
        setLoading(false);
        if (res) {
          resetFields();
          toast(`Welcome, ${res}`);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError({ type: "ERROR", value: err.code });
      });
  };

  const resetFields = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 3000);
    return () => clearInterval(timer);
  }, [error]);

  return (
    <>
      <p className="primary-p my-3 text-center">
        Enter the required details below to setup your traveler account
      </p>
      <div className="mb-3 position-relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control shadow-none"
          id="traveler-register-name"
          placeholder="Enter Name"
        />
      </div>
      <div className="mb-3 position-relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control shadow-none"
          id="traveler-register-email"
          placeholder="Enter Email"
        />
        {validEmail === undefined ? (
          <MinusCircleIcon className="form-input-icon" tabIndex="-1" />
        ) : validEmail ? (
          <CheckCircleIcon
            className="form-input-icon"
            tabIndex="-1"
            data-tip="Valid email address"
            stroke="green"
          />
        ) : (
          <XCircleIcon
            className="form-input-icon"
            tabIndex="-1"
            data-tip="Invalid email address format"
            stroke="red"
          />
        )}
      </div>
      <div className="mb-3 position-relative">
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          className="form-control shadow-none"
          id="traveler-register-phone"
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
      <div className="mb-3 position-relative">
        <input
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control shadow-none"
          id="traveler-register-password"
          placeholder="Password"
        />
        {validPassword === undefined ? (
          <ExclamationCircleIcon
            className="form-input-icon"
            tabIndex="-1"
            data-tip={`
                        <ul className="tooltip-ul">
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
          type={"password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-control shadow-none"
          id="traveler-register-confirmpassword"
          placeholder="Confirm Password"
        />
        {confirmPassword === "" ? (
          <MinusCircleIcon className="form-input-icon" tabIndex="-1" />
        ) : password === confirmPassword ? (
          <CheckCircleIcon
            className="form-input-icon"
            tabIndex="-1"
            data-tip="Password's match"
            stroke="green"
          />
        ) : (
          <XCircleIcon
            className="form-input-icon"
            tabIndex="-1"
            data-tip="Passwords do not match"
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
            } alert mb-2`}
          role="alert"
        >
          {error.value}
        </div>
      )}
      <button
        type="button"
        className="primary-btn w-100 mt-2"
        disabled={loading}
        onClick={handleRegister}
      >
        {loading ? (
          <img src={loadingGif} alt="" style={{ marginRight: 8, width: 20 }} />
        ) : (
          "Register"
        )}
      </button>
      <button
        type="button"
        className="light-btn w-100 mt-3"
        onClick={() => setProceed(undefined)}
      >
        <ArrowLeftIcon />
        Go Back
      </button>
      <p className="primary-p my-4 seperator-p">Or Sign up with</p>
      <div className="row justify-content-center gap-3">
        <button
          type="button"
          className="col-md-4 light-btn"
          onClick={handleGoogleRegister}
        >
          <img src={googleIcon} alt="" style={{ marginRight: 5, width: 22 }} />
          Google
        </button>
      </div>
    </>
  );
};

export default TravelerRegister;
