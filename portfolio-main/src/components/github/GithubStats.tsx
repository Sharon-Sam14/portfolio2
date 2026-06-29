// ─── Card 1: GitHub Overview Stats ───────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useGithubStats } from '../../hooks/useGithub';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
}

interface StatItemProps {
  label: string;
  value: number;
  icon: string;
  delay: number;
  theme: Theme;
}

function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20, restDelta: 0.5 });
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionVal.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, motionVal, delay]);

  useEffect(() => {
    return spring.onChange((v) => setDisplay(Math.round(v)));
  }, [spring]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

function StatItem({ label, value, icon, delay, theme }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
      style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}` }}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: theme.text }}>
        <AnimatedNumber value={value} delay={delay} />
      </span>
      <span className="text-[11px] uppercase tracking-widest mt-1 font-medium" style={{ color: theme.textMuted }}>
        {label}
      </span>
    </motion.div>
  );
}

function SkeletonStat({ theme }: { theme: Theme }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center gap-2 animate-pulse"
      style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}` }}
    >
      <div className="w-8 h-8 rounded-full" style={{ background: theme.cardBorder }} />
      <div className="w-16 h-7 rounded-lg" style={{ background: theme.cardBorder }} />
      <div className="w-20 h-3 rounded-full" style={{ background: theme.cardBorder }} />
    </div>
  );
}

const STAT_DEFS = [
  { key: 'totalStars',         label: 'Total Stars',        icon: '⭐' },
  { key: 'publicRepos',        label: 'Public Repos',       icon: '📦' },
  { key: 'totalForks',         label: 'Total Forks',        icon: '🍴' },
  { key: 'followers',          label: 'Followers',          icon: '👥' },
  { key: 'following',          label: 'Following',          icon: '👤' },
  { key: 'totalContributions', label: 'Contributions',      icon: '🔥' },
  { key: 'totalCommits',       label: 'Total Commits',      icon: '🔁' },
] as const;

export default function GithubStats({ theme }: { theme: Theme }) {
  const { data, loading, error } = useGithubStats();

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3 className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6" style={{ color: theme.text }}>
        📊 GitHub Overview
      </h3>

      {error && (
        <p className="text-sm" style={{ color: theme.textMuted }}>
          Could not load stats. {error.includes('401') ? 'Check your GitHub token.' : 'Try again later.'}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading
          ? STAT_DEFS.map((s) => <SkeletonStat key={s.key} theme={theme} />)
          : STAT_DEFS.map((s, i) => (
              <StatItem
                key={s.key}
                label={s.label}
                icon={s.icon}
                value={data ? (data[s.key] as number) : 0}
                delay={i * 0.08}
                theme={theme}
              />
            ))}
      </div>
    </div>
  );
}
