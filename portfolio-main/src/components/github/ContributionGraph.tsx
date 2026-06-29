// ─── Card 4: Contribution Graph (Recharts Area Chart) ─────────────────────────
import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useContributionGraph } from '../../hooks/useGithub';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
}

function SkeletonGraph({ theme }: { theme: Theme }) {
  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 animate-pulse"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <div className="h-6 w-48 rounded-lg mb-6" style={{ background: theme.pillBg }} />
      <div className="h-48 rounded-2xl" style={{ background: theme.pillBg }} />
    </div>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  theme: Theme;
}

function CustomTooltip({ active, payload, label, theme }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.text,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <p className="font-bold text-purple-400">{payload[0].value} contributions</p>
      <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
        Week of {label}
      </p>
    </div>
  );
}

export default function ContributionGraph({ theme, isDark }: { theme: Theme; isDark: boolean }) {
  const { data, loading, error } = useContributionGraph();

  // Only render the last 26 weeks (6 months) for clarity
  const chartData = useMemo(() => {
    if (!data) return [];
    const recent = data.slice(-26);
    return recent.map((w) => ({
      week: new Date(w.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      contributions: w.total,
    }));
  }, [data]);

  if (loading) return <SkeletonGraph theme={theme} />;

  const accentColor = '#a855f7';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisColor = isDark ? 'rgba(215,226,234,0.4)' : 'rgba(17,19,24,0.4)';

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3
        className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6"
        style={{ color: theme.text }}
      >
        📈 Contribution Activity
      </h3>

      {error && (
        <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
          Could not load contribution data.
        </p>
      )}

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="contribGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.45} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: axisColor, fontFamily: 'Kanit, sans-serif' }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: axisColor, fontFamily: 'Kanit, sans-serif' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Area
              type="monotone"
              dataKey="contributions"
              stroke={accentColor}
              strokeWidth={2}
              fill="url(#contribGradient)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 5, fill: accentColor, stroke: theme.cardBg, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p
        className="mt-3 text-xs font-light text-right uppercase tracking-widest"
        style={{ color: theme.textMuted }}
      >
        Last 26 weeks · Live data
      </p>
    </div>
  );
}
