// ─── Card 5: Recent Repositories ─────────────────────────────────────────────
import { motion } from 'framer-motion';
import { useRecentRepos } from '../../hooks/useGithub';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
  projCardBg: string;
  projCardBorder: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 5C7 3.9 7.9 3 9 3s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM9 7c-1.3 0-2.4.84-2.82 2H4v2h2.18C6.6 12.16 7.7 13 9 13c1.66 0 3-1.34 3-3S10.66 7 9 7zm6 0c-1.66 0-3 1.34-3 3 0 .35.07.68.18 1H9v2h3.18c.42.96 1.38 1.63 2.51 1.63A2.75 2.75 0 0 0 17.5 12v-1.18C18.16 10.68 18.5 9.87 18.5 9c0-1.1-.9-2-2-2H15zm0 5.5a.75.75 0 0 1 0-1.5.75.75 0 0 1 0 1.5z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function SkeletonRepoCard({ theme }: { theme: Theme }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 animate-pulse"
      style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}` }}
    >
      <div className="h-5 w-32 rounded-lg" style={{ background: theme.cardBorder }} />
      <div className="h-3 w-full rounded-full" style={{ background: theme.cardBorder }} />
      <div className="h-3 w-3/4 rounded-full" style={{ background: theme.cardBorder }} />
      <div className="flex gap-2 mt-1">
        <div className="h-6 w-16 rounded-full" style={{ background: theme.cardBorder }} />
        <div className="h-6 w-20 rounded-full" style={{ background: theme.cardBorder }} />
      </div>
    </div>
  );
}

export default function RepositoryCard({ theme }: { theme: Theme }) {
  const { data: repos, loading, error } = useRecentRepos();

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3
        className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6"
        style={{ color: theme.text }}
      >
        📂 Recent Repositories
      </h3>

      {error && (
        <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
          Could not load repositories.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRepoCard key={i} theme={theme} />
            ))
          : repos?.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl p-5 flex flex-col gap-3 transition-shadow duration-300 hover:shadow-xl"
                style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}` }}
              >
                {/* Repo name */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-black text-sm leading-snug break-all" style={{ color: theme.text }}>
                    {repo.name}
                  </span>
                  {repo.primaryLanguage && (
                    <span
                      className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1"
                      style={{ background: repo.languageColor ?? '#888' }}
                      title={repo.primaryLanguage}
                    />
                  )}
                </div>

                {/* Description */}
                {repo.description && (
                  <p
                    className="text-xs font-light leading-relaxed line-clamp-2"
                    style={{ color: theme.textMuted }}
                  >
                    {repo.description}
                  </p>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: theme.textMuted }}>
                  {repo.primaryLanguage && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: repo.languageColor ?? '#888' }}
                      />
                      {repo.primaryLanguage}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <StarIcon /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <ForkIcon /> {repo.forks}
                  </span>
                  <span>Updated {timeAgo(repo.updatedAt)}</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 mt-auto pt-1">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      color: theme.text,
                    }}
                  >
                    <GitHubIcon /> GitHub
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        color: '#fff',
                        border: '1px solid rgba(182,0,168,0.4)',
                      }}
                    >
                      <ExternalLinkIcon /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
