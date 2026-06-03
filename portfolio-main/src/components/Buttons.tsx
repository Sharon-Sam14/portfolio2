import React from 'react';

// ─── Contact Button ───────────────────────────────────────────────────────────
interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function ContactButton({
  label = "Contact Me",
  onClick,
  className = "",
}: ContactButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
      className={`rounded-full uppercase tracking-widest text-white font-medium text-xs sm:text-sm md:text-base px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 transition-all duration-300 hover:opacity-90 active:scale-95 ${className}`}
    >
      {label}
    </button>
  );
}

// ─── View on GitHub Button ────────────────────────────────────────────────────
interface ViewGitHubButtonProps {
  href: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ViewGitHubButton({
  href,
  label = "View on GitHub",
  className = "",
  style,
}: ViewGitHubButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={style}
      className={`inline-block rounded-full border-2 font-medium uppercase tracking-widest text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-3.5 transition-all duration-300 active:scale-95 text-center ${className}`}
    >
      {label}
    </a>
  );
}

// ─── Keep LiveProjectButton as alias for backwards compat ─────────────────────
export const LiveProjectButton = ViewGitHubButton;
