import { useState, useEffect } from "react";
import SurahList from "./components/SurahList";
import Reader from "./components/Reader";
import ReciterProfile from "./components/ReciterProfile";
import "./App.css";

function App() {
  const [surah, setSurah] = useState(null);
  const [dark, setDark] = useState(false);

  // Global reciter with localStorage
  const [reciter, setReciter] = useState(() => {
    return localStorage.getItem("reciter") || "1";
  });

  useEffect(() => {
    // Save selection to localStorage
    localStorage.setItem("reciter", reciter);
  }, [reciter]);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="app-container">
      <h1 className="title">Qur'an</h1>

      <button className="dark-toggle" onClick={() => setDark(!dark)}>
        {dark ? "Light Mode" : "Night Mode"}
      </button>

      {/* Reciter selection */}
      <ReciterProfile reciter={reciter} setReciter={setReciter} />

      {!surah ? (
        <SurahList setSurah={setSurah} />
      ) : (
        <Reader surah={surah} setSurah={setSurah} reciter={reciter} />
      )}
    </div>
  );
}

export default App;