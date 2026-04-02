import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { appTheme } from "./theme/appTheme";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AdminAuthProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
