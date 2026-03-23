import { createContext, useContext, useState, useEffect } from "react";
import { t } from "../lib/lang";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("unsent_lang") || null,
  );

  const chooseLang = (code) => {
    localStorage.setItem("unsent_lang", code);
    setLang(code);
  };

  return (
    <LangContext.Provider
      value={{ lang, chooseLang, t: lang ? t[lang] : t["en"] }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
