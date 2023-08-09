import { Link } from "react-router-dom";

import img from "../assets/images/404.gif";

const PageNotFound = () => {
  return (
    <section className="min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative bg-white">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-sm-12">
            <h1 style={{ fontSize: 90 }}>404</h1>
            <img src={img} alt="not_found" height="50%" />
            <h3 style={{ fontSize: 42, marginTop: 30 }}>
              Are you lost traveler?
            </h3>
            <p>we didn't find the location you were looking for.</p>
            <Link to="/" className="primary-btn">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
