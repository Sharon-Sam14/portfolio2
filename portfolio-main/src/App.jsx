import React, { useState, useEffect, useRef } from 'react';
import Particles from './components/Particles';
import TypeWriter from './components/TypeWriter';
import Reveal, { useInView } from './components/Reveal';
import Lightbox from './components/Lightbox';
import Bar from './components/Bar';
import {
  IMGS,
  NAV,
  PROJECTS,
  SKILLS,
  EXPERIENCE,
  EDUCATION,
  CERTS
} from './data/portfolioData';

function useScrollSpy() {
  const [active, setActive] = useState("Projects");
  useEffect(() => {
    const h = () => {
      for (let i = NAV.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV[i]);
        if (el && window.scrollY >= el.offsetTop - 130) {
          setActive(NAV[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return active;
}

export default function App() {
  const active = useScrollSpy();
  const [hov, setHov] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [skillsRef, skillsVis] = useInView(0.2);
  const [lightbox, setLightbox] = useState(null); // {imgKey, title}
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const h = e => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const C = {
    root: { background: "var(--bg-color)", color: "var(--text-color)", fontFamily: "'DM Mono','Courier New',monospace", minHeight: "100vh", overflowX: "hidden" },
    nav: { position: "sticky", top: 0, left: 0, right: 0, zIndex: 998, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: 62, background: "var(--nav-bg)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-color)" },
    logo: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg,#7c5cfc,#3ecfcf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" },
    nbtn: (a) => ({ padding: "0.4rem 0.9rem", borderRadius: 7, fontSize: "0.72rem", letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", background: a ? "rgba(124,92,252,0.15)" : "transparent", color: a ? "#7c5cfc" : "var(--text-dim)", border: a ? "1px solid rgba(124,92,252,0.3)" : "1px solid transparent", fontFamily: "'DM Mono',monospace", transition: "all 0.2s" }),
    hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifycontent: "center", padding: "7rem 1.5rem 4rem", position: "relative", overflow: "hidden" },
    sec: { padding: "5.5rem 1.5rem", maxWidth: 1200, margin: "0 auto" },
    slabel: { fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7c5cfc", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.7rem" },
    h2: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,2.7rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2.8rem" },
    pcard: (h, col) => ({ background: h ? "var(--card-hover-bg)" : "var(--card-bg)", border: `1px solid ${h ? col : "var(--border-color)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.3s", transform: h ? "translateY(-7px)" : "none", boxShadow: h ? `0 20px 55px rgba(0,0,0,0.45),0 0 35px ${col}22` : "none" }),
    chip: (col) => ({ display: "inline-flex", alignItems: "center", fontSize: "0.62rem", letterSpacing: "0.07em", textTransform: "uppercase", color: col, border: `1px solid ${col}44`, padding: "0.18rem 0.55rem", borderRadius: 100, marginBottom: "0.65rem", background: `${col}11` }),
    tbadge: (col) => ({ background: `${col}18`, color: col, fontSize: "0.6rem", padding: "0.15rem 0.45rem", borderRadius: 4, letterSpacing: "0.05em" }),
    expcard: (col) => ({ background: "var(--card-bg)", border: `1px solid var(--border-color)`, borderLeft: `3px solid ${col}`, borderRadius: "0 14px 14px 0", padding: "1.7rem 1.9rem", position: "relative", transition: "box-shadow 0.3s" }),
    dot: (col) => ({ width: 13, height: 13, borderRadius: "50%", background: col, border: "3px solid var(--bg-color)", boxShadow: `0 0 10px ${col}`, position: "absolute", left: -7, top: 26 }),
    educard: { background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 14, padding: "1.5rem 1.8rem", display: "grid", gridTemplateColumns: "52px 1fr", gap: "1.1rem", alignItems: "start", transition: "border-color 0.2s,transform 0.2s" },
    pill: { display: "flex", alignItems: "center", gap: "0.6rem", background: "var(--pill-bg)", border: "1px solid var(--border-color)", padding: "0.85rem 1.6rem", borderRadius: 100, textDecoration: "none", color: "var(--text-color)", fontSize: "0.8rem", transition: "all 0.2s", fontFamily: "'DM Mono',monospace" },
    btnP: { background: "#7c5cfc", color: "#fff", border: "none", padding: "0.8rem 1.8rem", borderRadius: 9, fontFamily: "'DM Mono',monospace", fontSize: "0.8rem", letterSpacing: "0.05em", cursor: "pointer", boxShadow: "0 0 35px rgba(124,92,252,0.32)", transition: "all 0.2s" },
    btnO: { background: "transparent", color: "var(--text-color)", border: "1px solid var(--border-color)", padding: "0.8rem 1.8rem", borderRadius: 9, fontFamily: "'DM Mono',monospace", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" },
    themeToggleBtn: { background: "rgba(124,92,252,0.1)", border: "1px solid var(--border-color)", color: "var(--text-color)", width: 38, height: 38, borderRadius: "50%", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }
  };

  return (
    <div style={C.root}>
      {lightbox && (
        <Lightbox
          imgKey={lightbox.imgKey}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Spotlight follow element */}
      <div
        style={{
          position: "fixed",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%)",
          left: mouse.x - 190,
          top: mouse.y - 190,
          pointerEvents: "none",
          zIndex: 1,
          transition: "left 0.08s, top 0.08s"
        }}
      />

      {/* Navigation */}
      <nav style={{ ...C.nav, flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.4rem" }}>
        <div style={C.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>SS/</div>
        <div style={{ display: "flex", gap: "0.2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {NAV.map(n => (
            <button key={n} style={C.nbtn(active === n)} onClick={() => go(n)}>
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <button
            onClick={toggleTheme}
            style={C.themeToggleBtn}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="mailto:sharonsam1401@gmail.com" style={{ ...C.btnP, padding: "0.45rem 1.1rem", fontSize: "0.68rem", textDecoration: "none", display: "inline-block" }}>
            Hire Me ✨
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ ...C.hero, alignItems: "center", justifyContent: "center", paddingTop: "120px" }}>
        <Particles />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: "linear-gradient(var(--border-color) 1px,transparent 1px),linear-gradient(90deg,var(--border-color) 1px,transparent 1px)",
            backgroundSize: "58px 58px",
            opacity: 0.28,
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%,black 20%,transparent 80%)"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            animation: "fadeUp 0.8s ease both",
            width: "100%",
            maxWidth: 720
          }}
        >
          {/* Photo */}
          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,92,252,0.22) 0%,transparent 70%)", filter: "blur(22px)" }} />
            {/* Spinning gradient ring */}
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", background: "linear-gradient(135deg,#7c5cfc,#e95b7b,#3ecfcf,#7c5cfc)", animation: "spinRing 6s linear infinite", padding: 3 }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg-color)" }} />
            </div>
            <img
              src={IMGS["photo"]}
              alt="Sharon Sam"
              style={{ position: "relative", zIndex: 1, width: 200, height: 200, objectFit: "cover", objectPosition: "center 8%", borderRadius: "50%", display: "block" }}
            />
            {/* Orbit dots */}
            <div style={{ position: "absolute", width: 11, height: 11, borderRadius: "50%", background: "#7c5cfc", top: 2, right: 8, boxShadow: "0 0 12px #7c5cfc", animation: "floatBadge 2s ease-in-out infinite" }} />
            <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#e95b7b", bottom: 10, left: 4, boxShadow: "0 0 10px #e95b7b", animation: "floatBadge 2.5s ease-in-out infinite", animationDelay: "0.9s" }} />
            <div style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#3ecfcf", top: "50%", right: -10, boxShadow: "0 0 8px #3ecfcf", animation: "floatBadge 3s ease-in-out infinite", animationDelay: "0.4s" }} />
          </div>

          {/* Available tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border-color)", padding: "0.38rem 0.95rem", borderRadius: 100, fontSize: "0.7rem", color: "var(--text-dim)", marginBottom: "1.2rem", background: "rgba(124,92,252,0.05)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3ecfcf", display: "inline-block", animation: "pulse 2s infinite" }} />
            Open to internships · collaborations · opportunities
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "0.5em" }}>
            Hi, I'm{" "}
            <span style={{ background: "linear-gradient(135deg,#7c5cfc 0%,#e95b7b 50%,#3ecfcf 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <TypeWriter text="Sharon Sam." speed={80} />
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: "0.93rem", color: "var(--text-dim)", lineHeight: 1.78, maxWidth: 500, marginBottom: "2rem" }}>
            Engineering student · Frontend Developer · Club VP<br />
            Building responsive web apps that bridge <strong style={{ color: "var(--text-color)" }}>design + logic</strong> — one commit at a time.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.8rem" }}>
            <button
              style={C.btnP}
              onClick={() => go("Projects")}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 55px rgba(124,92,252,0.5)" }}
              onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 0 35px rgba(124,92,252,0.32)" }}
            >
              View Projects →
            </button>
            <button
              style={C.btnO}
              onClick={() => go("Contact")}
              onMouseEnter={e => { e.target.style.borderColor = "#7c5cfc"; e.target.style.color = "#7c5cfc" }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.color = "var(--text-color)" }}
            >
              Get in touch
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[["6+", "Projects"], ["3", "Roles"], ["5", "Certificates"], ["8+", "Tech Skills"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#7c5cfc", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginTop: "0.2rem", letterSpacing: "0.05em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ overflow: "hidden", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "0.85rem 0", background: "var(--marquee-bg)" }}>
        <div style={{ display: "flex", gap: "2.5rem", animation: "marquee 22s linear infinite", whiteSpace: "nowrap" }}>
          {["HTML & CSS", "JavaScript", "Python", "Django", "Java", "C", "MySQL", "Git", "GitHub", "Event Leadership", "Frontend Dev", "Full-Stack", "Data Analytics", "Social Media"].map(t => (
            <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dark)", display: "inline-flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
              {t}<span style={{ color: "#7c5cfc" }}>✦</span>
            </span>
          ))}
          {/* Duplicate list to enable continuous smooth loop */}
          {["HTML & CSS", "JavaScript", "Python", "Django", "Java", "C", "MySQL", "Git", "GitHub", "Event Leadership", "Frontend Dev", "Full-Stack", "Data Analytics", "Social Media"].map(t => (
            <span key={t + "-dup"} style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dark)", display: "inline-flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
              {t}<span style={{ color: "#7c5cfc" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <div id="Projects" style={{ background: "var(--marquee-bg)" }}>
        <div style={C.sec}>
          <Reveal>
            <div style={C.slabel}><span style={{ width: 26, height: 1, background: "#7c5cfc", display: "inline-block" }} />Featured Work</div>
            <h2 style={C.h2}>Projects</h2>
          </Reveal>

          {PROJECTS.filter(p => p.featured).map(p => (
            <Reveal key={p.title}>
              <div
                style={{
                  background: hov === "fp" ? "var(--card-hover-bg)" : "var(--card-bg)",
                  border: `1px solid ${hov === "fp" ? p.color : "var(--border-color)"}`,
                  borderRadius: 20,
                  marginBottom: "1.2rem",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s",
                  transform: hov === "fp" ? "translateY(-6px)" : "none",
                  boxShadow: hov === "fp" ? `0 22px 55px rgba(0,0,0,0.45), 0 0 50px ${p.color}1a` : ""
                }}
                onMouseEnter={() => setHov("fp")}
                onMouseLeave={() => setHov(null)}
                onClick={() => window.open(p.url, "_blank")}
              >
                <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2, background: `linear-gradient(135deg, ${p.color}, #e95b7b)`, color: "#fff", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.28rem 0.75rem", borderRadius: 100 }}>
                  ⭐ Featured Project
                </div>
                <div className="featured-project-grid">
                  <div className="featured-project-image-box" style={{ background: `linear-gradient(135deg, ${p.color}1e, ${p.color}08, var(--card-bg))`, '--project-border-color': `${p.color}22`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem", gap: "1rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", width: 190, height: 190, borderRadius: "50%", border: `1px solid ${p.color}20`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                    <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%", border: `1px solid ${p.color}30`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                    <span style={{ fontSize: "3.8rem", filter: `drop-shadow(0 0 28px ${p.color}77)`, position: "relative", zIndex: 1 }}>{p.emoji}</span>
                    <div style={{ textAlign: "center", zIndex: 1 }}>
                      <div style={{ fontSize: "0.66rem", color: p.color, letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{p.period}</div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-dark)" }}>{p.association}</div>
                    </div>
                  </div>
                  <div style={{ padding: "1.8rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={C.chip(p.color)}>{p.tag}</span>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.03em", marginBottom: "0.55rem", lineHeight: 1.2 }}>{p.title}</div>
                      <p style={{ fontSize: "0.74rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "0.8rem" }}>{p.desc}</p>
                      <div style={{ background: `${p.color}09`, border: `1px solid ${p.color}20`, borderRadius: 9, padding: "0.65rem 0.9rem", marginBottom: "0.9rem" }}>
                        <div style={{ fontSize: "0.62rem", color: p.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.35rem" }}>Key Features</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", lineHeight: 1.6 }}>{p.longDesc}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.9rem" }}>{p.tech.map(t => <span key={t} style={C.tbadge(p.color)}>{t}</span>)}</div>
                      <div style={{ fontSize: "0.7rem", color: p.color }}>View on GitHub →</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1.1rem" }}>
            {PROJECTS.filter(p => !p.featured).map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <div style={C.pcard(hov === i, p.color)} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onClick={() => window.open(p.url, "_blank")}>
                  <div style={{ height: 150, display: "flex", alignItems: "center", justifycontent: "center", background: `linear-gradient(135deg, ${p.color}1e, ${p.color}08)`, borderBottom: `1px solid ${p.color}20` }}>
                    <span style={{ fontSize: "3.2rem", filter: `drop-shadow(0 0 18px ${p.color}66)` }}>{p.emoji}</span>
                  </div>
                  <div style={{ padding: "1.3rem" }}>
                    <span style={C.chip(p.color)}>{p.tag}</span>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.45rem", letterSpacing: "-0.02em" }}>{p.title}</div>
                    <p style={{ fontSize: "0.74rem", color: "var(--text-dim)", lineHeight: 1.65, marginBottom: "0.9rem" }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.9rem" }}>{p.tech.map(t => <span key={t} style={C.tbadge(p.color)}>{t}</span>)}</div>
                    <div style={{ fontSize: "0.7rem", color: p.color }}>View on GitHub →</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} style={{ marginTop: "3.8rem" }}>
            <div style={{ ...C.slabel, marginBottom: "0.5rem" }}><span style={{ width: 26, height: 1, background: "#7c5cfc", display: "inline-block" }} />Tech Proficiency</div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.35rem", letterSpacing: "-0.02em", marginBottom: "1.8rem" }}>Skills Breakdown</h3>
            <div ref={skillsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "1rem" }}>
              {SKILLS.map(s => (
                <div key={s.name} style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 11, padding: "0.95rem 1.1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.55rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>{s.icon} {s.name}</span>
                    <span style={{ fontSize: "0.65rem", color: "#7c5cfc" }}>{s.level}%</span>
                  </div>
                  <Bar level={s.level} inView={skillsVis} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div id="Experience" style={{ background: "var(--bg-color)" }}>
        <div style={C.sec}>
          <Reveal>
            <div style={{ ...C.slabel, color: "#e95b7b" }}><span style={{ width: 26, height: 1, background: "#e95b7b", display: "inline-block" }} />Career Journey</div>
            <h2 style={C.h2}>Experience</h2>
          </Reveal>
          <div style={{ position: "relative", paddingLeft: "2rem" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, #7c5cfc, #e95b7b, #3ecfcf)" }} />
            {EXPERIENCE.map((e, i) => (
              <Reveal key={e.role + e.org} delay={i * 0.1} style={{ marginBottom: "1.8rem" }}>
                <div style={{ position: "relative" }}>
                  <div style={C.dot(e.color)} />
                  <div
                    style={C.expcard(e.color)}
                    onMouseEnter={el => { el.currentTarget.style.boxShadow = `0 8px 35px ${e.color}18` }}
                    onMouseLeave={el => { el.currentTarget.style.boxShadow = "none" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.9rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "1.3rem" }}>{e.logo}</span>
                          <div>
                            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>{e.role}</div>
                            <div style={{ fontSize: "0.75rem", color: e.color }}>{e.org}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-dark)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          <span>📅 {e.period}</span><span>⏱ {e.duration}</span><span>📍 {e.location}</span>
                        </div>
                      </div>
                      <span style={{ background: `${e.color}18`, color: e.color, border: `1px solid ${e.color}44`, fontSize: "0.63rem", padding: "0.22rem 0.65rem", borderRadius: 100, whiteSpace: "nowrap" }}>{e.badge}</span>
                    </div>
                    <div style={{ fontSize: "0.67rem", color: "var(--text-dark)", marginBottom: "0.9rem", background: "var(--marquee-bg)", display: "inline-block", padding: "0.18rem 0.55rem", borderRadius: 5 }}>{e.type}</div>
                    <div style={{ marginBottom: "1.1rem" }}>
                      {e.bullets.map((b, j) => (
                        <div key={j} style={{ fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "0.32rem", display: "flex", gap: "0.55rem" }}>
                          <span style={{ color: e.color, flexShrink: 0 }}>▸</span>{b}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
                      {e.skills.map(s => <span key={s} style={{ background: `${e.color}12`, color: e.color, fontSize: "0.6rem", padding: "0.17rem 0.5rem", borderRadius: 4 }}>{s}</span>)}
                      {e.certImg && (
                        <button
                          onClick={() => setLightbox({ imgKey: e.certImg, title: `${e.role} Certificate — ${e.org}` })}
                          style={{ marginLeft: "auto", background: `${e.color}15`, color: e.color, border: `1px solid ${e.color}44`, fontSize: "0.62rem", padding: "0.25rem 0.7rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'DM Mono',monospace", transition: "all 0.2s" }}
                          onMouseEnter={el => { el.currentTarget.style.background = `${e.color}28` }}
                          onMouseLeave={el => { el.currentTarget.style.background = `${e.color}15` }}
                        >
                          📄 View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <div id="Education" style={{ background: "var(--marquee-bg)" }}>
        <div style={C.sec}>
          <Reveal>
            <div style={{ ...C.slabel, color: "#3ecfcf" }}><span style={{ width: 26, height: 1, background: "#3ecfcf", display: "inline-block" }} />Academic Background</div>
            <h2 style={C.h2}>Education</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", maxWidth: 700 }}>
            {EDUCATION.map((e, i) => (
              <Reveal key={e.degree} delay={i * 0.1}>
                <div
                  style={C.educard}
                  onMouseEnter={el => { el.currentTarget.style.borderColor = e.color; el.currentTarget.style.transform = "translateX(5px)" }}
                  onMouseLeave={el => { el.currentTarget.style.borderColor = "var(--border-color)"; el.currentTarget.style.transform = "none" }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 11, background: `${e.color}18`, display: "flex", alignItems: "center", justifycontent: "center", fontSize: "1.6rem", border: `1px solid ${e.color}30` }}>{e.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.28rem" }}>{e.degree}</div>
                    <div style={{ fontSize: "0.73rem", color: "var(--text-dim)", marginBottom: "0.45rem" }}>{e.school}</div>
                    <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: e.color, border: `1px solid ${e.color}44`, padding: "0.13rem 0.45rem", borderRadius: 4 }}>{e.year}</span>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-dark)" }}>· {e.note}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* CERTIFICATES */}
      <div id="Certificates" style={{ background: "var(--bg-color)" }}>
        <div style={C.sec}>
          <Reveal>
            <div style={{ ...C.slabel, color: "#f59e0b" }}><span style={{ width: 26, height: 1, background: "#f59e0b", display: "inline-block" }} />Achievements</div>
            <h2 style={C.h2}>Certificates &<br />Credentials</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.3rem" }}>
            {CERTS.map((cert, i) => (
              <Reveal key={cert.title} delay={i * 0.08}>
                <div
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, overflow: "hidden", transition: "all 0.3s", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cert.color; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 18px 45px rgba(0,0,0,0.38),0 0 35px ${cert.color}18` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none" }}
                >
                  {/* Certificate image thumbnail — clickable */}
                  <div
                    style={{ position: "relative", cursor: "pointer", overflow: "hidden", height: 160, background: `linear-gradient(135deg, ${cert.color}18, ${cert.color}08)` }}
                    onClick={() => setLightbox({ imgKey: cert.imgKey, title: cert.title })}
                  >
                    <img
                      src={IMGS[cert.imgKey]}
                      alt={cert.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", transition: "transform 0.4s" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,transparent 50%,rgba(8,8,16,0.85))`, display: "flex", alignItems: "flex-end", justifycontent: "center", paddingBottom: "0.7rem" }}>
                      <span style={{ background: "rgba(8,8,16,0.7)", color: cert.color, border: `1px solid ${cert.color}55`, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.22rem 0.65rem", borderRadius: 100, backdropFilter: "blur(6px)" }}>🔍 Click to view full certificate</span>
                    </div>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${cert.color}, ${cert.color}44)`, position: "absolute", top: 0, left: 0, right: 0 }} />
                  </div>

                  {/* Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", flex: 1 }}>
                    <div style={{ background: `${cert.color}09`, borderRight: `1px solid ${cert.color}20`, display: "flex", flexDirection: "column", alignItems: "center", justifycontent: "center", padding: "1.2rem 0.6rem", gap: "0.55rem" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${cert.color}18`, border: `2px solid ${cert.color}40`, display: "flex", alignItems: "center", justifycontent: "center", fontSize: "1.3rem" }}>{cert.emoji}</div>
                      <span style={{ fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: cert.color, textAlign: "center", lineheight: 1.4 }}>{cert.catIcon}<br />{cert.category}</span>
                    </div>
                    <div style={{ padding: "1.1rem 1.2rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.38rem", gap: "0.4rem" }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.87rem", letterSpacing: "-0.02em", lineheight: 1.25, flex: 1 }}>{cert.title}</div>
                        <span style={{ background: `${cert.color}18`, color: cert.color, border: `1px solid ${cert.color}33`, fontSize: "0.56rem", padding: "0.16rem 0.45rem", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0 }}>{cert.date}</span>
                      </div>
                      <div style={{ fontSize: "0.68rem", color: cert.color, marginBottom: "0.55rem", fontWeight: 500 }}>{cert.issuer}</div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", lineheight: 1.6, marginBottom: "0.8rem" }}>{cert.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: cert.id ? "0.65rem" : 0 }}>
                        {cert.highlights.map(h => <span key={h} style={{ background: `${cert.color}0e`, color: `${cert.color}cc`, fontSize: "0.56rem", padding: "0.15rem 0.45rem", borderRadius: 4, border: `1px solid ${cert.color}20` }}>✓ {h}</span>)}
                      </div>
                      {cert.id && <div style={{ fontSize: "0.56rem", color: "var(--text-dark)", background: "var(--marquee-bg)", padding: "0.25rem 0.5rem", borderRadius: 5, display: "inline-block", letterSpacing: "0.04em" }}>ID: {cert.id}</div>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25} style={{ marginTop: "2.2rem" }}>
            <div style={{ background: "linear-gradient(135deg,var(--card-bg),var(--card-hover-bg))", border: "1px solid var(--border-color)", borderRadius: 14, padding: "1.4rem 1.8rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.18rem" }}>5 Certificates · 4 Organizations</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>SFIT · SkillCraft Technology · Deloitte · LinkedIn Learning</div>
              </div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                {[["🎖️", "Leadership"], ["💻", "Tech"], ["⭐", "Recognition"], ["📊", "Analytics"], ["📱", "Marketing"]].map(([ic, lb]) => (
                  <div key={lb} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.1rem" }}>{ic}</div>
                    <div style={{ fontSize: "0.56rem", color: "var(--text-dark)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{lb}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CONTACT */}
      <div id="Contact" style={{ background: "var(--marquee-bg)" }}>
        <div style={{ ...C.sec, textAlign: "center", maxWidth: 640 }}>
          <Reveal>
            <div style={{ ...C.slabel, justifyContent: "center" }}><span style={{ width: 26, height: 1, background: "#7c5cfc", display: "inline-block" }} />Get in touch</div>
            <h2 style={{ ...C.h2, marginBottom: "0.9rem" }}>Let's build something<br /><span style={{ background: "linear-gradient(135deg,#7c5cfc,#e95b7b,#3ecfcf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>extraordinary.</span></h2>
            <p style={{ fontSize: "0.83rem", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "2.4rem", maxWidth: 480, margin: "0 auto 2.4rem" }}>Open to internships, open-source collabs, and anything involving great code + creative thinking. Let's connect!</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap" }}>
              {[{ href: "https://www.linkedin.com/in/sharon-sam-6b1836290/", icon: "💼", label: "LinkedIn", col: "#0077b5" }, { href: "https://github.com/Sharon-Sam14", icon: "🐙", label: "GitHub", col: "#7c5cfc" }, { href: "mailto:sharonsam1401@gmail.com", icon: "✉️", label: "Email", col: "#e95b7b" }].map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  style={C.pill}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = l.col; e.currentTarget.style.color = l.col; e.currentTarget.style.transform = "translateY(-3px)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-color)"; e.currentTarget.style.transform = "none" }}
                >
                  <span style={{ fontSize: "1rem" }}>{l.icon}</span>{l.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <footer style={{ padding: "1.8rem 2.5rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.68rem", color: "var(--text-dark)", flexWrap: "wrap", gap: "1rem" }}>
        <div>Built by <strong style={{ color: "var(--text-color)" }}>Sharon Sam</strong></div>
        <div style={{ display: "flex", gap: "1.4rem" }}>
          {NAV.map(l => <span key={l} style={{ cursor: "pointer", transition: "color 0.2s" }} onClick={() => go(l)} onMouseEnter={e => e.target.style.color = "#7c5cfc"} onMouseLeave={e => e.target.style.color = "var(--text-dark)"}>{l}</span>)}
        </div>
        <div>© 2026 · All rights reserved</div>
      </footer>
    </div>
  );
}
