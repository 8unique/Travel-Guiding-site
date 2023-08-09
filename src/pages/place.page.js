import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";
import {
  StarIcon as StartIconOutline,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Rating } from "react-simple-star-rating";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactTooltip from "react-tooltip";

import BookingModal from "../components/bookingModal.component";
import { loadingGif } from "../utils/images.util";

const Place = () => {
  const PlaceService = require("../services/place.service");

  const { id } = useParams();

  const currentUser = useSelector((state) => state.currentUser);

  const [place, setPlace] = useState(undefined);

  useEffect(() => {
    PlaceService.getPlace("business_id", parseInt(id, 10)).then((res) => {
      const place = res[Object.keys(res)[0]];
      PlaceService.updateBusinessVisits({
        ...place,
        visits: place.visits ? place.visits + 1 : 1,
      });
      setPlace(place);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (place) {
      document.title = "Travel Guide - " + place.business_name;
    }
  }, [place]);

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingAvg, setRatingAvg] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [isDateInvalid, setDateInvalid] = useState(false);

  const [error, setError] = useState({ type: "ERROR", value: undefined });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    place && refreshReviews();
    // eslint-disable-next-line
  }, [place]);

  const refreshReviews = async () => {
    await PlaceService.getReviews(parseInt(id, 10)).then((res) => {
      var reviews = [];
      if (res) {
        Object.keys(res).forEach((key) => {
          reviews.push(res[key]);
        });
        setRatingAvg(
          Math.ceil(
            reviews.reduce((acc, obj) => {
              return acc + obj.rating;
            }, 0) / reviews.length
          )
        );
      }
      setReviews(reviews);
    });
  };

  const handleSubmitReview = async () => {
    if (!currentUser) {
      setError({
        type: "ERROR",
        value: "Must be logged in to review",
      });
    } else {
      if (rating === 0) {
        setError({
          type: "ERROR",
          value: "Please rate atleast 1 star",
        });
      } else {
        setLoading(true);
        setError({ type: "WAITING", value: "Creating..." });
        await PlaceService.createReview({
          placeId: place.id,
          review: review,
          reviewerId: currentUser.id,
          rating: rating,
          name: currentUser.name,
        })
          .then((res) => {
            setLoading(false);
            if (res) {
              resetFields();
              setError({
                type: "SUCCESS",
                value: "Feedback received, thank you.",
              });
              refreshReviews();
            }
          })
          .catch((err) => {
            setLoading(false);
            setError({ type: "ERROR", value: err });
          });
      }
    }
  };

  const resetFields = () => {
    setReview("");
    setRating(0);
  };

  useEffect(() => {
    place &&
      setDateInvalid(
        moment(place.opening_time, "HH:mm").isAfter(moment()) ||
          moment(place.closing_time, "HH:mm").isBefore(moment())
      );
  }, [place]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div
      id="place-single"
      className="d-flex flex-column justify-content-center align-items-center position-relative"
    >
      {!place ? (
        <img
          src={loadingGif}
          alt="loading_gif"
          style={{
            margin: 0,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 80,
          }}
        />
      ) : (
        <div className="container place-single my-5">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12">
              <Carousel
                labels={false}
                showIndicators={false}
                showArrows={false}
                showStatus={false}
                emulateTouch={true}
                thumbWidth={100}
                className="places-carousel"
              >
                {place.images.map((img, index) => (
                  <img key={index} src={img} alt="place-img" />
                ))}
              </Carousel>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="content">
                <h1 className="primary-h">{place.business_name}</h1>
                <h5>
                  <MapPinIcon /> {place.addresses[0].address}
                </h5>
                <div className="place-rating hstack gap-1">
                  {[...Array(5).keys()].map((key, i) =>
                    (i + 1) * 2 <= ratingAvg ? (
                      <StarIcon key={key} className="filled" />
                    ) : (i + 1) * 2 - ratingAvg < 2 ? (
                      <StarIcon key={key} className="filled" />
                    ) : (
                      <StartIconOutline key={key} className="outlined" />
                    )
                  )}
                  <h4>{ratingAvg + ".0"}</h4>
                  <h5
                    style={{
                      marginLeft: 5,
                      color: "var(--primary)",
                      opacity: 1,
                      fontWeight: 700,
                    }}
                  >
                    {" "}
                    ({reviews.length})
                  </h5>
                </div>
                <h3>Rs.{place.starting_price} Onwards</h3>
                <p className="primary-p">
                  Anim fugiat mollit eu qui veniam. Ea sunt exercitation dolore
                  dolor ipsum eiusmod sit eiusmod nostrud ullamco veniam cillum
                  culpa ut. Pariatur anim ad laboris elit dolore. Aliqua tempor
                  nulla officia ex amet quis ad ex id.
                </p>
                <div className="hstack gap-3">
                  <button
                    className="light-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span
                      className="time-label"
                      style={{
                        color: isDateInvalid ? "var(--error)" : "var(--dark)",
                      }}
                    >
                      <ClockIcon
                        style={{
                          stroke: isDateInvalid
                            ? "var(--error)"
                            : "var(--dark)",
                        }}
                      />
                      {isDateInvalid
                        ? `Opens At ${moment(
                            place.opening_time,
                            "HH:mm"
                          ).format("H:mm A")}`
                        : "Open Now"}
                    </span>
                  </button>
                  <button
                    className="primary-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#bookingModal"
                  >
                    Book Now
                  </button>
                </div>
                <BookingModal place={place} />
                <div className="hstack gap-2 my-3">
                  <p className="primary-p mb-0">Enjoyed their service?</p>
                  <Rating
                    onClick={(rate) => setRating(rate)}
                    initialValue={rating}
                    fillIcon={<StarIcon className="star-rating filled" />}
                    emptyIcon={
                      <StartIconOutline className="star-rating outlined" />
                    }
                    transition={true}
                  />
                </div>
                <div className="mb-3 position-relative">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    maxLength="500"
                    className="form-control shadow-none"
                    style={{ maxHeight: 100, minHeight: 58 }}
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
                    {review.length} / 500
                  </span>
                </div>
                <div className="hstack gap-3 mt-2 justify-content-end">
                  {error.value && (
                    <div
                      className={`
            ${
              error.type === "ERROR"
                ? "alert-danger"
                : error.type === "WAITING"
                ? "alert-warning"
                : error.type === "SUCCESS" && "alert-success"
            } alert my-auto`}
                      role="alert"
                    >
                      {error.value}
                    </div>
                  )}
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={loading}
                    onClick={handleSubmitReview}
                  >
                    Submit
                  </button>
                </div>
                <div className="review-wrapper">
                  {reviews.map((review) => (
                    <div key={review.id} className="review">
                      <div className="d-flex gap-2">
                        <p className="title">{review.name}</p>
                        <div className="rated">
                          <StarIcon className="filled" />
                          <h4>{review.rating}</h4>
                        </div>
                        <small className="ms-auto">
                          {moment(
                            review.placed_at,
                            "YYYY-MM-DD HH:mm"
                          ).fromNow()}
                        </small>
                      </div>
                      <p className="primary-p mb-0">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Place;
