import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClockIcon } from "@heroicons/react/24/outline";

import { setProfileSection } from "../redux/actions";

import { loadingGif } from "../utils/images.util";

const ProfileBusinessDashboard = () => {
  const PlaceService = require("../services/place.service");

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.currentUser);

  const [data, setData] = useState(undefined);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Travel Guide - Dashboard";
  }, []);

  useEffect(() => {
    (async function () {
      await PlaceService.getDashboardData(currentUser.place_id)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    })();
    // eslint-disable-next-line
  }, [currentUser]);

  return (
    <>
      <h1 className="primary-h mb-4">Dashboard</h1>
      {loading ? (
        <img src={loadingGif} alt="" style={{ width: 48 }} />
      ) : (
        <div className="row justify-content-center gap-xl-3">
          <div
            className="col-xl-3 col-md-6 mb-4 dashboard-card"
            onClick={() => dispatch(setProfileSection(1))}
          >
            <h3>Bookings</h3>
            <h5>{data.bookings}</h5>
            <p>
              <ClockIcon /> Last 14 Days
            </p>
          </div>
          <div className="col-xl-4 col-md-6 mb-4 dashboard-card">
            <h3>Expected Revenue</h3>
            <h5>Rs.{data.startingPrice}</h5>
          </div>
          <div className="col-xl-3 col-md-6 mb-4 dashboard-card">
            <h3>Visits</h3>
            <h5>{data.visits}</h5>
            <p>
              <ClockIcon /> Last 14 Days
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileBusinessDashboard;
