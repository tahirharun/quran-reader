import React from "react";

// Reciters with images directly in public folder
const reciters = [
  { id: "1", name: "Al-Afasy", image: "/afasy.jpg" },
  { id: "2", name: "Abdul Basit", image: "/abdulbasit.jpg" },
  { id: "3", name: "Al-Ghamdi", image: "/ghamdi.jpg" },
  { id: "4", name: "As-Sudais", image: "/sudais.jpg" },
];

function ReciterProfile({ reciter, setReciter }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {reciters.map((r) => (
        <div
          key={r.id}
          onClick={() => setReciter(r.id)}
          style={{
            cursor: "pointer",
            padding: "10px",
            borderRadius: "12px",
            border: reciter === r.id ? "2px solid #4caf50" : "1px solid #ccc",
            textAlign: "center",
            width: "100px",
            transition: "all 0.2s",
          }}
        >
          <img
            src={r.image}
            alt={r.name}
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <p style={{ marginTop: "8px", fontSize: "14px" }}>{r.name}</p>
        </div>
      ))}
    </div>
  );
}

export default ReciterProfile;