import { useEffect, useState, useRef } from "react";
import axios from "axios";

const RECITER_AUDIO = {
  "1": "Alafasy_128kbps",
  "2": "Abdul_Basit_Mujawwad_128kbps",
  "3": "Ghamadi_40kbps",
  "4": "Abdurrahmaan_As-Sudais_192kbps",
};

function Reader({ surah, setSurah, reciter, learningMode }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!surah) return;
    setLoading(true);

    const loadSurah = async () => {
      try {
        const res = await axios.get(`https://quranapi.pages.dev/api/${surah}.json`);
        const data = res.data;

        const ayahs = data.arabic1.map((text, i) => ({
          verse_number: i + 1,
          text_uthmani: surah !== 1 ? text.replace(/^بسم الله الرحمن الرحيم\s*/, "") : text,
          translation: data.english[i] || "Translation unavailable",
          tafsir: data.tafsir ? data.tafsir[i] : "Tafsir for this verse",
        }));

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

  const playAudio = (index) => {
    if (audioRef.current) audioRef.current.pause();

    const ayahNumber = index + 1;
    const surahStr = String(surah).padStart(3, "0");
    const ayahStr = String(ayahNumber).padStart(3, "0");

    const reciterFolder = RECITER_AUDIO[reciter];
    const audioUrl = `https://everyayah.com/data/${reciterFolder}/${surahStr}${ayahStr}.mp3`;

    const audio = new Audio(audioUrl);
    audio.playbackRate = learningMode ? 0.8 : 1; // Slow down in Learning Mode
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

  if (loading) return <p>Loading Surah...</p>;

  return (
    <div className="reader-container">
      <button onClick={() => setSurah(null)} className="back-button">
        ⬅ Back to Surah List
      </button>

      <h2 className="surah-title">Surah {surah}</h2>

      <div className="verses">
        {verses.map((v, index) => (
          <div
            key={index}
            id={`ayah-${index}`}
            className={`verse ${playingIndex === index ? "active-ayah" : ""}`}
          >
            {/* Arabic */}
            <p className="arabic">
              {v.text_uthmani}{" "}
              <span className="ayah-number">{v.verse_number}</span>
            </p>

            {/* English translation always visible */}
            <p className="translation" style={{ marginTop: "6px" }}>
              {v.translation}
            </p>

            {/* Learning Mode: Tafsir only */}
            {learningMode && (
              <div
                className="tafsir"
                style={{ marginTop: "6px", fontSize: "14px", color: "#555" }}
              >
                {v.tafsir}
              </div>
            )}

            {/* Audio controls */}
            <button
              onClick={() =>
                playingIndex === index ? pauseAudio() : playAudio(index)
              }
            >
              {playingIndex === index ? "Pause Audio" : "Play Audio"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reader;