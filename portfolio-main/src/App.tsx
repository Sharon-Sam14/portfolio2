import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { ContactButton, ViewGitHubButton } from './components/Buttons';
import FadeIn from './components/FadeIn';
import Magnet from './components/Magnet';
import AnimatedText from './components/AnimatedText';
import { CERTS, IMGS, EXPERIENCE } from './data/portfolioData';
import Lightbox from './components/Lightbox';

// ─── INLINE SOCIAL ICONS ──────────────────────────────────────────────────────
function GitHubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function LinkedInIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function MailIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const NAV_ITEMS = ["About", "Experience", "Education", "Skills", "Projects", "Certificates", "Contact"] as const;

const GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];
const Row1 = GIFS.slice(0, 11);
const Row2 = GIFS.slice(11);
const Row1x3 = [...Row1, ...Row1, ...Row1];
const Row2x3 = [...Row2, ...Row2, ...Row2];

const EDUCATION_ENTRIES = [
  {
    num: "01",
    title: "Bachelor of Engineering (Computer Engineering)",
    institution: "St. Francis Institute of Technology · University of Mumbai · Jul 2023 – May 2027",
    desc: "Currently pursuing a Bachelor of Engineering in Computer Engineering at St. Francis Institute of Technology, affiliated with the University of Mumbai. Building strong expertise in software development, data structures, algorithms, operating systems, databases, computer networks, and software engineering through academic coursework and practical projects.",
  },
  {
    num: "02",
    title: "Higher Secondary Education (Bifocal Science)",
    institution: "Mount Carmel Junior College · Jun 2021 – Mar 2023",
    desc: "Completed Higher Secondary Education in Bifocal Science with an academic score of 78.83%. Developed a strong foundation in mathematics, science, computer fundamentals, analytical thinking, and problem-solving.",
  },
  {
    num: "03",
    title: "High School Education",
    institution: "B.K.S English High School · Jun 2011 – Mar 2021",
    desc: "Completed secondary education while developing strong communication skills, discipline, teamwork, and an early interest in computers and technology.",
  },
];

const SKILLS_CARDS = [
  { title: "Frontend Development", skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite"] },
  { title: "Backend Development", skills: ["Python", "Django", "Django REST Framework", "REST APIs", "Authentication", "Role-Based Access Control"] },
  { title: "Databases", skills: ["PostgreSQL", "MySQL", "SQLite", "Database Design", "SQL Queries"] },
  { title: "Programming Languages", skills: ["Python", "JavaScript", "TypeScript", "C", "Java"] },
  { title: "Tools & DevOps", skills: ["Git", "GitHub", "GitHub Actions", "VS Code", "Postman"] },
  { title: "Areas of Interest", skills: ["Full-Stack Development", "Artificial Intelligence", "Healthcare Technology", "Enterprise Systems", "Cloud Applications", "UI/UX Design"] },
];

const PROJECTS = [
  { num: "01", category: "Full-Stack · TypeScript", name: "SmartPantry", desc: "AI-powered kitchen intelligence platform — pantry management, recipe discovery, and smart meal planning.", github: "https://github.com/Sharon-Sam14/smartpantry", repo: "smartpantry" },
  { num: "02", category: "Enterprise · Full-Stack", name: "NexusHR", desc: "Enterprise HR management platform centralizing employee operations, payroll, recruitment, attendance, and workforce analytics.", github: "https://github.com/Sharon-Sam14/NexusHR", repo: "NexusHR" },
  { num: "03", category: "Healthcare · React · TypeScript", name: "Cura", desc: "Cloud-based healthcare management platform — patient care, appointments, and role-based clinical workflows.", github: "https://github.com/Sharon-Sam14/Cura", repo: "Cura" },
  { num: "04", category: "Security · Python · AI", name: "AI Login Detection System", desc: "AI-powered login intrusion detection system that identifies anomalous authentication patterns in real time. Sem 5 mini project.", github: "https://github.com/Sharon-Sam14/mal-login-detection-system", repo: "mal-login-detection-system" },
  { num: "05", category: "FinTech · Django · Python", name: "PROSPERA", desc: "Web-based budget management application designed to help individuals effectively manage budgets, track expenses, and visualize spending habits.", github: "https://github.com/Sharon-Sam14/MiniProject1", repo: "MiniProject1" },
];

// ─── THEME CONFIG ─────────────────────────────────────────────────────────────
function getTheme(isDark: boolean) {
  return {
    pageBg:        isDark ? '#0C0C0C' : '#F4F5F7',
    sectionBg:     isDark ? '#0C0C0C' : '#F4F5F7',
    text:          isDark ? '#D7E2EA' : '#111318',
    textMuted:     isDark ? 'rgba(215,226,234,0.85)' : 'rgba(17,19,24,0.78)',
    navBg:         isDark ? 'rgba(12,12,12,0.85)' : 'rgba(244,245,247,0.9)',
    mobileMenuBg:  isDark ? '#111318' : '#FFFFFF',
    cardBg:        isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
    cardBorder:    isDark ? 'rgba(215,226,234,0.15)' : 'rgba(0,0,0,0.12)',
    pillBg:        isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    pillBorder:    isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.12)',
    eduBg:         isDark ? '#FFFFFF' : '#1A1D24',
    eduText:       isDark ? '#0C0C0C' : '#D7E2EA',
    eduBorder:     isDark ? 'rgba(12,12,12,0.15)' : 'rgba(215,226,234,0.15)',
    heroGradient:  isDark
      ? 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)'
      : 'linear-gradient(180deg, #1A2035 0%, #2D4A8A 100%)',
    borderFaint:   isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    projCardBorder:isDark ? '#D7E2EA' : '#1A1D24',
    projCardBg:    isDark ? '#0C0C0C' : '#FFFFFF',
  };
}

