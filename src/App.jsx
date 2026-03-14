import { useState, useEffect } from "react";
import SurahList from "./components/SurahList";
import Reader from "./components/Reader";
import ReciterProfile from "./components/ReciterProfile";
import "./App.css";

function App() {
  const [surah, setSurah] = useState(null);
  const [dark, setDark] = useState(false);
  const [learningMode, setLearningMode] = useState(
    () => JSON.parse(localStorage.getItem("learningMode")) || false
  );

  const [reciter, setReciter] = useState(() => {
    return localStorage.getItem("reciter") || "1";
  });

  useEffect(() => {
    localStorage.setItem("reciter", reciter);
  }, [reciter]);

  useEffect(() => {
    localStorage.setItem("learningMode", JSON.stringify(learningMode));
  }, [learningMode]);

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

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <button className="dark-toggle" onClick={() => setDark(!dark)}>
          {dark ? "Light Mode" : "Night Mode"}
        </button>

        <button
          className="dark-toggle"
          onClick={() => setLearningMode(!learningMode)}
        >
          {learningMode ? "Normal Mode" : "Learning Mode"}
        </button>
      </div>

      <ReciterProfile reciter={reciter} setReciter={setReciter} />

      {!surah ? (
        <SurahList setSurah={setSurah} learningMode={learningMode} />
      ) : (
        <Reader
          surah={surah}
          setSurah={setSurah}
          reciter={reciter}
          learningMode={learningMode}
        />
      )}
    </div>
  );
}

export default App;