import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

import { loadingGif } from "../utils/images.util";

import Booking from "./booking.component";
import ConfirmationModal from "./confirmationModal.component";
import useIsDesktop from "../hooks/useIsDesktop";

const ProfileBookings = () => {
  const UserService = require("../services/user.service");

  const isDesktop = useIsDesktop();

  const currentUser = useSelector((state) => state.currentUser);

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [confirmationText, setConfirmationText] = useState(false);
  const [proceed, setProceed] = useState(undefined);

  useEffect(() => {
    document.title = "Travel Guide - Bookings";
  }, []);

  useEffect(() => {
    currentUser && refreshBookings();
    // eslint-disable-next-line
  }, [currentUser]);

  const refreshBookings = async () => {
    await UserService.getUserBookings(
      currentUser.id,
      currentUser.user_type === "Business Owner"
        ? currentUser.place_id
        : undefined
    )
      .then((res) => {
        var tempBookings = [];
        Object.keys(res).forEach((key) => {
          tempBookings.push(res[key]);
        });
        setBookings(tempBookings);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleApprove = async (bookingId) => {
    await UserService.updateBookingStatus(bookingId, "Approved").then(() => {
      toast("Booking Approved.");
      refreshBookings();
    });
  };

  const handleDeny = async (bookingId) => {
    await UserService.updateBookingStatus(bookingId, "Denied").then(() => {
      toast("Booking Denied.");
      refreshBookings();
    });
  };

  const handleCancel = async (bookingId) => {
    await UserService.updateBookingStatus(bookingId, "Cancelled").then(() => {
      toast("Booking Cancelled.");
      refreshBookings();
    });
  };

  const handlePostpone = async (bookingId, postponedDate) => {
    await UserService.updateBookingPostponement(bookingId, postponedDate).then(
      () => {
        toast("Booking Postponed.");
        refreshBookings();
      }
    );
  };

  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  const handleFilter = (filterBy) => {
    setFilteredBookings(
      filterBy !== "All"
        ? bookings.filter((e) => e.status === filterBy)
        : bookings
    );
  };

  return (
    <>
      <h1 className="primary-h">Bookings</h1>
      <p className="primary-p my-3">
        Check your recent bookings <br /> Cancel or postpone them if need be.
      </p>
      <div className="bookings-wrapper">
        {loading ? (
          <img src={loadingGif} alt="" style={{ width: 32 }} />
        ) : bookings.length > 0 ? (
          <>
            <div
              className={`row justify-content-${
                isDesktop ? "start" : "center"
              } gap-3 mx-1 mb-3`}
            >
              <button
                className="col-md-auto light-btn"
                onClick={() => handleFilter("All")}
              >
                All
              </button>
              {Object.entries(
                bookings.reduce((prev, { status }) => {
                  prev[status] = prev[status] ? prev[status] + 1 : 1;
                  return prev;
                }, {})
              )
                .map(([status, count]) => ({
                  status,
                  count,
                }))
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                  <button
                    key={index}
                    className="col-md-auto light-btn"
                    onClick={() => handleFilter(item.status)}
                  >
                    <span className="badge">
                      {item.count > 9 ? "9+" : item.count}
                    </span>
                    {item.status}
                  </button>
                ))}
            </div>
            <div className="row">
              {filteredBookings.map((b) => (
                <Booking
                  key={b.id}
                  data={b}
                  handleCancel={handleCancel}
                  handlePostpone={handlePostpone}
                  handleApprove={handleApprove}
                  handleDeny={handleDeny}
                  setProceed={setProceed}
                  setConfirmationText={setConfirmationText}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="primary-p" style={{ fontWeight: 500 }}>
              You haven't placed any bookings yet.
            </p>
            <Link className="primary-btn w-auto">Explore Now</Link>
          </>
        )}
      </div>
      <ConfirmationModal
        icon={<ExclamationCircleIcon width={48} fill={"var(--warning)"} />}
        text={confirmationText}
        proceed={proceed}
      />
    </>
  );
};

export default ProfileBookings;
