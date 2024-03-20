import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import axios from "axios";
const url =  "https://plms-0a2c20251af6.herokuapp.com";
const url1 = "http://localhost:8080";
axios.defaults.baseURL = url;
axios.defaults.withCredentials = true;

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById("root")
);
