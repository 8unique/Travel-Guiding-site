import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

import { loadingGif } from "../utils/images.util";

import useIsDesktop from "../hooks/useIsDesktop";

const ProfileBusiness = () => {
  const PlaceService = require("../services/place.service");

  const isDesktop = useIsDesktop();

  const currentUser = useSelector((state) => state.currentUser);

  const [place, setPlace] = useState(undefined);
  const [tempImages, setTempImages] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    PlaceService.getPlace("id", currentUser.place_id)
      .then((res) => {
        setPlace(res[Object.keys(res)[0]]);
        setTempImages(res[Object.keys(res)[0]].images);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [currentUser]);

  const [error, setError] = useState({
    type: "ERROR",
    value: undefined,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = "Travel Guide - Business Profile";
  }, []);

  const handleSave = async () => {
    if (place.business_name === "") {
      setError({
        type: "ERROR",
        value: "Please provide your business name",
      });
    } else if (place.starting_price === 0 || place.starting_price === "") {
      setError({
        type: "ERROR",
        value: "Please specify your starting price",
      });
    } else if (place.opening_time === "" || place.closing_time === "") {
      setError({
        type: "ERROR",
        value: "Please specify booking schedule hours",
      });
    } else if (place.description === "") {
      setError({
        type: "ERROR",
        value: "Please provide a short business description",
      });
    } else if (
      place.images.length + Array.from(additionalImages).length ===
      0
    ) {
      setError({
        type: "ERROR",
        value: "Please select at least 1 image",
      });
    } else {
      setUpdating(true);
      setError({ type: "WAITING", value: "Updating..." });

      await PlaceService.updateBusinessDetails({
        ...place,
        imagesToBeRemoved: tempImages.filter((obj) => {
          return place.images.indexOf(obj) === -1;
        }),
        additionalImages: Array.from(additionalImages),
      })
        .then((res) => {
          if (res) {
            setUpdating(false);
            setError({
              type: "SUCCESS",
              value: `Details Updated`,
            });
            setAdditionalImages([]);
          }
        })
        .catch((err) => {
          setUpdating(false);
          setError({ type: "ERROR", value: err });
        });
    }
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    if (Array.from(additionalImages).length > 0)
      if (place.images.length + Array.from(additionalImages).length > 5) {
        setError({ type: "ERROR", value: "Please limit the images to 5" });
        setAdditionalImages([]);
      }
    // eslint-disable-next-line
  }, [additionalImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 3000);
    return () => clearInterval(timer);
  }, [error]);

  return (
    <>
      <h1 className="primary-h">Update your business profile</h1>
      <p className="primary-p my-3">
        Need to update your business address, or images perhaps?
        <br />
        Feel free to do so here.
      </p>
      <hr />
      {loading ? (
        <img src={loadingGif} alt="" style={{ width: 32 }} />
      ) : place ? (
        <div className={`${isDesktop ? "w-50" : "w-100"} mt-4`}>
          <div className="mb-3 position-relative">
            <input
              type="text"
              value={place.business_name}
              onChange={(e) =>
                setPlace({ ...place, business_name: e.target.value })
              }
              className="form-control shadow-none"
              id="business-profile-name"
              placeholder="Enter Business Name"
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type="text"
              pattern="[0-9]{1,5}"
              value={place.starting_price}
              onChange={(e) =>
                setPlace({
                  ...place,
                  starting_price: e.target.value.replace(/\D/g, ""),
                })
              }
              className="form-control shadow-none"
              id="business-profile-price"
              placeholder="Enter Starting Price"
            />
          </div>
          <p className="primary-p text-start">Bookings are accepted during</p>
          <div className="row mb-3">
            <div className="col-md-auto position-relative">
              <input
                type="time"
                value={place.opening_time}
                onChange={(e) =>
                  setPlace({
                    ...place,
                    opening_time: e.target.value,
                  })
                }
                className="form-control shadow-none"
                id="business-profile-open-time"
                placeholder="Enter Opening Time"
              />
            </div>
            <div className="col-md-auto position-relative">
              <input
                type="time"
                value={place.closing_time}
                onChange={(e) =>
                  setPlace({
                    ...place,
                    closing_time: e.target.value,
                  })
                }
                className="form-control shadow-none"
                id="business-profile-close-time"
                placeholder="Enter Closing Time"
              />
            </div>
          </div>
          <div className="mb-3 position-relative">
            <textarea
              value={place.description}
              onChange={(e) =>
                setPlace({
                  ...place,
                  description: e.target.value,
                })
              }
              rows={4}
              maxLength="500"
              className="form-control shadow-none"
              style={{ maxHeight: 200, minHeight: 58 }}
              id="business-profile-description"
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
              {place.description.length} / 500
            </span>
          </div>
          <div className="business-profile-img-wrapper mb-3">
            {place.images.map((i, id) => (
              <div key={id} className="img-cont">
                <img src={i} alt={`Business ${id}`} />
                <div className="img-btns">
                  <button
                    onClick={() =>
                      setPlace({
                        ...place,
                        images: place.images.filter((img) => i !== img),
                      })
                    }
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
            {Array.from(additionalImages).map((i, id) => (
              <div key={id} className="img-cont">
                <img
                  src={URL.createObjectURL(i)}
                  alt={`Business Additional ${id}`}
                />
                <div className="img-btns">
                  <button
                    onClick={() =>
                      setAdditionalImages(
                        Array.from(additionalImages).filter((img) => img !== i)
                      )
                    }
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="hstack gap-2 business-profile-img-btns mb-2">
            {place.images.length + Array.from(additionalImages).length < 5 && (
              <>
                <label
                  htmlFor="business-profile-upload-image"
                  className="null-btn my-auto hstack gap-2"
                >
                  <PlusCircleIcon />
                  <p className="primary-p my-auto" style={{ fontSize: 14 }}>
                    (Upto 5 Images)
                  </p>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setAdditionalImages(e.target.files)}
                  style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                  id="business-profile-upload-image"
                />
              </>
            )}
          </div>
          <p
            className="primary-p text-start"
            style={{ fontSize: 14, fontStyle: "italic" }}
          >
            *Make sure to save all your changes, even image updates
          </p>
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
            disabled={updating}
            onClick={handleSave}
          >
            {updating ? (
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
      ) : (
        <>
          <p className="primary-p" style={{ fontWeight: 500 }}>
            An unknown error occured, please try again.
          </p>
        </>
      )}
    </>
  );
};

export default ProfileBusiness;
