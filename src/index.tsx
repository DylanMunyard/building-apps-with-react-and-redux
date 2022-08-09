import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import App from "./features/App";
import { Provider as ReduxProvider } from "react-redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import "./index.css";
import {store, history } from './configureStore';

render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('app')
);