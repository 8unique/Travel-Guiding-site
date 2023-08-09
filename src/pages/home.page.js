import moment from "moment";
import { Link } from "react-router-dom";
import {
  GlobeEuropeAfricaIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

import useIsDesktop from "../hooks/useIsDesktop";
import { homeImg } from "../utils/images.util";

const Home = () => {
  const isDesktop = useIsDesktop();

  const currentLoc = useSelector((state) => state.currentLoc);

  return (
    <div
      id="home"
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative"
    >
      <div className="container text-center">
        <div data-aos="fade-down" data-aos-delay="100" data-aos-duration="800">
          <Link to="/explore" className="secondary-btn">
            <GlobeEuropeAfricaIcon />
            Explore Around You
          </Link>
        </div>
        <h1
          className="primary-h my-4"
          style={{ fontSize: 72, lineHeight: "72px" }}
          data-aos="fade-down"
          data-aos-delay="0"
          data-aos-duration="800"
        >
          It's a Big World
          <br />
          Out There, Go
          <br />
          Explore
        </h1>
        <p
          className="primary-p text-center"
          style={{ fontWeight: 500 }}
          data-aos="fade-down"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          From hotels to restaurants, perhaps even more!
          <br />
          Find out where you can have a good night's sleep or hang out during
          the day.
          <br />
          If you are a tad hesitant about choosing a place,
          <br />
          you can always rely on a their reviews or even give them a call.
        </p>
        <div
          className="mt-4 home-card hstack justify-content-center mx-auto"
          data-aos="fade-down"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <MapPinIcon />
          <div className="content">
            <h3>Location</h3>
            <p>
              {currentLoc &&
                currentLoc.address.City + ", " + currentLoc.address.CntryName}
            </p>
          </div>
          <div className="divider-sm" />
          <CalendarDaysIcon />
          <div className="content">
            <h3>Date</h3>
            <p>{moment().format("Do MMM YY")}</p>
          </div>
        </div>

        <img
          src={homeImg}
          alt="Arugambay Beach"
          data-aos="fade-left"
          data-aos-delay="100"
          data-aos-duration="800"
          style={{
            position: "absolute",
            zIndex: -1,
            margin: "auto 15%",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: isDesktop ? "35%" : "75%",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
