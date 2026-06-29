// ─── Card 3: Contribution Calendar ───────────────────────────────────────────
import { GitHubCalendar } from 'react-github-calendar';

interface Theme {
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
}

interface ContributionCalendarProps {
  theme: Theme;
  isDark: boolean;
}

export default function ContributionCalendar({ theme, isDark }: ContributionCalendarProps) {
  const darkTheme = {
    light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    dark:  ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  const lightThemeColors = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark:  ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  };

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-[6px]"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <h3
        className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6"
        style={{ color: theme.text }}
      >
        📅 Contribution Calendar
      </h3>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 0 }}>
          <GitHubCalendar
            username="Sharon-Sam14"
            colorScheme={isDark ? 'dark' : 'light'}
            theme={isDark ? darkTheme : lightThemeColors}
            fontSize={12}
            blockSize={13}
            blockMargin={4}
            style={{
              color: theme.text,
              fontFamily: "'Kanit', sans-serif",
              width: '100%',
            }}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
          />
        </div>
      </div>

      <p
        className="mt-4 text-xs font-light text-right uppercase tracking-widest"
        style={{ color: theme.textMuted }}
      >
        Live · Updates automatically
      </p>
    </div>
  );
}
