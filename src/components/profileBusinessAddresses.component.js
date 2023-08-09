import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import GoogleMapReact from "google-map-react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

import { loadingGif } from "../utils/images.util";

import useIsDesktop from "../hooks/useIsDesktop";
import Marker from "./marker.component";

const ProfileBusinessAddresses = () => {
  const PlaceService = require("../services/place.service");

  const isDesktop = useIsDesktop();

  const { currentUser, currentLoc } = useSelector((state) => state);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [emptyAddressesFound, setEmptyAddressesFound] = useState(false);

  const [error, setError] = useState({
    type: "ERROR",
    value: undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Travel Guide - Business Addresses";
  }, []);

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
    (async function () {
      await PlaceService.getPlace("id", currentUser.place_id).then((p) => {
        setAddresses(p[Object.keys(p)[0]].addresses);
      });
    })();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleSave = async () => {
    if (
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
    } else {
      setLoading(true);
      setError({ type: "WAITING", value: "Updating..." });

      await PlaceService.updateBusinessAddresses({
        id: currentUser.place_id,
        addresses: addresses,
      })
        .then((res) => {
          setLoading(false);
          if (res) {
            setError({
              type: "SUCCESS",
              value: `Addresses Updated`,
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
      <h1 className="primary-h">Update your business locations</h1>
      <p className="primary-p my-3">
        Feel free to update your business addresses here.
      </p>
      <hr />
      <div className={`${isDesktop ? "w-50" : "w-100"} mt-4`}>
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
              lat: addresses[0]
                ? addresses[0].lat
                : currentLoc
                ? currentLoc.location.y
                : undefined,
              lng: addresses[0]
                ? addresses[0].lng
                : currentLoc
                ? currentLoc.location.x
                : undefined,
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

export default ProfileBusinessAddresses;
