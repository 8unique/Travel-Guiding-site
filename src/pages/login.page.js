import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { googleIcon, loadingGif } from "../utils/images.util";

const Login = () => {
  const UserService = require("../services/user.service");

  const [validEmail, setValidEmail] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleLogin = async () => {
    if (!validEmail) {
      setError({ type: "ERROR", value: "Please provide a valid email" });
    } else if (password === "") {
      setError({
        type: "ERROR",
        value: "Password is required",
      });
    } else {
      setLoading(true);
      setError({ type: "WAITING", value: "Authenticating..." });

      await UserService.loginUser({
        email: email,
        password: password,
      })
        .then((res) => {
          setLoading(false);
          if (res) {
            resetFields();
            setError({ type: "SUCCESS", value: `Welcome, ${res.name}` });
          }
        })
        .catch((err) => {
          setLoading(false);
          setPassword("");
          setError({ type: "ERROR", value: err });
        });
    }
  };

  const handleGoogleLogin = async () => {
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
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 3000);
    return () => clearInterval(timer);
  }, [error]);

  useEffect(() => {
    document.title = "Travel Guide - Login";
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
          <h1 className="primary-h">Login to explore</h1>
          <p className="primary-p my-3 text-center">
            Hey, Enter your details to log in
            <br />
            to your account
          </p>
          <div className="mb-3 position-relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control shadow-none"
              id="login-email"
              placeholder="Enter Email"
            />
            {validEmail === undefined ? (
              <MinusCircleIcon className="form-input-icon" tabIndex="-1" />
            ) : validEmail ? (
              <CheckCircleIcon
                className="form-input-icon"
                tabIndex="-1"
                stroke="green"
              />
            ) : (
              <XCircleIcon
                className="form-input-icon"
                tabIndex="-1"
                stroke="red"
              />
            )}
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control shadow-none"
              id="login-password"
              placeholder="Password"
            />
            {showPassword ? (
              <EyeIcon
                className="form-input-icon"
                tabIndex="-1"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeSlashIcon
                className="form-input-icon"
                tabIndex="-1"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <Link className="link" to="/resetpassword">
              Having trouble in sign in?
            </Link>
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
            disabled={loading}
            onClick={handleLogin}
            className="primary-btn w-100 mt-2"
          >
            {loading ? (
              <img
                src={loadingGif}
                alt=""
                style={{ marginRight: 8, width: 20 }}
              />
            ) : (
              "Login"
            )}
          </button>
          <p className="primary-p my-4 seperator-p">Or Log in with</p>
          <div className="row justify-content-center gap-3">
            <button
              type="button"
              className="col-md-4 light-btn"
              onClick={handleGoogleLogin}
            >
              <img
                src={googleIcon}
                alt=""
                style={{ marginRight: 5, width: 22 }}
              />
              Google
            </button>
          </div>
          <div className="hstack justify-content-center gap-2 mt-4">
            <p className="primary-p text-center my-auto">
              Don't have an account?
            </p>{" "}
            <Link className="link" to="/register">
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
