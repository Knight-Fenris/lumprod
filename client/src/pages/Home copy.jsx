import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';
import './Home.css';

const CATEGORIES = [
  { id: 'northern_ray', name: 'The Northern Ray', icon: '📍', desc: 'Regional Short Films' },
  { id: 'prism', name: 'Prism Showcase', icon: '🌐', desc: 'National Student Films' },
  { id: 'verite', name: 'Vérité', icon: '🎥', desc: 'Documentary Films' },
  { id: 'sprint', name: 'Lumiere Sprint', icon: '⚡', desc: '48-Hour Challenge' },
  { id: 'vertical', name: 'Vertical Ray', icon: '📱', desc: 'Mobile Vertical' },
];

export default function Home() {
  const { user } = useAuth();

  /* =========================
     SCROLL → FADE LOGIC
  ========================= */
  useEffect(() => {
    const sections = document.querySelectorAll('.snap-section');
    const vh = window.innerHeight;

    const onScroll = () => {
      const y = window.scrollY;

      sections.forEach((section, index) => {
        const start = index * vh;
        const end = start + vh;

        let opacity = 0;

        if (y >= start && y <= end) {
          const progress = (y - start) / vh; // 0 → 1
          opacity = 1 - Math.abs(progress - 0.5) * 2;
        }

        section.style.opacity = opacity;
      });
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="page">

      {/* 🔑 FAKE SCROLL HEIGHT (DO NOT REMOVE) */}
      <div className="scroll-spacer" />

      <div className="scroll-container">

        {/* HERO */}
        <section className="snap-section hero-section">
          <div className="hero-inner">

            <div className="hero-badge">
              ✨ APRIL 10–12, 2026 • PEC CHANDIGARH
            </div>

            <h1 className="hero-title hero-glow">LUMIÈRE</h1>

            <h1 className="hero-subtitle">
              National Film Festival 2026
            </h1>

            <p className="hero-tagline">
              Where <span className="purple">stories come alive</span> and{" "}
              <span className="gold">dreams take flight</span>
            </p>

            <div className="hero-buttons">
              <button className="btn-primary">🚀 BEGIN YOUR JOURNEY</button>
              <button className="btn-secondary">EXPLORE CATEGORIES →</button>
            </div>

          </div>
        </section>

        {/* STATS */}
        <section className="snap-section stats-section">
          <div className="stats-wrapper">
            <p className="stats-intro">Lights on. Camera ready. Stories begin.</p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="snap-section categories-section">
          <div className="categories-wrapper">
            <h2 className="categories-title">Competition Categories</h2>
            <p className="categories-subtitle">
              Five distinct tracks for every storyteller
            </p>

            <div className="category-grid">
              {CATEGORIES.map((c) => (
                <div key={c.id} className="category-card">
                  <div className={`category-icon ${c.id}`}>{c.icon}</div>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="snap-section about-section">
          <div className="about-heading">
            <h2>Where Stories Come to Life</h2>
            <p>A celebration of cinema, creativity, and collaboration</p>
          </div>

          <div className="about-card">
            <p className="about-text">
              Lumière is North India's <span className="purple">premier student film festival</span>.
            </p>

            <div className="about-cta">
              <Link to="/about" className="about-btn">LEARN MORE ✨</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section className="snap-section footer-section">
          <footer className="footer-box">
            <h3>LUMIERE 2026</h3>
            <p className="footer-copy">© 2026 Lumière Film Festival</p>
          </footer>
        </section>

      </div>
    </div>
  );
}

