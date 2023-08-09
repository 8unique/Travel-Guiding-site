import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import GoogleMapReact from "google-map-react";

import { loadingGif } from "../utils/images.util";
import Marker from "../components/marker.component";

const OwnerRegister = ({ setProceed }) => {
  const UserService = require("../services/user.service");

  const currentLoc = useSelector((state) => state.currentLoc);

  const [validEmail, setValidEmail] = useState(undefined);
  const [validPhone, setValidPhone] = useState(undefined);
  const [validPassword, setValidPassword] = useState(undefined);

  const [isPage, setPage] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setPropertName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [otherBusinessType, setOtherBusinessType] = useState("");
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      address: "",
      lat: currentLoc ? currentLoc.location.y : undefined,
      lng: currentLoc ? currentLoc.location.x : undefined,
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [emptyAddressesFound, setEmptyAddressesFound] = useState(false);

  const [startingPrice, setStartingPrice] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

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
    if (addresses.length > 1) {
      for (let index = 0; index < addresses.length; index++) {
        const el = addresses[index];
        if (el.address === "" || el.lat === undefined || el.lng === undefined) {
          setEmptyAddressesFound(true);
          break;
        } else {
          setEmptyAddressesFound(false);
        }
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (Array.from(images).length > 0)
      if (Array.from(images).length > 5) {
        setError({ type: "ERROR", value: "Please limit the images to 5" });
        setImages([]);
      } else if (
        Array.from(images).reduce(function (prev, current) {
          return prev + current.size;
        }, 0) > 26214400
      ) {
        setError({ type: "ERROR", value: "Image sizes exceeds 25MBs" });
        setImages([]);
      }
  }, [images]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const handleRegister = async () => {
    if (name === "") {
      setError({ type: "ERROR", value: "Please provide your name" });
    } else if (!validEmail) {
      setError({ type: "ERROR", value: "Please provide a valid email" });
    } else if (!validPhone) {
      setError({ type: "ERROR", value: "Please provide a valid phone number" });
    } else if (businessName === "") {
      setError({ type: "ERROR", value: "Please provide your business name" });
    } else if (
      businessType === "" ||
      (businessType === "Other" && otherBusinessType === "")
    ) {
      setError({ type: "ERROR", value: "Please specify your business type" });
    } else if (
      addresses[0].address === "" ||
      addresses[0].lat === undefined ||
      addresses[0].lng === undefined
    ) {
      setError({
        type: "ERROR",
        value:
          "Please specify at least one business address and its map location",
      });
    } else if (emptyAddressesFound) {
      setError({
        type: "ERROR",
        value:
          "Please specify your other business addresses and their map locations",
      });
    } else if (startingPrice === 0 || startingPrice === "") {
      setPage(2);
      setError({
        type: "ERROR",
        value: "Please specify your starting price",
      });
    } else if (openingTime === "" || closingTime === "") {
      setError({
        type: "ERROR",
        value: "Please specify booking schedule hours",
      });
    } else if (description === "") {
      setError({
        type: "ERROR",
        value: "Please provide a short business description",
      });
    } else if (images.length === 0) {
      setError({
        type: "ERROR",
        value: "Please select at least 1 image",
      });
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
        userType: 1,
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        businessName: businessName,
        businessType: otherBusinessType,
        addresses: addresses,
        startingPrice: startingPrice,
        openingTime: openingTime,
        closingTime: closingTime,
        description: description,
        images: images,
      })
        .then((res) => {
          setLoading(false);
          if (res === "Success") {
            resetFields();
            setError({ type: "SUCCESS", value: "Registered successfully!" });
            window.location.reload();
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

  const resetFields = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setPropertName("");
    setBusinessType("");
    setOtherBusinessType("");
    setAddresses([
      {
        id: 1,
        address: "",
        lat: currentLoc ? currentLoc.location.y : undefined,
        lng: currentLoc ? currentLoc.location.x : undefined,
      },
    ]);
    setStartingPrice("");
    setOpeningTime("");
    setClosingTime("");
    setDescription("");
    setImages([]);
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
        Enter the required details below to setup your business owner account
      </p>
      {isPage === 1 ? (
        <>
          <div className="mb-3 position-relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control shadow-none"
              id="owner-register-name"
              placeholder="Enter Name"
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control shadow-none"
              id="owner-register-email"
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
              id="owner-register-phone"
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
              type="text"
              value={businessName}
              onChange={(e) => setPropertName(e.target.value)}
              className="form-control shadow-none"
              id="owner-register-business-name"
              placeholder="Enter Business Name"
            />
          </div>
          <div className="mb-3 position-relative">
            <p className="primary-p text-start">Please select business type</p>
            <div className="hstack mb-3 gap-3 justify-content-start">
              <div className="form-check">
                <input
                  className="form-check-input shadow-none"
                  type="radio"
                  name="businessType"
                  value={"Restaurant"}
                  onChange={(e) => {
                    setBusinessType(e.target.value);
                    setOtherBusinessType(e.target.value);
                  }}
                  id="register-businesstype-restaurant"
                  checked={businessType === "Restaurant"}
                />
                <label
                  className="form-check-label"
                  htmlFor="register-businesstype-restaurant"
                >
                  Restaurant
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input shadow-none"
                  type="radio"
                  name="businessType"
                  value={"Hotel"}
                  onChange={(e) => {
                    setBusinessType(e.target.value);
                    setOtherBusinessType(e.target.value);
                  }}
                  id="register-businesstype-hotel"
                  checked={businessType === "Hotel"}
                />
                <label
                  className="form-check-label"
                  htmlFor="register-businesstype-hotel"
                >
                  Hotel
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input shadow-none"
                  type="radio"
                  name="businessType"
                  value={"Other"}
                  onChange={(e) => {
                    setBusinessType(e.target.value);
                    setOtherBusinessType("");
                  }}
                  id="register-businesstype-other"
                  checked={businessType === "Other"}
                />
                <label
                  className="form-check-label"
                  htmlFor="register-businesstype-other"
                >
                  Other
                </label>
              </div>
            </div>
          </div>
          {businessType === "Other" && (
            <div className="mb-3 position-relative">
              <input
                type="text"
                value={otherBusinessType}
                onChange={(e) => setOtherBusinessType(e.target.value)}
                className="form-control shadow-none"
                id="owner-register-business-type-other"
                placeholder="Please specify business type"
              />
            </div>
          )}
          <div className="d-flex gap-2 mb-3">
            <p className="primary-p text-start my-auto">Business Addresses</p>
            <PlusCircleIcon
              width={25}
              tabIndex="-1"
              style={{ border: "none", outline: "none" }}
              onClick={() => {
                setAddresses([
                  ...addresses,
                  {
                    id: addresses.length + 1,
                    address: "",
                    lat: undefined,
                    lng: undefined,
                  },
                ]);
              }}
            />
          </div>
          {addresses.map((a) => (
            <div key={a.id} className="mb-3 position-relative">
              <input
                type="text"
                value={a.address}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[a.id - 1].address = e.target.value;
                  setAddresses(newAddresses);
                }}
                onClick={() => setSelectedAddress(a.id - 1)}
                className="form-control shadow-none"
                id="owner-register-address"
                placeholder="Enter Address"
              />
              {a.id !== 1 && (
                <TrashIcon
                  className="form-input-icon"
                  tabIndex="-1"
                  onClick={() => {
                    setAddresses(addresses.filter((item) => item.id !== a.id));
                  }}
                />
              )}
            </div>
          ))}

          <div
            className="maps-container mb-5"
            style={{ height: "50vh", width: "100%" }}
          >
            <GoogleMapReact
              options={{
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
              bootstrapURLKeys={{
                key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
              }}
              center={{
                lat: currentLoc ? currentLoc.location.y : undefined,
                lng: currentLoc ? currentLoc.location.x : undefined,
              }}
              defaultZoom={14}
              onClick={(e) => {
                const newAddresses = [...addresses];
                newAddresses[selectedAddress].lat = e.lat;
                newAddresses[selectedAddress].lng = e.lng;
                setAddresses(newAddresses);
              }}
              yesIWantToUseGoogleMapApiInternals
            >
              {addresses.map((a, i) => (
                <Marker key={i} text={a.address} lat={a.lat} lng={a.lng} />
              ))}
            </GoogleMapReact>
            <p
              className="primary-p text-center mt-2"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--dark-accent)",
              }}
            >
              Select respective address box to update position
            </p>
          </div>
        </>
      ) : (
        isPage === 2 && (
          <>
            <div className="mb-3 position-relative">
              <input
                type="text"
                pattern="[0-9]{1,5}"
                value={startingPrice}
                onChange={(e) =>
                  setStartingPrice(e.target.value.replace(/\D/g, ""))
                }
                className="form-control shadow-none"
                id="owner-register-price"
                placeholder="Enter Starting Price"
              />
            </div>
            <p className="primary-p text-start">Bookings are accepted during</p>
            <div className="row">
              <div className="col-md-auto mb-3 position-relative">
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="form-control shadow-none"
                  id="owner-register-open-time"
                  placeholder="Enter Opening Time"
                />
              </div>
              <div className="col-md-auto mb-3 position-relative">
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="form-control shadow-none"
                  id="owner-register-close-time"
                  placeholder="Enter Closing Time"
                />
              </div>
            </div>
            <div className="mb-3 position-relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength="500"
                className="form-control shadow-none"
                style={{ maxHeight: 200, minHeight: 58 }}
                id="owner-register-description"
                placeholder="Enter Description"
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
                {description.length} / 500
              </span>
            </div>
            <div className="mb-3 position-relative d-flex gap-2">
              <label
                htmlFor="register-owner-upload-images"
                className="secondary-btn"
              >
                Select Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                id="register-owner-upload-images"
              />
              <p
                className="primary-p text-start my-auto"
                style={{ fontSize: 14 }}
              >
                (Upto 5 Images & 25MB)
              </p>
            </div>
            {images.length > 0 && (
              <div className="mb-3 row mx-0 justify-content-start gap-3">
                {Array.from(images).map((i, index) => (
                  <div
                    key={index}
                    className="col-md-auto register-image-card d-flex gap-2"
                  >
                    {i.name.substr(0, 5) + "..." + i.name.substr(-5)}
                    <XCircleIcon
                      width={20}
                      style={{ border: "none", outline: "none" }}
                      tabIndex="-1"
                      onClick={() => {
                        setImages(
                          Array.from(images).filter(
                            (item) => item.name !== i.name
                          )
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mb-3 position-relative">
              <input
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control shadow-none"
                id="owner-register-password"
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
                id="owner-register-confirmpassword"
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
          </>
        )
      )}
      <div className="hstack justify-content-center gap-2 my-3">
        <button
          className="dot-btn"
          style={{
            border: `2px solid ${isPage === 2 ? "var(--dark)" : "transparent"}`,
            backgroundColor: isPage === 1 ? "var(--dark)" : "transparent",
          }}
          onClick={() => setPage(1)}
        />
        <button
          className="dot-btn"
          style={{
            border: `2px solid ${isPage === 1 ? "var(--dark)" : "transparent"}`,
            backgroundColor: isPage === 2 ? "var(--dark)" : "transparent",
          }}
          onClick={() => setPage(2)}
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
            } alert mb-2`}
          role="alert"
        >
          {error.value}
        </div>
      )}
      <button
        type="button"
        className="primary-btn w-100 mt-2"
        onClick={handleRegister}
        disabled={loading}
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
    </>
  );
};

export default OwnerRegister;
