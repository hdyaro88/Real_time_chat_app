import { UtilityHandler } from "./Context/utilityStore";
import { AuthHandler } from "./Context/authStore";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { theme } from "./Components/HelperFiles/themes";
import React from "react";
import App from "./App";
import "./index.css";
import { MuiThemeProvider } from "@material-ui/core";
ReactDOM.render(
  <BrowserRouter>
    <UtilityHandler>
      <AuthHandler>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </AuthHandler>
    </UtilityHandler>
  </BrowserRouter>,
  document.getElementById("root")
);
