import { useState, useEffect } from "react";
import SurahList from "./components/SurahList";
import Reader from "./components/Reader";
import "./App.css";

function App() {
  const [surah, setSurah] = useState(null);
  const [dark, setDark] = useState(false);

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

      {!surah ? (
        <SurahList setSurah={setSurah} />
      ) : (
        <Reader surah={surah} setSurah={setSurah} />
      )}
    </div>
  );
}

export default App;