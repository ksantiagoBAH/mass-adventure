import React from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./hooks/useMassContent";
import App from "./App";
import "./style.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider><App /></LanguageProvider>
  </React.StrictMode>,
);
