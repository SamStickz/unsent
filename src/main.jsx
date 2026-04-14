import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import "./styles/index.css";
import ShelbySplash from "./components/ShelbySplash";
import SplashScreen from "./components/SplashScreen";
import InstallPrompt from "./components/InstallPrompt";
import LanguagePicker from "./components/LanguagePicker";
import { LangProvider, useLang } from "./lib/LangContext";

function App() {
  const [phase, setPhase] = useState("shelby");
  const { lang } = useLang();

  return (
    <>
      {phase === "shelby" && <ShelbySplash onDone={() => setPhase("loader")} />}
      {phase === "loader" && <SplashScreen onDone={() => setPhase("app")} />}
      {phase === "app" &&
        (!lang ? <LanguagePicker /> : <RouterProvider router={router} />)}
      <InstallPrompt />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </React.StrictMode>,
);
