import React from "react";

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
            transition: "all 0.3s",
            boxShadow: reciter === r.id ? "0 4px 12px rgba(76, 175, 80, 0.3)" : "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <img
            src={r.image}
            alt={r.name}
            style={{ width: "60px", height: "60px", borderRadius: "50%", marginBottom: "6px" }}
          />
          <p style={{ margin: 0, fontSize: "14px", fontWeight: reciter === r.id ? "600" : "400" }}>
            {r.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReciterProfile;