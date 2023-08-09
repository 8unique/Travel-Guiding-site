import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import AOS from "aos";

import { auth } from "../config/firebase.config";
import { loadingGif } from "../utils/images.util";
import { setCurrentUser, setCurrentLoc } from "../redux/actions";

import Navbar from "../components/navbar.component";

import App from "../App";
import Explore from "../pages/explore.page";
import Place from "../pages/place.page";
import Login from "../pages/login.page";
import Regsiter from "../pages/register.page";
import Profile from "../pages/profile.page";
import PageNotFound from "../pages/404.page";

import Footer from "../components/footer.component";

const Routing = () => {
  const UserService = require("../services/user.service");

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  const [loc, setLoc] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  useEffect(() => {
    loc && dispatch(setCurrentLoc(loc));
    // eslint-disable-next-line
  }, [loc]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          axios
            .get(
              `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${
                pos.coords.longitude + "," + pos.coords.latitude
              }&langCode=fr&outSR=&forStorage=false&f=pjson`
            )
            .then((res) => {
              setLoc(res.data);
            });
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              toast(
                "Geolocation access denied, please provide access to your location"
              );
              break;
            case err.POSITION_UNAVAILABLE:
              toast("Location information is unavailable.");
              break;
            case err.TIMEOUT:
              toast("The request to get user location timed out.");
              break;
            case err.UNKNOWN_ERROR:
            default:
              toast("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      toast("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await UserService.getUser("id", user.uid)
          .then((res) => {
            dispatch(setCurrentUser(res[user.uid]));
            setLoading(false);
          })
          .catch(() => {
            dispatch(setCurrentUser(undefined));
            setLoading(false);
          });
      } else {
        dispatch(setCurrentUser(undefined));
        setLoading(false);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <ReactTooltip
        effect="solid"
        className="tooltip"
        clickable={true}
        place="right"
        html={true}
      />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        closeButton={false}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="dark"
        toastClassName="toastify"
        rtl={false}
        draggable
        pauseOnHover
      />
      <Navbar loading={loading} />
      {loading ? (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <div className="hstack justify-content-center gap-2">
            <img src={loadingGif} alt="" style={{ width: 32 }} />
            <p
              className="primary-p my-auto"
              style={{ fontSize: 18, fontWeight: 500, opacity: 0.6 }}
            >
              Almost there!
            </p>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route exact path="/" element={<App />} />
          <Route exact path="/explore" element={<Explore />} />
          <Route exact path="/place/:id" element={<Place />} />

          <Route
            exact
            path="/login"
            element={!currentUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/register"
            element={!currentUser ? <Regsiter /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      )}
      <Footer />
    </>
  );
};

export default Routing;
