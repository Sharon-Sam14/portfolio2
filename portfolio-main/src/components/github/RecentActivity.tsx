// ─── Card 6: Recent Activity Feed ────────────────────────────────────────────
import { motion } from 'framer-motion';
import { useRecentActivity } from '../../hooks/useGithub';
import type { GithubEvent } from '../../services/github';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function getEventIcon(type: string): string {
  const map: Record<string, string> = {
    PushEvent:    '🔁',
    CreateEvent:  '✨',
    ReleaseEvent: '🚀',
    WatchEvent:   '⭐',
  };
  return map[type] ?? '📌';
}

function getEventDescription(event: GithubEvent): string {
  switch (event.type) {
    case 'PushEvent': {
      const msgs = event.payload.commits;
      if (msgs && msgs.length > 0) {
        const first = msgs[0].message.split('\n')[0].slice(0, 60);
        return `Pushed: "${first}${first.length >= 60 ? '…' : ''}"`;
      }
      return 'Pushed commits';
    }
    case 'CreateEvent':
      if (event.payload.refType === 'repository') return 'Created repository';
      if (event.payload.refType === 'branch') return `Created branch: ${event.payload.ref ?? ''}`;
      if (event.payload.refType === 'tag') return `Created tag: ${event.payload.ref ?? ''}`;
      return 'Created';
    case 'ReleaseEvent': {
      const rel = event.payload.release;
      return rel ? `Released ${rel.tag_name}: ${rel.name}` : 'Published a release';
    }
    case 'WatchEvent':
      return 'Starred repository';
    default:
      return event.type.replace('Event', '');
  }
}

function SkeletonActivity({ theme }: { theme: Theme }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 animate-pulse rounded-2xl p-3"
          style={{ background: theme.pillBg }}
        >
          <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: theme.cardBorder }} />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-24 rounded-full" style={{ background: theme.cardBorder }} />
            <div className="h-3 w-full rounded-full" style={{ background: theme.cardBorder }} />
            <div className="h-3 w-1/2 rounded-full" style={{ background: theme.cardBorder }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecentActivity({ theme }: { theme: Theme }) {
  const { data: events, loading, error } = useRecentActivity();

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3
        className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6"
        style={{ color: theme.text }}
      >
        ⚡ Recent Activity
      </h3>

      {error && (
        <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
          Could not load activity.
        </p>
      )}

      {loading ? (
        <SkeletonActivity theme={theme} />
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `${theme.cardBorder} transparent` }}
        >
          {events?.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-start gap-3 rounded-2xl p-3 transition-colors duration-200"
              style={{ background: theme.pillBg }}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
              >
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-black uppercase tracking-wider truncate"
                  style={{ color: theme.text }}
                >
                  {event.repoName}
                </p>
                <p
                  className="text-xs font-light leading-snug mt-0.5"
                  style={{ color: theme.textMuted }}
                >
                  {getEventDescription(event)}
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest mt-1 font-medium"
                  style={{ color: theme.textMuted, opacity: 0.6 }}
                >
                  {timeAgo(event.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}

          {!events?.length && !loading && (
            <p className="text-sm text-center py-8" style={{ color: theme.textMuted }}>
              No recent public activity.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
