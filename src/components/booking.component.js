import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

const Booking = ({
  data,
  handleApprove,
  handleDeny,
  handleCancel,
  handlePostpone,
  setProceed,
  setConfirmationText,
}) => {
  const currentUser = useSelector((state) => state.currentUser);

  const PlaceService = require("../services/place.service");

  const [place, setPlace] = useState(undefined);

  useEffect(() => {
    (async function () {
      await PlaceService.getPlace("id", data.place_id).then((res) => {
        setPlace(res[Object.keys(res)[0]]);
      });
    })();
    // eslint-disable-next-line
  }, [data]);

  return (
    place && (
      <div className="col-md-auto">
        <div className={`booking booking-${data.status.toLowerCase()}`}>
          <div>
            <h3>
              @
              <Link className="link" to={`/place/${place.business_id}`}>
                {place.business_name}{" "}
              </Link>
            </h3>
            {currentUser.id !== data.user_id && (
              <h4>
                By {currentUser.name} ({currentUser.phone_number})
              </h4>
            )}
            {data.status !== "Cancelled" ? (
              <p className="primary-p date">
                Booked for <span>{moment(data.booked_at).format("lll")}</span>
              </p>
            ) : (
              <p className="primary-p date">Booking was cancelled</p>
            )}
            <p className={`status status-${data.status.toLowerCase()}`}>
              {data.status}
            </p>
            {data.last_updated && (
              <p className="last-updated">
                Last Updated:{" "}
                <span>{moment(data.last_updated).format("lll")}</span>
              </p>
            )}
          </div>
          <div className="button-grid">
            {data.status !== "Cancelled" && data.status !== "Denied" && (
              <>
                <button
                  className="light-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmationModal"
                  onClick={() => {
                    setConfirmationText(
                      `Are you sure you want to postpone your reservation @<span style='font-weight: 500'>${place.business_name}</span>`
                    );
                    setProceed({
                      bookingId: data.id,
                      method: handlePostpone,
                    });
                  }}
                >
                  Postpone
                </button>
                <button
                  className="secondary-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmationModal"
                  onClick={() => {
                    setConfirmationText(
                      `Are you sure you want to cancel your reservation @<span style='font-weight: 500'>${place.business_name}</span>`
                    );
                    setProceed({
                      bookingId: data.id,
                      method: handleCancel,
                    });
                  }}
                >
                  Cancel
                </button>
              </>
            )}
            {currentUser.user_type === "Business Owner" &&
              currentUser.place_id === data.place_id && (
                <>
                  {data.status !== "Approved" && (
                    <button
                      className="light-btn approve-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationModal"
                      onClick={() => {
                        setConfirmationText(
                          `Are you sure you want to approve the reservation made by <span style='font-weight: 500'>${currentUser.name}</span>`
                        );
                        setProceed({
                          bookingId: data.id,
                          method: handleApprove,
                        });
                      }}
                    >
                      Approve
                    </button>
                  )}
                  {data.status !== "Denied" && (
                    <button
                      className="secondary-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationModal"
                      onClick={() => {
                        setConfirmationText(
                          `Are you sure you want to deny the reservation made by <span style='font-weight: 500'>${currentUser.name}</span>`
                        );
                        setProceed({
                          bookingId: data.id,
                          method: handleDeny,
                        });
                      }}
                    >
                      Deny
                    </button>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
    )
  );
};

export default Booking;
