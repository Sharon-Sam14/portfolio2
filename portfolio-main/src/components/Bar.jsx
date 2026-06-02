import React from 'react';

export default function Bar({ level, inView }) {
  return (
    <div style={{ height: 4, background: "#1a1a2e", borderRadius: 99, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          borderRadius: 99,
          background: "linear-gradient(90deg, #7c5cfc, #3ecfcf)",
          width: inView ? `${level}%` : "0%",
          transition: "width 1.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      />
    </div>
  );
}
