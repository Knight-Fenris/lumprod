import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

const CATEGORIES = [
  { id: "northern_ray", name: "The Northern Ray", icon: "📍", desc: "Regional Short Films" },
  { id: "prism", name: "Prism Showcase", icon: "🌐", desc: "National Student Films" },
  { id: "verite", name: "Vérité", icon: "🎥", desc: "Documentary Films" },
  { id: "sprint", name: "Lumière Sprint", icon: "⚡", desc: "48-Hour Challenge" },
  { id: "vertical", name: "Vertical Ray", icon: "📱", desc: "Mobile Vertical Films" },
];

export default function Home() {
  /* ======================
     COUNTDOWN
  ====================== */
  const festivalDate = new Date("April 10, 2026 00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    document.body.classList.add("home");

    const logoWrapper = document.querySelector(".logo-wrapper");
    if (!logoWrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const header = document.querySelector(".header");
        if (!header) return;

        if (entry.isIntersecting) {
          header.classList.remove("show-header");
        } else {
          header.classList.add("show-header");
        }
      },
      {
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px",
      }
    );

    observer.observe(logoWrapper);

    return () => {
      document.body.classList.remove("home");
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = festivalDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ======================
     SCROLL ANIMATION
  ====================== */
  useEffect(() => {
    const sections = document.querySelectorAll(".snap-section");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page">
      <div className="scroll-container">

        {/* ================= HERO ================= */}
          <section className="snap-section hero-section" id="hero">
          <div className="hero-inner fade-section">

            <div className="hero-badge">
              10 APRIL 2026 • PEC CHANDIGARH
            </div>

            {/* <h1 className="hero-title glow-text">LUMIÈRE</h1> */}
            <div className="logo-wrapper">
                {/* <br /> */}
                <img
                  src="/logo-text.png"
                  alt="Lumière"
                  className="logo-text"
                />
            </div>
            {/* COUNTDOWN */}
            <div className="countdown">
              <div className="time-box">
                <span>{timeLeft.days}</span>
                <small>Days</small>
              </div>
              <div className="time-box">
                <span>{timeLeft.hours}</span>
                <small>Hours</small>
              </div>
              <div className="time-box">
                <span>{timeLeft.minutes}</span>
                <small>Minutes</small>
              </div>
            </div>

            <p className="hero-subtitle">National Film Festival 2026</p>

            <p className="hero-tagline">
              Where <span className="purple">stories come alive</span> and{" "}
              <span className="gold">dreams take flight</span>
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Begin Your Journey</Link>
              <Link to="/about" className="btn-secondary">Explore Festival →</Link>
            </div>
          </div>
        </section>

        {/* ================= STATS (TEASER) ================= */}
        <section className="snap-section stats-section">
          <div className="stats-wrapper">

            <p className="stats-intro">
              Lights on. Camera ready. Stories begin.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon calendar"></div>
                <div className="stat-value">3</div>
                <div className="stat-label">Days</div>
                <p className="stat-desc">Non-stop screenings & events</p>
              </div>

              <div className="stat-card">
                <div className="stat-icon clapper"></div>
                <div className="stat-value">5</div>
                <div className="stat-label">Categories</div>
                <p className="stat-desc">Fiction, docs & more</p>
              </div>

              <div className="stat-card">
                <div className="stat-icon prize"></div>
                <div className="stat-value">₹1.96L</div>
                <div className="stat-label">Prize Pool</div>
                <p className="stat-desc">Celebrating cinematic excellence</p>
              </div>

              <div className="stat-card">
                <div className="stat-icon users"></div>
                <div className="stat-value">500+</div>
                <div className="stat-label">Participants</div>
                <p className="stat-desc">Filmmakers from across India</p>
              </div>
            </div>

          </div>
        </section>
        {/* ================= ABOUT ================= */}
        <section className="snap-section about-section">
          <div className="about-heading">
            <h2>Where Stories Come to Life</h2>
            <p>Cinema · Creativity · Collaboration</p>
          </div>

          <div className="about-card">
            <p className="about-text">
              Lumière is North India’s{" "}
              <span className="purple">premier student film festival</span>,
              celebrating festival-ready cinema, bold ideas and original voices.
            </p>

            <p className="about-subtext">
              Hosted at <span className="gold">PEC Chandigarh</span>, Lumière
              brings together filmmakers from across the country for three
              unforgettable days of screenings, challenges and conversations.
            </p>

            <div className="about-cta">
              <Link to="/about" className="about-btn">Learn More</Link>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <section className="snap-section footer-section">
          <footer className="footer-box">
            <h3>LUMIERE</h3>
            <p className="footer-org">
              Projection & Design Club, PEC Chandigarh
            </p>

            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/guidelines">Guidelines</Link>
              <Link to="/faq">FAQ</Link>
            </div>

            <p className="footer-copy">
              © 2026 Lumière National Film Festival
            </p>
          </footer>
        </section>

      </div>
    </div>
  );
}