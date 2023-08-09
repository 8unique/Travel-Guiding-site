import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon } from "@heroicons/react/24/solid";
import ReactTooltip from "react-tooltip";

const Place = ({ place, setMapCenter }) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <div className="img-cont">
        <Link
          to={`/place/${place.business_id}`}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <img src={place.images[0]} alt={place.business_name} />
        </Link>
        <h4>Rs.{place.starting_price} Onwards</h4>
        <button
          className="map-btn"
          data-tip="Show on map"
          onClick={(e) => {
            setMapCenter({
              lat: place.addresses[0].lat,
              lng: place.addresses[0].lng,
              zoom: 14,
            });
          }}
        >
          <MapPinIcon width={24} />
        </button>
      </div>
      <Link
        to={`/place/${place.business_id}`}
        style={{ textDecoration: "none", cursor: "pointer" }}
      >
        <h3>{place.business_name}</h3>
      </Link>
      <p>{place.addresses[0].address}</p>
    </>
  );
};

export default Place;
