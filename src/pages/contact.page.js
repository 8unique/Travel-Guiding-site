import { EnvelopeIcon } from "@heroicons/react/24/outline";
import useIsDesktop from "../hooks/useIsDesktop";

const Contact = () => {
  const isDesktop = useIsDesktop();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center position-relative my-5"
      id="contact"
    >
      <div className="container">
        <center>
          <h1
            className="secondary-h"
            data-aos="fade-up"
            data-aos-delay="50"
            data-aos-duration="800"
          >
            Got a Question?
          </h1>
          <h1
            className={`primary-h w-${isDesktop ? "50" : "100 px-3"}`}
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            Need our help? We are always at your service.
          </h1>
          <p
            className="primary-p text-center"
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-duration="800"
          >
            Send us an email through our official email,
            <br />
            whether be it regarding an inquiry, or about any suggestions.
            <br />
            We'll get back with you as soon as possible.
          </p>
          <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="800">
            <a href="mailto:kavindulakmal256@gmail.com">
              <button className="primary-btn">
                Shoot an Email <EnvelopeIcon />
              </button>
            </a>
          </div>
        </center>
      </div>
    </div>
  );
};

export default Contact;
