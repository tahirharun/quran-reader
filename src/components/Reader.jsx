import { useEffect, useState, useRef } from "react";
import axios from "axios";

const RECITER_AUDIO = {
  "1": "Alafasy_128kbps",
  "2": "Abdul_Basit_Mujawwad_128kbps",
  "3": "Ghamadi_40kbps",
  "4": "Abdurrahmaan_As-Sudais_192kbps",
};

const simpleTransliteration = (text) => {
  return text
    .replace(/بسم/g, "Bism")
    .replace(/الله/g, "Allāh")
    .replace(/الرحمن/g, "ar-Raḥmān")
    .replace(/الرحيم/g, "ar-Raḥīm")
    .replace(/محمد/g, "Muhammad")
    .replace(/\s+/g, " ")
    .trim();
};

function Reader({ surah, setSurah, reciter, learningMode, readMode }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [speed, setSpeed] = useState(0.8);
  const [volume, setVolume] = useState(1);
  const [bookmark, setBookmark] = useState(() => {
    const saved = localStorage.getItem(`bookmark-surah-${surah}`);
    return saved ? parseInt(saved) : null;
  });

  const audioRef = useRef(null);

  useEffect(() => {
    if (!surah) return;
    setLoading(true);

    const loadSurah = async () => {
      try {
        const res = await axios.get(`https://quranapi.pages.dev/api/${surah}.json`);
        const data = res.data;

        const ayahs = data.arabic1.map((text, i) => {
          const text_clean = surah !== 1 ? text.replace(/^بسم الله الرحمن الرحيم\s*/, "") : text;
          const transliteration = simpleTransliteration(text_clean);
          const transliterationWords = text_clean.split(" ").map(simpleTransliteration);

          return {
            verse_number: i + 1,
            text_uthmani: text_clean,
            translation: data.english[i] || "Translation unavailable",
            tafsir: data.tafsir ? data.tafsir[i] : "Tafsir unavailable",
            transliteration,
            transliterationWords,
          };
        });

        setVerses(ayahs);
      } catch (err) {
        console.error("Error loading surah:", err);
      }
      setLoading(false);
    };

    loadSurah();

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [surah]);

  useEffect(() => {
    if (playingIndex !== null) {
      const el = document.getElementById(`ayah-${playingIndex}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playAudio = (index) => {
    if (audioRef.current) audioRef.current.pause();

    const ayahNumber = index + 1;
    const surahStr = String(surah).padStart(3, "0");
    const ayahStr = String(ayahNumber).padStart(3, "0");
    const reciterFolder = RECITER_AUDIO[reciter];
    const audioUrl = `https://everyayah.com/data/${reciterFolder}/${surahStr}${ayahStr}.mp3`;

    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.playbackRate = learningMode && !readMode ? speed : 1;
    audioRef.current = audio;
    setPlayingIndex(index);
    audio.play();

    audio.onended = () => {
      if (index + 1 < verses.length) playAudio(index + 1);
      else setPlayingIndex(null);
    };
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingIndex(null);
    }
  };

  const playFullSurah = () => playAudio(0);

  const toggleBookmark = (index) => {
    if (bookmark === index) {
      setBookmark(null);
      localStorage.removeItem(`bookmark-surah-${surah}`);
    } else {
      setBookmark(index);
      localStorage.setItem(`bookmark-surah-${surah}`, index);
    }
  };

  const goToBookmark = () => {
    if (bookmark !== null) {
      const el = document.getElementById(`ayah-${bookmark}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) return <p>Loading Surah...</p>;

  return (
    <div className="reader-container">
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button className="back-button" onClick={() => setSurah(null)}>⬅ Back to Surah List</button>

        {bookmark !== null && (
          <button
            onClick={goToBookmark}
            style={{ background: "#2196f3", color: "white", padding: "6px 12px", borderRadius: "6px" }}
          >
            ↑ Go to Bookmark
          </button>
        )}
      </div>

      <h2 className="surah-title">Surah {surah}</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "12px" }}>
        <label>
          Volume: {(volume * 100).toFixed(0)}%
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ marginLeft: "8px" }} />
        </label>

        {learningMode && !readMode && (
          <label>
            Audio Speed: {speed.toFixed(2)}x
            <input type="range" min="0.5" max="1.2" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} style={{ marginLeft: "8px" }} />
          </label>
        )}

        <button onClick={playFullSurah}>▶ Play Full Surah</button>
      </div>

      <div className="verses">
        {verses.map((v, index) => (
          <div
            key={index}
            id={`ayah-${index}`}
            className={`verse ${playingIndex === index ? "active-ayah" : ""} ${bookmark === index ? "bookmarked-ayah" : ""}`}
          >
            <p className="arabic">
              {v.text_uthmani}{" "}
              <span className={`ayah-number ${readMode ? "readmode-number" : ""}`}>{v.verse_number}</span>
            </p>

            {!readMode && (
              <>
                {learningMode && <p className="translation-inline">{v.transliteration}</p>}
                <p className="translation">{v.translation}</p>
                {learningMode && <div className="tafsir">{v.tafsir}</div>}
              </>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
              <button onClick={() => (playingIndex === index ? pauseAudio() : playAudio(index))}>
                {playingIndex === index ? "Pause Audio" : "Play Audio"}
              </button>
              <button
                onClick={() => toggleBookmark(index)}
                style={{ background: bookmark === index ? "#ffb300" : "#4caf50", color: "white", padding: "4px 8px", fontSize: "12px", borderRadius: "6px" }}
              >
                {bookmark === index ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reader;