import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/noto-sans-georgian/standard.css";
import "../styles/global.css";
import "./admin.css";
import Admin from "./Admin.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Admin />
  </React.StrictMode>
);
