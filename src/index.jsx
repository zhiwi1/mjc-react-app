import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {NotFound}  from "../src/components/NotFound"
import {BrowserRouter, Route, Routes, Redirect} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import store from "./reducers";
import { Provider } from "react-redux";

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);

