import React from "react";
import ReactDOM from "react-dom/client";
import { I18nProvider } from "./i18n.jsx";
import App from "./App.jsx";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/noto-sans-georgian/standard.css";
import "./styles/global.css";
import "./styles/sections.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
