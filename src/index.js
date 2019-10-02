import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import "./css/style.css";
import App from "./pages/App";

import * as registerServiceWorker from "./service-worker";

ReactDOM.render(<App />, document.getElementById("root"));

registerServiceWorker.register();
