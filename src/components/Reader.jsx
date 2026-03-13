import { useEffect, useState, useRef } from "react";
import axios from "axios";

/* RECITER AUDIO FOLDERS (EveryAyah) */
const RECITER_AUDIO = {
  "1": "Alafasy_128kbps",
  "2": "Abdul_Basit_Mujawwad_128kbps",
  "3": "Ghamadi_40kbps",
  "4": "Abdurrahmaan_As-Sudais_192kbps", // fixed Sudais
};

function Reader({ surah, setSurah, reciter }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);

  const audioRef = useRef(null);

  /* LOAD SURAH */
  useEffect(() => {
    if (!surah) return;

    setLoading(true);

    const loadSurah = async () => {
      try {
        const res = await axios.get(
          `https://quranapi.pages.dev/api/${surah}.json`
        );

        const data = res.data;

        const ayahs = data.arabic1.map((text, i) => ({
          verse_number: i + 1,
          text_uthmani:
            surah !== 1
              ? text.replace(/^بسم الله الرحمن الرحيم\s*/, "")
              : text,
          translation: data.english[i] || "",
        }));

        setVerses(ayahs);
      } catch (err) {
        console.error("Error loading surah:", err);
      }

      setLoading(false);
    };

    loadSurah();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [surah]);

  /* AUTO SCROLL */
  useEffect(() => {
    if (playingIndex !== null) {
      const el = document.getElementById(`ayah-${playingIndex}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [playingIndex]);

  /* PLAY AUDIO */
  const playAudio = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const ayahNumber = index + 1;

    const surahStr = String(surah).padStart(3, "0");
    const ayahStr = String(ayahNumber).padStart(3, "0");

    const reciterFolder = RECITER_AUDIO[reciter] || "Alafasy_128kbps";

    const audioUrl = `https://everyayah.com/data/${reciterFolder}/${surahStr}${ayahStr}.mp3`;

    const audio = new Audio(audioUrl);

    audioRef.current = audio;

    setPlayingIndex(index);

    audio.play();

    audio.onended = () => {
      if (index + 1 < verses.length) {
        playAudio(index + 1);
      } else {
        setPlayingIndex(null);
      }
    };
  };

  /* PAUSE AUDIO */
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
            className={`verse ${
              playingIndex === index ? "active-ayah" : ""
            }`}
          >
            <p className="arabic">
              {v.text_uthmani}{" "}
              <span className="ayah-number">{v.verse_number}</span>
            </p>

            <p className="translation">{v.translation}</p>

            <button
              onClick={() =>
                playingIndex === index
                  ? pauseAudio()
                  : playAudio(index)
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