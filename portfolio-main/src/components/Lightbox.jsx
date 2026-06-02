import React, { useEffect } from 'react';
import { IMGS } from '../data/portfolioData';

export default function Lightbox({ imgKey, title, onClose }) {
  useEffect(() => {
    const h = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(4,4,12,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        animation: "overlayIn 0.2s ease"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "90vh",
          animation: "lightboxIn 0.25s ease"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -44,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#e8e8f4"
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid #333",
              color: "#e8e8f4",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>
        <img
          src={IMGS[imgKey]}
          alt={title}
          style={{
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: 12,
            boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
            display: "block"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -36,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.65rem",
            color: "#505070",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          }}
        >
          Press ESC or click outside to close
        </div>
      </div>
    </div>
  );
}
