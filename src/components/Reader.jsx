import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Reader({ surah, setSurah }) {
  const [verses, setVerses] = useState([]);
  const [audioInfo, setAudioInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!surah) return;

    setLoading(true);

    // Fetch verses
    axios
      .get(`https://quranapi.pages.dev/api/${surah}.json`)
      .then((res) => {
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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching surah:", err);
        setLoading(false);
      });

    // Fetch audio
    axios
      .get(`https://quranapi.pages.dev/api/audio/${surah}.json`)
      .then((res) => {
        setAudioInfo(res.data);
      })
      .catch((err) => console.error("Error fetching audio:", err));

    // cleanup when surah changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [surah]);

  const playAudio = (index) => {
    if (!audioInfo) return;

    const reciter = audioInfo["1"];
    const mp3 = reciter?.originalUrl;
    if (!mp3) return;

    // stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(mp3);
    audioRef.current = audio;

    audio.play();
    setPlayingIndex(index);

    audio.onended = () => setPlayingIndex(null);
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
          <div key={index} className="verse">
            <p className="arabic">
              {v.text_uthmani}{" "}
              <span className="ayah-number">{v.verse_number}</span>
            </p>

            <p className="translation">{v.translation}</p>

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