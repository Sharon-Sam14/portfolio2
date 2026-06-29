// ─── Card 7: Technology Distribution (Recharts Doughnut) ─────────────────────
import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TECH_DISTRIBUTION } from '../../services/github';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
  theme: Theme;
}

function CustomTooltip({ active, payload, theme }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
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
      <div className="flex items-center gap-2 font-bold">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: item.payload.color }}
        />
        {item.name}
      </div>
      <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
        {item.value}% of projects
      </p>
    </div>
  );
}

function CustomLegend({ theme }: { theme: Theme }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4">
      {TECH_DISTRIBUTION.map((tech) => (
        <div key={tech.name} className="flex items-center gap-1.5 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: tech.color }}
          />
          <span style={{ color: theme.textMuted }}>{tech.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function TechDistribution({ theme }: { theme: Theme }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3
        className="font-black text-lg sm:text-xl uppercase tracking-widest mb-4"
        style={{ color: theme.text }}
      >
        🧩 Tech Distribution
      </h3>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={TECH_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              stroke="none"
            >
              {TECH_DISTRIBUTION.map((tech, index) => (
                <Cell
                  key={tech.name}
                  fill={tech.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend theme={theme} />
    </div>
  );
}
