import { useEffect, useState } from "react";
import { useTransition, animated } from "react-spring";
import { useSelector } from "react-redux";
import GoogleMapReact from "google-map-react";

import Place from "../components/place.component";
import useIsDesktop from "../hooks/useIsDesktop";
import { loadingGif } from "../utils/images.util";
import Marker from "../components/marker.component";

const Explore = () => {
  const isDesktop = useIsDesktop();

  const PlaceService = require("../services/place.service");

  const currentLoc = useSelector((state) => state.currentLoc);
  const [mapCenter, setMapCenter] = useState({
    lat: undefined,
    lng: undefined,
    zoom: 14,
  });

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    (async function () {
      await PlaceService.getPlaces(currentLoc)
        .then((res) => {
          var localPlaces = [];
          Object.keys(res).forEach((key) => {
            localPlaces.push(res[key]);
          });
          setPlaces(localPlaces);
        })
        .catch(() => {});
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    currentLoc &&
      setMapCenter({
        lat: currentLoc.location.y,
        lng: currentLoc.location.x,
        zoom: 14,
      });
  }, [currentLoc]);

  useEffect(() => {
    document.title = "Travel Guide - Explore";
  }, []);

  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    setFilteredPlaces(places);
  }, [places]);

  const handleFilter = (filterBy) => {
    setFilteredPlaces(
      filterBy !== "All"
        ? places.filter((e) => e.business_type === filterBy)
        : places
    );
  };

  const transition = useTransition(filteredPlaces, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: 150,
    },
  });

  return (
    <div
      id="explore"
      className="d-flex flex-column justify-content-center align-items-center position-relative"
    >
      <div className="container position-relative">
        {!currentLoc ? (
          <>
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
          </>
        ) : (
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-12 position-relative">
              <div className="maps-container">
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                  }}
                  center={{
                    lat: mapCenter.lat,
                    lng: mapCenter.lng,
                  }}
                  zoom={mapCenter.zoom}
                  yesIWantToUseGoogleMapApiInternals
                  onDrag={(e) =>
                    setMapCenter({
                      lat: e.lat,
                      lng: e.lng,
                      zoom: 14,
                    })
                  }
                >
                  <Marker
                    lat={currentLoc.location.y}
                    lng={currentLoc.location.x}
                    text="You"
                  />
                  {filteredPlaces.map((p) => (
                    <Marker
                      key={p.id}
                      lat={p.addresses[0].lat}
                      lng={p.addresses[0].lng}
                      text={p.business_name}
                    />
                  ))}
                </GoogleMapReact>
              </div>
            </div>
            <div
              className={`col-xl-6 col-lg-6 col-md-12 places-wrapper " ${
                !isDesktop && "text-center mb-4"
              }`}
            >
              <div className="places-header">
                <h1 className="primary-h">{places.length} Places Near You</h1>
                <p className="primary-p">
                  Sorry traveler, no nearby places were found.
                  <br />
                  But keep{" "}
                  <span style={{ color: "var(--secondary)" }}>exploring!</span>
                </p>
                {places.length > 0 && (
                  <div
                    className={`row justify-content-${
                      isDesktop ? "start" : "center"
                    } gap-3 mx-1 mt-3`}
                  >
                    <button
                      className="col-md-auto light-btn"
                      onClick={() => handleFilter("All")}
                    >
                      All
                    </button>
                    {Object.entries(
                      places.reduce((prev, { business_type }) => {
                        prev[business_type] = prev[business_type]
                          ? prev[business_type] + 1
                          : 1;
                        return prev;
                      }, {})
                    )
                      .map(([business_type, count]) => ({
                        business_type,
                        count,
                      }))
                      .sort((a, b) => b.count - a.count)
                      .map((item, index) => (
                        <button
                          key={index}
                          className="col-md-auto light-btn"
                          onClick={() => handleFilter(item.business_type)}
                        >
                          <span className="badge">
                            {item.count > 9 ? "9+" : item.count}
                          </span>
                          {item.business_type}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              {places.length > 0 && (
                <div className="places-cont">
                  {transition((style, place) => {
                    return (
                      <animated.div style={style} className="place">
                        <Place place={place} setMapCenter={setMapCenter} />
                      </animated.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
