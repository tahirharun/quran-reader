import { useEffect, useState } from "react";
import axios from "axios";

function SurahList({ setSurah, learningMode, readMode }) {
  const [surahs, setSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("https://api.quran.com/api/v4/chapters")
      .then((res) => setSurahs(res.data.chapters))
      .catch((err) => console.error(err));
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name_arabic.includes(searchTerm)
  );

  const goToBookmarkSurah = (surahId) => {
    setSurah(surahId);
  };

  return (
    <div className="surah-list-container" style={{ marginTop: "20px" }}>
      <h2 className="surah-list-title">Surah List</h2>

      <input
        type="text"
        className="surah-search"
        placeholder="Search Surah by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="surah-grid">
        {filteredSurahs.map((s) => {
          const bookmarkIndex = localStorage.getItem(`bookmark-surah-${s.id}`);

          return (
            <div
              key={s.id}
              className="surah-card"
              style={{ position: "relative" }}
            >
              {}
              {bookmarkIndex !== null && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "#ffb300",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    zIndex: 10,
                  }}
                >
                  🔖
                </span>
              )}

              {bookmarkIndex !== null && (
                <button
                  onClick={() => goToBookmarkSurah(s.id)}
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    background: "#2196f3",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    zIndex: 10,
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  className="bookmark-button"
                >
                  Go to Bookmark
                </button>
              )}

              <div
                className="surah-card-header"
                onClick={() => setSurah(s.id)}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget.parentNode.querySelector(".bookmark-button");
                  if (btn) btn.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget.parentNode.querySelector(".bookmark-button");
                  if (btn) btn.style.opacity = 0;
                }}
              >
                <span className={`surah-number ${readMode ? "readmode-number" : ""}`}>
                  {s.id}
                </span>
                <strong className="surah-name">{s.name_simple}</strong>
              </div>

              <div className="surah-name-arabic">{s.name_arabic}</div>
              <small className="verses-count">{s.verses_count} verses</small>

              {learningMode && !readMode && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#4caf50",
                    fontStyle: "italic",
                  }}
                >
                  Tafsir: {s.tafsir || "Learn the meaning of this Surah"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SurahList;