// ─── SKILL CARD ───────────────────────────────────────────────────────────────
function SkillCard({ title, skills, delay, theme }: { title: string; skills: string[]; delay: number; theme: ReturnType<typeof getTheme> }) {
  return (
    <FadeIn delay={delay} y={30}>
      <div
        className="rounded-[32px] p-8 h-full transition-transform duration-300 hover:-translate-y-[6px]"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <h3 className="font-medium text-xl mb-6" style={{ color: theme.text }}>{title}</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="rounded-full px-4 py-2 text-sm"
              style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}`, color: theme.text }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── PROJECT CARD (text-based — no images) ───────────────────────────────────
interface ProjectCardProps {
  project: typeof PROJECTS[0];
  index: number;
  total: number;
  theme: ReturnType<typeof getTheme>;
}
function ProjectCard({ project, index, total, theme }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Derive tech tags from category string
  const tags = project.category.split(/[·\s]+/).filter(Boolean);

  return (
    <div ref={containerRef} className="flex items-center justify-center sticky py-3"
      style={{ top: `calc(76px + ${index * 20}px)` }}>
      <motion.div
        style={{ scale, border: `2px solid ${theme.projCardBorder}`, background: theme.projCardBg }}
        className="w-full max-w-5xl rounded-[36px] sm:rounded-[44px] md:rounded-[52px] p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden"
      >
        {/* Card inner layout */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">

          {/* Large project number */}
          <div className="shrink-0">
            <span
              className="font-black leading-none select-none block"
              style={{
                fontSize: "clamp(4rem, 10vw, 130px)",
                color: theme.text === '#D7E2EA' ? 'rgba(215,226,234,0.18)' : 'rgba(17,19,24,0.15)',
                lineHeight: 1,
              }}
            >
              {project.num}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category badge */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span key={tag} className="text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full"
                  style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}`, color: theme.text }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Project name */}
            <h3
              className="font-black uppercase tracking-tight mb-4 leading-tight"
              style={{ fontSize: "clamp(1.6rem, 4vw, 3.5rem)", color: theme.text }}
            >
              {project.name}
            </h3>

            {/* Description */}
            <p
              className="font-light leading-relaxed mb-8"
              style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.15rem)", color: theme.textMuted, maxWidth: "60ch" }}
            >
              {project.desc}
            </p>

            {/* GitHub link */}
            <ViewGitHubButton 
              href={project.github} 
              style={{
                borderColor: theme.text,
                color: theme.text,
              }}
              className="hover:bg-neutral-500/10"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
interface NavbarProps {
  theme: ReturnType<typeof getTheme>;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  scrollTo: (id: string) => void;
}

