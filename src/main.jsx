import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import "./styles/index.css";
import SplashScreen from "./components/SplashScreen";
import InstallPrompt from "./components/InstallPrompt";
import LanguagePicker from "./components/LanguagePicker";
import { LangProvider, useLang } from "./lib/LangContext";

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { lang } = useLang();

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      {splashDone && !lang ? (
        <LanguagePicker />
      ) : (
        <RouterProvider router={router} />
      )}
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
