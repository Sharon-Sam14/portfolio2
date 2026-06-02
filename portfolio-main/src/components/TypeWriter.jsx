import React, { useState, useEffect } from 'react';

export default function TypeWriter({ text, speed = 75 }) {
  const [d, setD] = useState("");
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => {
        setD(s => s + text[i]);
        setI(n => n + 1);
      }, speed);
      return () => clearTimeout(t);
    }
  }, [i, text, speed]);
  return (
    <span>
      {d}
      <span style={{ animation: "blink 1s step-end infinite", color: "#7c5cfc" }}>|</span>
    </span>
  );
}
