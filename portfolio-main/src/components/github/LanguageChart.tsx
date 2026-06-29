// ─── Card 2: Most Used Languages ─────────────────────────────────────────────
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { LANGUAGE_DATA } from '../../services/github';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
}

function LanguageBar({
  name,
  color,
  percentage,
  delay,
  theme,
}: {
  name: string;
  color: string;
  percentage: number;
  delay: number;
  theme: Theme;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
          <span className="font-medium" style={{ color: theme.text }}>
            {name}
          </span>
        </div>
        <span className="font-black text-xs" style={{ color: theme.textMuted }}>
          {percentage}%
        </span>
      </div>

      {/* Track */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}` }}
      >
        {/* Animated fill */}
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{
            delay,
            duration: 0.9,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </div>
    </div>
  );
}

export default function LanguageChart({ theme }: { theme: Theme }) {
  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3
        className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6"
        style={{ color: theme.text }}
      >
        💻 Most Used Languages
      </h3>

      <div className="flex flex-col gap-4">
        {LANGUAGE_DATA.map((lang, i) => (
          <LanguageBar
            key={lang.name}
            name={lang.name}
            color={lang.color}
            percentage={lang.percentage}
            delay={i * 0.06}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