function Navbar({ theme, isDark, setIsDark, scrollTo }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  // 1. Detect Active Section asynchronously using IntersectionObserver (zero layout queries on scroll)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // triggers active section in center of viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sectionIds = ["hero", "about", "experience", "education", "skills", "projects", "certificates", "contact"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);

  const handleNav = (item: typeof NAV_ITEMS[number]) => {
    setMobileOpen(false);
    if (item === "About")     scrollTo("about");
    else if (item === "Experience") scrollTo("experience");
    else if (item === "Education") scrollTo("education");
    else if (item === "Skills")    scrollTo("skills");
    else if (item === "Projects")  scrollTo("projects");
    else if (item === "Certificates") scrollTo("certificates");
    else if (item === "Contact")  scrollTo("contact");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
      style={{ background: theme.navBg, backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.borderFaint}` }}
    >
      <div className="flex items-center justify-between px-5 md:px-10 py-3.5 md:py-4 max-w-[1600px] mx-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-extrabold tracking-tight text-base sm:text-lg hover:opacity-75 transition-opacity shrink-0"
          style={{ color: theme.text }}
        >
          Sharon Sam
        </button>

        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <button
                key={item}
                onClick={() => handleNav(item)}
                className={`text-sm lg:text-base font-medium uppercase tracking-wider transition-all duration-300 relative py-1 ${
                  isActive ? "opacity-100 scale-105" : "opacity-50 hover:opacity-85"
                }`}
                style={{ color: theme.text }}
              >
                {item}
                {isActive && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: theme.text }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-full p-2 transition-all duration-300 hover:scale-110"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.text }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </motion.div>
          </button>

          <button
            className="md:hidden rounded-full p-2 transition-all duration-200"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.text }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{ background: theme.mobileMenuBg, borderTop: `1px solid ${theme.borderFaint}` }}
          >
            <nav className="flex flex-col px-5 py-4 gap-1">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.toLowerCase();
                return (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNav(item)}
                    className={`text-left py-3 px-4 rounded-2xl text-base font-medium uppercase tracking-wider transition-all duration-200 ${
                      isActive ? "font-bold opacity-100" : "opacity-70"
                    }`}
                    style={{
                      color: theme.text,
                      background: isActive ? `${theme.text}10` : (i % 2 === 0 ? theme.cardBg : "transparent"),
                    }}
                  >
                    {item}
                  </motion.button>
                );
              })}
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${theme.borderFaint}` }}>
                <ContactButton onClick={() => handleNav("Contact")} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [lightbox, setLightbox] = useState<{ imgKey: string; title: string } | null>(null);
  const theme = getTheme(isDark);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeTopRef = useRef<number>(0);

  const { scrollY } = useScroll();
  const marqueeTranslateX1 = useTransform(scrollY, (latestScrollY) => {
    const sectionTop = marqueeTopRef.current;
    const offset = (latestScrollY - sectionTop + window.innerHeight) * 0.3;
    return offset - 200;
  });
  const marqueeTranslateX2 = useTransform(scrollY, (latestScrollY) => {
    const sectionTop = marqueeTopRef.current;
    const offset = (latestScrollY - sectionTop + window.innerHeight) * 0.3;
    return -(offset - 200);
  });

  useEffect(() => {
    const updateMarqueeTop = () => {
      if (marqueeRef.current) {
        const rect = marqueeRef.current.getBoundingClientRect();
        marqueeTopRef.current = rect.top + window.scrollY;
      }
    };

    updateMarqueeTop();
    window.addEventListener("resize", updateMarqueeTop);

    return () => {
      window.removeEventListener("resize", updateMarqueeTop);
    };
  }, []);

  const scrollTo = (id: string) => {
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const heroHeadingStyle: React.CSSProperties = {
    background: theme.heroGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const getAdjustedColor = (color: string) => {
    if (isDark) return color;
    const mappings: Record<string, string> = {
      '#22c55e': '#15803d', // green
      '#ef4444': '#b91c1c', // red
      '#f97316': '#c2410c', // orange
      '#86efac': '#166534', // light green -> dark green
      '#0ea5e9': '#0369a1', // light blue -> dark blue
      '#7c5cfc': '#5b3cc4', // purple -> dark purple
      '#3ecfcf': '#0891b2', // cyan -> dark cyan
      '#eab308': '#a16207', // yellow -> dark yellow
      '#e95b7b': '#be185d', // pink -> dark pink
    };
    return mappings[color.toLowerCase()] || color;
  };

  return (
    <div className="w-full overflow-x-clip min-h-screen transition-colors duration-500"
      style={{ background: theme.pageBg, color: theme.text, fontFamily: "'Kanit', sans-serif" }}>

      {/* ══════════════════════════════════ FIXED NAVBAR (all screen sizes) */}
      <Navbar theme={theme} isDark={isDark} setIsDark={setIsDark} scrollTo={scrollTo} />

      {/* ═══════════════════════════════════════════════════════════ 1. HERO */}
      <section id="hero" className="min-h-screen w-full flex flex-col overflow-x-clip relative pt-16">

        {/* Two-column hero layout */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-5 sm:px-8 md:px-12 lg:px-20 gap-8 md:gap-12 py-12 md:py-0">

          {/* LEFT — Text content */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 z-10">
            <FadeIn delay={0.1} y={20}>
              <p className="font-light uppercase tracking-[0.35em] mb-3"
                style={{ fontSize: "clamp(0.72rem, 1.4vw, 1rem)", color: theme.textMuted }}>
                Hi, I&apos;m
              </p>
            </FadeIn>

            <FadeIn delay={0.2} y={40}>
              <h1
                className="font-black uppercase tracking-tight leading-[0.9] mb-6"
                style={{ fontSize: "clamp(3.5rem, 9vw, 10rem)", ...heroHeadingStyle }}
              >
                Sharon<br />Sam
              </h1>
            </FadeIn>

            <FadeIn delay={0.35} y={20}>
              <p className="font-light uppercase tracking-wide leading-relaxed mb-8 max-w-[420px]"
                style={{ fontSize: "clamp(0.7rem, 1.2vw, 1rem)", color: theme.textMuted }}>
                A computer engineering student and full-stack developer passionate about building scalable web applications, intelligent systems, and impactful digital experiences
              </p>
            </FadeIn>

            <FadeIn delay={0.5} y={20}>
              <ContactButton onClick={() => scrollTo("contact")} />
            </FadeIn>
          </div>

          {/* RIGHT — Portrait */}
          <div className="shrink-0 order-1 md:order-2 z-10 w-[180px] sm:w-[240px] md:w-[300px] lg:w-[380px]">
            <FadeIn delay={0.55} y={30}>
              <Magnet padding={100} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
                <img
                  src="https://avatars.githubusercontent.com/u/163888141?v=4"
                  alt="Sharon Sam"
                  className="w-full h-auto object-contain rounded-full select-none pointer-events-none"
                  style={{ border: `3px solid ${theme.text}25` }}
                />
              </Magnet>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <FadeIn delay={1} y={10}>
          <div className="flex justify-center pb-6">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 opacity-30"
              style={{ color: theme.text }}
            >
              <span className="text-xs uppercase tracking-widest font-light">scroll</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ 2. MARQUEE */}
      <div ref={marqueeRef}>
        <section className="pt-20 sm:pt-28 md:pt-36 pb-10 overflow-hidden flex flex-col gap-3"
          style={{ background: theme.sectionBg }}>
          <motion.div style={{ x: marqueeTranslateX1 }}
            className="flex gap-3 whitespace-nowrap">
            {Row1x3.map((gif, i) => (
              <img key={i} src={gif} alt="work preview" loading="lazy"
                className="w-[280px] sm:w-[360px] md:w-[420px] h-[180px] sm:h-[230px] md:h-[270px] rounded-2xl object-cover flex-shrink-0 border border-white/5" />
            ))}
          </motion.div>
          <motion.div style={{ x: marqueeTranslateX2 }}
            className="flex gap-3 whitespace-nowrap">
            {Row2x3.map((gif, i) => (
              <img key={i} src={gif} alt="work preview" loading="lazy"
                className="w-[280px] sm:w-[360px] md:w-[420px] h-[180px] sm:h-[230px] md:h-[270px] rounded-2xl object-cover flex-shrink-0 border border-white/5" />
            ))}
          </motion.div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════ 3. ABOUT */}
      <section id="about" className="min-h-screen relative flex flex-col items-center justify-center py-24 px-5 sm:px-8 md:px-10 overflow-hidden transition-colors duration-500"
        style={{ background: theme.sectionBg }}>

        {/* Decorative corners */}
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" className="w-[80px] sm:w-[130px] md:w-[210px] object-contain" style={{ opacity: isDark ? 1 : 0.5 }} />
        </FadeIn>
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" className="w-[70px] sm:w-[120px] md:w-[180px] object-contain" style={{ opacity: isDark ? 1 : 0.5 }} />
        </FadeIn>
        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" className="w-[80px] sm:w-[130px] md:w-[210px] object-contain" style={{ opacity: isDark ? 1 : 0.5 }} />
        </FadeIn>
        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" className="w-[90px] sm:w-[140px] md:w-[220px] object-contain" style={{ opacity: isDark ? 1 : 0.5 }} />
        </FadeIn>

        {/* Heading */}
        <div className="mb-10 sm:mb-14 md:mb-16 z-20">
          <FadeIn delay={0} y={40}>
            <h2 className="font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)", ...heroHeadingStyle }}>
              About me
            </h2>
          </FadeIn>
        </div>

        <div className="z-20 max-w-[600px] text-center mb-16 sm:mb-20 md:mb-24 px-2">
          <AnimatedText
            text="Hi, I'm Sharon Sam, a Computer Engineering student at St. Francis Institute of Technology, affiliated with the University of Mumbai. I specialize in full-stack development using React, TypeScript, Python, Django, and modern web technologies. I enjoy building software that solves real-world problems—from healthcare and enterprise platforms to AI-powered applications. My focus is creating performant, scalable, and user-friendly digital experiences while continuously growing as a developer."
            className="font-medium leading-relaxed"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1.25rem)", color: theme.text } as React.CSSProperties}
          />
        </div>

        <div className="z-20">
          <FadeIn delay={0.1} y={20}>
            <ContactButton onClick={() => scrollTo("contact")} />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ EXPERIENCE */}
      <section id="experience" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 pt-24 pb-32 px-5 sm:px-8 md:px-10 transition-colors duration-500"
        style={{ background: theme.sectionBg }}>

        <div className="text-center mb-6">
          <FadeIn delay={0} y={40}>
            <h2 className="font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)", ...heroHeadingStyle }}>
              Experience
            </h2>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} y={20}>
          <p className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 md:mb-28 font-light leading-relaxed"
            style={{ fontSize: "clamp(0.88rem, 1.6vw, 1.2rem)", color: theme.textMuted }}>
            A timeline of my professional experience, internships, and student leadership roles.
          </p>
        </FadeIn>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto pl-8 sm:pl-12 md:pl-16">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] sm:left-[23px] md:left-[31px] top-4 bottom-4 w-[2px] transition-colors duration-500"
            style={{ background: `linear-gradient(to bottom, ${getAdjustedColor('#eab308')}, ${getAdjustedColor('#7c5cfc')}, ${getAdjustedColor('#3ecfcf')}, ${getAdjustedColor('#e95b7b')})` }} />

          <div className="space-y-12">
            {EXPERIENCE.map((exp, i) => {
              const activeColor = getAdjustedColor(exp.color);
              return (
                <FadeIn key={exp.role + exp.org} delay={i * 0.08} y={30} className="relative">
                  {/* Timeline point */}
                  <div 
                    className="absolute -left-[41px] sm:-left-[49px] md:-left-[57px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 transition-transform duration-300 hover:scale-110 shadow-md"
                    style={{ background: theme.projCardBg, border: `3px solid ${activeColor}` }}
                  >
                    {exp.logo}
                  </div>

                  {/* Experience Card */}
                  <div 
                    className="rounded-[32px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg border hover:shadow-2xl"
                    style={{ background: theme.cardBg, borderColor: theme.cardBorder }}
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-lg sm:text-2xl leading-tight" style={{ color: theme.text }}>
                          {exp.role}
                        </h3>
                        <p className="text-sm font-semibold uppercase tracking-wider mt-1" style={{ color: activeColor }}>
                          {exp.org}
                        </p>
                      </div>

                      {exp.badge && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full self-start sm:self-center"
                          style={{ background: `${activeColor}15`, color: activeColor }}>
                          {exp.badge}
                        </span>
                      )}
                    </div>

                    {/* Metadata line */}
                    <div className="flex flex-wrap gap-4 text-xs font-light mb-4" style={{ color: theme.textMuted }}>
                      <span>📅 {exp.period}</span>
                      <span>⏱️ {exp.duration}</span>
                      <span>📍 {exp.location}</span>
                    </div>

                    <div className="text-xs uppercase font-medium tracking-wider mb-4 inline-block px-2.5 py-1 rounded-md"
                      style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}`, color: theme.text }}>
                      {exp.type}
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 mb-6">
                      {exp.bullets.map((bullet, j) => (
                        <div key={j} className="flex items-start gap-2.5 text-sm font-light leading-relaxed" style={{ color: theme.textMuted }}>
                          <span className="text-base select-none shrink-0" style={{ color: activeColor }}>▸</span>
                          <p>{bullet}</p>
                        </div>
                      ))}
                    </div>

                    {/* Footer tags / buttons */}
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((skill) => (
                          <span key={skill} className="text-[10px] font-medium rounded-md px-2 py-0.5"
                            style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}`, color: theme.text }}>
                            {skill}
                          </span>
                        ))}
                      </div>

                      {exp.certImg && (
                        <button 
                          onClick={() => setLightbox({ imgKey: exp.certImg, title: `${exp.role} Certificate — ${exp.org}` })}
                          className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border"
                          style={{ background: `${activeColor}12`, borderColor: `${activeColor}33`, color: activeColor }}
                        >
                          📄 View Certificate
                        </button>
                      )}
                    </div>

                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════ 4. EDUCATION */}
      <section id="education" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 relative z-20 transition-colors duration-500"
        style={{ background: theme.eduBg, color: theme.eduText }}>

        <FadeIn delay={0} y={40}>
          <h2 className="font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)", color: theme.eduText }}>
            Education
          </h2>
        </FadeIn>

        <div className="max-w-5xl mx-auto divide-y border-y" style={{ borderColor: theme.eduBorder }}>
          {EDUCATION_ENTRIES.map((edu, i) => (
            <FadeIn key={edu.num} delay={i * 0.1} y={30}
              className="py-8 sm:py-10 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
              <div className="font-black leading-none select-none shrink-0 min-w-[70px] sm:min-w-[120px] md:min-w-[150px]"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)", color: theme.eduText }}>
                {edu.num}
              </div>
              <div className="flex-1 space-y-2 md:space-y-3">
                <h3 className="font-medium uppercase tracking-wide" style={{ fontSize: "clamp(0.9rem, 2.2vw, 2.1rem)", color: theme.eduText }}>
                  {edu.title}
                </h3>
                <p className="font-light uppercase tracking-widest" style={{ fontSize: "clamp(0.7rem, 1.2vw, 1rem)", color: `${theme.eduText}80` }}>
                  {edu.institution}
                </p>
                <p className="font-light leading-relaxed max-w-2xl" style={{ fontSize: "clamp(0.82rem, 1.6vw, 1.2rem)", color: `${theme.eduText}60` }}>
                  {edu.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ 5. SKILLS */}
      <section id="skills" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 transition-colors duration-500"
        style={{ background: theme.sectionBg }}>

        <FadeIn delay={0} y={40}>
          <h2 className="font-black uppercase leading-none tracking-tight text-center mb-6"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)", ...heroHeadingStyle }}>
            Skills
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} y={20}>
          <p className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 md:mb-28 font-light leading-relaxed"
            style={{ fontSize: "clamp(0.88rem, 1.6vw, 1.2rem)", color: theme.textMuted }}>
            Technologies and tools I use to design, build, deploy, and maintain modern software systems.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {SKILLS_CARDS.map((card, i) => (
            <SkillCard key={card.title} title={card.title} skills={card.skills} delay={i * 0.08} theme={theme} />
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════ 6. PROJECTS */}
      <section id="projects" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 pt-24 pb-32 px-5 sm:px-8 md:px-10 transition-colors duration-500"
        style={{ background: theme.sectionBg }}>

        <div className="text-center mb-6">
          <FadeIn delay={0} y={40}>
            <h2 className="font-black uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)", ...heroHeadingStyle }}>
              Projects
            </h2>
          </FadeIn>
        </div>
        <FadeIn delay={0.1} y={20}>
          <p className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 md:mb-28 font-light leading-relaxed"
            style={{ fontSize: "clamp(0.88rem, 1.6vw, 1.2rem)", color: theme.textMuted }}>
            A collection of academic, personal, and full-stack projects showcasing my growth as a software developer.
          </p>
        </FadeIn>

        <div className="space-y-12">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.num} project={project} index={i} total={PROJECTS.length} theme={theme} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ 7. CERTIFICATES */}
      <section id="certificates" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 pt-24 pb-32 px-5 sm:px-8 md:px-10 transition-colors duration-500"
        style={{ background: theme.sectionBg }}>

        <div className="text-center mb-6">
          <FadeIn delay={0} y={40}>
            <h2 className="font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)", ...heroHeadingStyle }}>
              Certificates
            </h2>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} y={20}>
          <p className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 md:mb-28 font-light leading-relaxed"
            style={{ fontSize: "clamp(0.88rem, 1.6vw, 1.2rem)", color: theme.textMuted }}>
            Achievements, professional training, and industry-recognized credentials.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {CERTS.map((cert, i) => (
            <FadeIn key={cert.title} delay={i * 0.08} y={30}>
              <div 
                className="group flex flex-col h-full rounded-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
              >
                {/* Image Preview / Clickable */}
                <div 
                  className="relative h-48 sm:h-52 overflow-hidden cursor-pointer"
                  onClick={() => setLightbox({ imgKey: cert.imgKey, title: cert.title })}
                >
                  <img 
                    src={(IMGS as Record<string, string>)[cert.imgKey]} 
                    alt={cert.title} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/80 text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                      🔍 Click to view
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 gap-4">
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
                      style={{ background: `${getAdjustedColor(cert.color)}15`, color: getAdjustedColor(cert.color) }}>
                      {cert.emoji} {cert.category}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-bold text-lg sm:text-xl leading-snug" style={{ color: theme.text }}>
                      {cert.title}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: getAdjustedColor(cert.color) }}>
                      {cert.issuer}
                    </p>
                    <p className="text-xs font-light" style={{ color: theme.textMuted }}>
                      Issued: {cert.date}
                    </p>
                    <p className="text-sm font-light leading-relaxed mt-2" style={{ color: theme.textMuted }}>
                      {cert.desc}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cert.highlights.map(h => (
                      <span key={h} className="text-[10px] rounded-md px-2 py-0.5"
                        style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}`, color: theme.text }}>
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {cert.id && (
                    <div className="text-[10px] font-mono mt-2 self-start rounded-md px-2 py-1"
                      style={{ background: theme.pillBg, border: `1px solid ${theme.pillBorder}`, color: theme.text }}>
                      ID: {cert.id}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ FOOTER */}
      <footer id="contact" className="py-16 px-8 relative z-30 flex flex-col items-center gap-6 transition-colors duration-500"
        style={{ background: theme.sectionBg, borderTop: `1px solid ${theme.borderFaint}` }}>
        <div className="flex items-center gap-8">
          <a href="https://github.com/Sharon-Sam14" target="_blank" rel="noreferrer"
            className="transition-opacity duration-200 hover:opacity-70" style={{ color: theme.text }} aria-label="GitHub">
            <GitHubIcon size={24} />
          </a>
          <a href="https://www.linkedin.com/in/sharon-sam-6b1836290" target="_blank" rel="noreferrer"
            className="transition-opacity duration-200 hover:opacity-70" style={{ color: theme.text }} aria-label="LinkedIn">
            <LinkedInIcon size={24} />
          </a>
          <a href="mailto:sharonsam1401@gmail.com"
            className="transition-opacity duration-200 hover:opacity-70" style={{ color: theme.text }} aria-label="Email">
            <MailIcon size={24} />
          </a>
        </div>
        <p className="font-light text-sm text-center" style={{ color: theme.textMuted }}>
          © 2026 Sharon Sam. Designed and developed with React, TypeScript, Tailwind CSS, and Framer Motion.
        </p>
      </footer>

      {lightbox && (
        <Lightbox
          imgKey={lightbox.imgKey}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}

    </div>
  );
}
