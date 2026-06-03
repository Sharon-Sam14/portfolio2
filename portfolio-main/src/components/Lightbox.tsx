import React, { useEffect } from 'react';
import { IMGS } from '../data/portfolioData';

interface LightboxProps {
  imgKey: string;
  title: string;
  onClose: () => void;
}

export default function Lightbox({ imgKey, title, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const imgData = (IMGS as Record<string, string>)[imgKey];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md select-none transition-opacity duration-300"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
      >
        {/* Header toolbar */}
        <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-2">
          <span className="font-bold text-sm text-neutral-200 truncate pr-4 max-w-[80vw]">
            {title}
          </span>
          <button
            onClick={onClose}
            className="bg-neutral-800/80 hover:bg-neutral-700/85 hover:scale-105 active:scale-95 transition-all text-neutral-200 border border-neutral-700 w-8 h-8 rounded-full flex items-center justify-center font-extrabold"
          >
            ✕
          </button>
        </div>

        {/* Certificate Image */}
        {imgData ? (
          <img
            src={imgData}
            alt={title}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl shadow-2xl border border-neutral-800"
          />
        ) : (
          <div className="w-[60vw] h-[40vh] bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400">
            Certificate image not found.
          </div>
        )}

        {/* Footer help text */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-[10px] text-neutral-500 tracking-widest uppercase whitespace-nowrap">
          Press ESC or click outside to close
        </div>
      </div>
    </div>
  );
}
