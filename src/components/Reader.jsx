import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Reader({ surah, setSurah, reciter, setReciter }) {
  const [verses, setVerses] = useState([]);
  const [audioInfo, setAudioInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);

  const audioRef = useRef(null);

  const reciters = [
    { id: "1", name: "Al-Afasy" },
    { id: "2", name: "Abdul Basit" },
    { id: "3", name: "Al-Ghamdi" },
    { id: "4", name: "As-Sudais" }
  ];

  useEffect(() => {
    if (!surah) return;

    setLoading(true);

    const loadSurah = async () => {
      try {
        const res = await axios.get(
          `https://quranapi.pages.dev/api/${surah}.json`
        );

        const data = res.data;

        if (!data || !data.arabic1) {
          throw new Error("Invalid surah data");
        }

        const ayahs = data.arabic1.map((text, i) => ({
          verse_number: i + 1,
          text_uthmani:
            surah !== 1
              ? text.replace(/^بسم الله الرحمن الرحيم\s*/, "")
              : text,
          translation: data.english[i] || ""
        }));

        setVerses(ayahs);
      } catch (err) {
        console.error("Surah fetch error:", err);
      }

      try {
        const audioRes = await axios.get(
          `https://quranapi.pages.dev/api/audio/${surah}.json`
        );

        setAudioInfo(audioRes.data);
      } catch (err) {
        console.error("Audio fetch error:", err);
      }

      setLoading(false);
    };

    loadSurah();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [surah]);

  const playAudio = (index) => {
    if (!audioInfo) return;

    const reciterData = audioInfo[reciter];

    if (!reciterData || !reciterData.originalUrl) {
      alert("Audio not available for this reciter.");
      return;
    }

    const mp3 = reciterData.originalUrl;

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

  if (!verses.length) return <p>Failed to load surah.</p>;

  return (
    <div className="reader-container">
      <button onClick={() => setSurah(null)} className="back-button">
        ⬅ Back to Surah List
      </button>

      <h2 className="surah-title">Surah {surah}</h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Reciter:
        </label>

        <select
          value={reciter}
          onChange={(e) => setReciter(e.target.value)}
        >
          {reciters.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

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