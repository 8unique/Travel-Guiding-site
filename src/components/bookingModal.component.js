import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import moment from "moment";

import { loadingGif } from "../utils/images.util";

const BookingModal = ({ place }) => {
  const PlaceService = require("../services/place.service");

  const currentUser = useSelector((state) => state.currentUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookedTime, setBookedTime] = useState("");
  const [bookedDate, setBookedDate] = useState("");
  const [otherDetails, setOtherDetails] = useState("");

  const [validEmail, setValidEmail] = useState(undefined);
  const [validPhone, setValidPhone] = useState(undefined);

  const [error, setError] = useState({ type: "ERROR", value: undefined });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhoneNumber(currentUser.phone_number ? currentUser.phone_number : "");
    }
  }, [currentUser]);

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

  const handleBooking = async () => {
    if (name === "") {
      setError({ type: "ERROR", value: "Please provide your name" });
    } else if (!validEmail) {
      setError({ type: "ERROR", value: "Please provide a valid email" });
    } else if (!validPhone) {
      setError({
        type: "ERROR",
        value: "Please provide a valid phone number",
      });
    } else if (bookedTime === "" || bookedDate === "") {
      setError({
        type: "ERROR",
        value: "Please provide booking date and time.",
      });
    } else if (
      !moment(bookedTime, "HH:mm").isBetween(
        moment(place.opening_time, "HH:mm"),
        moment(place.closing_time, "HH:mm")
      )
    ) {
      setError({
        type: "ERROR",
        value: "Specified date/time is invalid or unavailable.",
      });
    } else {
      setLoading(true);
      setError({ type: "WAITING", value: "Booking..." });

      await PlaceService.createBooking({
        placeId: place.id,
        userId: currentUser.id,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        bookedAt: bookedDate + " " + bookedTime,
        details: otherDetails,
      })
        .then((res) => {
          setLoading(false);
          resetFields();
          if (res === "Success") {
            setError({ type: "SUCCESS", value: "Booking successful!" });
          }
        })
        .catch((err) => {
          setLoading(false);
          setError({ type: "ERROR", value: err });
        });
    }
  };

  const resetFields = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setBookedTime("");
    setBookedDate("");
    setOtherDetails("");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 3000);
    return () => clearInterval(timer);
  }, [error]);

  return (
    <div
      className="modal fade"
      id="bookingModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="bookingModalTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body booking-form-wrapper">
            <div
              className="text-center"
              data-aos="fade-down"
              data-aos-delay="175"
              data-aos-duration="800"
            >
              <h1 className="primary-h">Let's Book!</h1>
              <p className="primary-p my-3 text-center">
                To schedule your booking <br />@
                <span className="link">{place.business_name}</span>,
                <br />
                please provide the below information.
              </p>
              <div className="mb-3 position-relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control shadow-none"
                  id="booking-name"
                  placeholder="Enter Name"
                />
              </div>
              <div className="mb-3 position-relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control shadow-none"
                  id="booking-email"
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
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="form-control shadow-none"
                  id="booking-phone"
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
              <div className="row mb-3 position-relative">
                <div className="col-md-auto">
                  <input
                    type="time"
                    value={bookedTime}
                    onChange={(e) => setBookedTime(e.target.value)}
                    className="form-control shadow-none"
                    id="booking-time"
                    placeholder="Enter Booking Time"
                  />
                </div>
                <div className="col-md-auto">
                  <input
                    type="date"
                    value={bookedDate}
                    onChange={(e) => setBookedDate(e.target.value)}
                    min={moment().format("YYYY-MM-DD")}
                    className="form-control shadow-none"
                    id="booking-date"
                    placeholder="Enter Booking Date"
                  />
                </div>
              </div>
              <div className="mb-3 position-relative">
                <textarea
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  rows={4}
                  maxLength="250"
                  className="form-control shadow-none"
                  style={{ maxHeight: 100, minHeight: 58 }}
                  id="booking-details"
                  placeholder="Any other details"
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 7,
                    right: 12,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {otherDetails.length} / 250
                </span>
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
            </div>
            <div className="mb-3" style={{ textAlign: "left" }}>
              {!currentUser && (
                <a className="link" href="/login">
                  Login to book even faster!
                </a>
              )}
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="light-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-btn"
                disabled={loading}
                onClick={handleBooking}
              >
                {loading ? (
                  <img
                    src={loadingGif}
                    alt=""
                    style={{ marginRight: 8, width: 20 }}
                  />
                ) : (
                  "Book"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
