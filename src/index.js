import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import reportWebVitals from "./reportWebVitals";

import Routing from "./router/router";
import store from "./redux/store";

import "./styles/styles.scss";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <Router>
      <Routing />
    </Router>
  </Provider>
);

reportWebVitals();
