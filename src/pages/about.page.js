import {
  MapIcon,
  SparklesIcon,
  SunIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";

const About = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center position-relative mb-5 p-4"
      id="about"
    >
      <div className="container">
        <h1
          className="secondary-h"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          About Travel
        </h1>
        <br />
        <div className="row justify-content-center">
          <div
            className="col-xl-6 col-lg-6 col-md-12 about-card-wrapper"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <div className="about-card">
              <SunIcon />
              <h3>24x7</h3>
              <p>
                No matter the time, hop in anytime to check around you. You'd
                find what you seek within seconds!
              </p>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 col-md-12 about-card-wrapper"
            data-aos="fade-down"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <div className="about-card">
              <SparklesIcon />
              <h3>Lots of Choices</h3>
              <p>
                Choose wisely out of various hotels and restaurants - for they
                offer diverse range of options.
              </p>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 col-md-12 about-card-wrapper"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <div className="about-card">
              <MapIcon />
              <h3>Best Travel Guide</h3>
              <p>
                You'd find Travel Guide to be much easier to use as you explore!
              </p>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 col-md-12 about-card-wrapper"
            data-aos="fade-down"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <div className="about-card">
              <TicketIcon />
              <h3>Easy Booking</h3>
              <p>
                Place reservations at many places as you wish. It's something
                that you can do without any hassle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
