// ─── GitHub Activity Section ──────────────────────────────────────────────────
// Inserted between Projects and Certificates. Matches all existing design tokens.
import React, { lazy, Suspense } from 'react';
import FadeIn from '../FadeIn';

// Lazy-load all sub-components so the GitHub section doesn't affect initial bundle
const GithubStats           = lazy(() => import('./GithubStats'));
const LanguageChart         = lazy(() => import('./LanguageChart'));
const ContributionCalendar  = lazy(() => import('./ContributionCalendar'));
const ContributionGraph     = lazy(() => import('./ContributionGraph'));
const RepositoryCard        = lazy(() => import('./RepositoryCard'));
const RecentActivity        = lazy(() => import('./RecentActivity'));
const TechDistribution      = lazy(() => import('./TechDistribution'));

interface Theme {
  sectionBg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
  projCardBg: string;
  projCardBorder: string;
  heroGradient: string;
  borderFaint: string;
}

interface GithubSectionProps {
  theme: Theme;
  isDark: boolean;
}

// Minimal skeleton while lazy components load
function CardShell({ theme, className = '' }: { theme: Theme; className?: string }) {
  return (
    <div
      className={`rounded-[32px] p-8 animate-pulse ${className}`}
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <div className="h-5 w-40 rounded-lg mb-6" style={{ background: theme.pillBg }} />
      <div className="h-32 rounded-2xl" style={{ background: theme.pillBg }} />
    </div>
  );
}

const heroHeadingStyle = (gradient: string): React.CSSProperties => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export default function GithubSection({ theme, isDark }: GithubSectionProps) {
  const fallback = <CardShell theme={theme} />;

  return (
    <section
      id="github"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 pt-24 pb-32 px-5 sm:px-8 md:px-10 transition-colors duration-500"
      style={{ background: theme.sectionBg }}
    >
      {/* ── Section Heading ── */}
      <div className="text-center mb-6">
        <FadeIn delay={0} y={40}>
          <h2
            className="font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2rem, 10vw, 140px)', ...heroHeadingStyle(theme.heroGradient) }}
          >
            GitHub Activity
          </h2>
        </FadeIn>
      </div>

      <FadeIn delay={0.1} y={20}>
        <p
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 md:mb-28 font-light leading-relaxed"
          style={{ fontSize: 'clamp(0.88rem, 1.6vw, 1.2rem)', color: theme.textMuted }}
        >
          A live snapshot of my GitHub activity — contributions, repositories, languages, and coding patterns pulled directly from the GitHub API.
        </p>
      </FadeIn>

      {/* ── Card Grid ── */}
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Row 1: Stats (full width) */}
        <FadeIn delay={0.05} y={30}>
          <Suspense fallback={fallback}>
            <GithubStats theme={theme} />
          </Suspense>
        </FadeIn>

        {/* Row 2: Language Chart + Contribution Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn delay={0.1} y={30}>
            <Suspense fallback={fallback}>
              <LanguageChart theme={theme} />
            </Suspense>
          </FadeIn>

          <FadeIn delay={0.15} y={30}>
            <Suspense fallback={fallback}>
              <ContributionCalendar theme={theme} isDark={isDark} />
            </Suspense>
          </FadeIn>
        </div>

        {/* Row 3: Contribution Graph (full width) */}
        <FadeIn delay={0.2} y={30}>
          <Suspense fallback={fallback}>
            <ContributionGraph theme={theme} isDark={isDark} />
          </Suspense>
        </FadeIn>

        {/* Row 4: Recent Repos (full width) */}
        <FadeIn delay={0.25} y={30}>
          <Suspense fallback={fallback}>
            <RepositoryCard theme={theme} />
          </Suspense>
        </FadeIn>

        {/* Row 5: Recent Activity + Tech Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn delay={0.3} y={30}>
            <Suspense fallback={fallback}>
              <RecentActivity theme={theme} />
            </Suspense>
          </FadeIn>

          <FadeIn delay={0.35} y={30}>
            <Suspense fallback={fallback}>
              <TechDistribution theme={theme} />
            </Suspense>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
