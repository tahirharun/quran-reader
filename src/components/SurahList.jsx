import { useEffect, useState } from "react";
import axios from "axios";

function SurahList({ setSurah }) {
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

  return (
    <div className="surah-list-container">
      <h2 className="surah-list-title">Surah List</h2>

      <input
        type="text"
        className="surah-search"
        placeholder="Search Surah by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="surah-grid">
        {filteredSurahs.map((s) => (
          <div
            key={s.id}
            className="surah-card"
            onClick={() => setSurah(s.id)}
          >
            <div className="surah-card-header">
              <span className="surah-number">{s.id}</span>
              <strong className="surah-name">{s.name_simple}</strong>
            </div>
            <div className="surah-name-arabic">{s.name_arabic}</div>
            <small className="verses-count">{s.verses_count} verses</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurahList;