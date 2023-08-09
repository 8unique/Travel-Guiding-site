import { useEffect } from "react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import ReactTooltip from "react-tooltip";

const Marker = ({ text }) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return <MapPinIcon data-tip={text} className="map-marker" />;
};

export default Marker;
