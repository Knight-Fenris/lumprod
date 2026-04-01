import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MonsterLaunch.css';

const MONSTER_LOGO = '/Brand_Logos/Monster%20Energy%20(Presented%20By).png';
const MONSTER_VIDEO = '/monster-launch-bg.mp4';
const LUMIERE_LOGO = '/logo-text-1.png';
const MIN_LOADER_DURATION_MS = 2000;
const VIDEO_READY_FALLBACK_MS = 3500;

const FEATURE_STATS = [
  { value: '1.2L', label: 'Prize Pool' },
  { value: '13', label: 'Festival Events' },
  { value: '3', label: 'Festival Days' },
];

export default function MonsterLaunch() {
  const videoRef = useRef(null);
  const [isVideoSettled, setIsVideoSettled] = useState(false);
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    const delayTimerId = window.setTimeout(() => {
      setIsDelayComplete(true);
    }, MIN_LOADER_DURATION_MS);

    // If media events never fire (missing file/network/autoplay), don't block the page forever.
    const mediaFallbackTimerId = window.setTimeout(() => {
      setIsVideoSettled(true);
    }, VIDEO_READY_FALLBACK_MS);

    return () => {
      window.clearTimeout(delayTimerId);
      window.clearTimeout(mediaFallbackTimerId);
    };
  }, []);

  const handleVideoReady = () => {
    setIsVideoSettled(true);
    if (videoRef.current && typeof videoRef.current.play === 'function') {
      videoRef.current.play().catch(() => {
        // Ignore autoplay block; muted + playsInline should normally work.
      });
    }
  };

  const hideLoader = isVideoSettled && isDelayComplete;

  return (
    <main className="monster-launch-page">
      <div className="monster-launch-video-shell" aria-hidden="true">
        <video
          ref={videoRef}
          className="monster-launch-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
          onError={() => {
            setIsVideoSettled(true);
          }}
        >
          <source src={MONSTER_VIDEO} type="video/mp4" />
        </video>
        <div className="monster-launch-video-tint" />
        <div className="monster-launch-video-noise" />
      </div>

      <div className={`monster-launch-loader ${hideLoader ? 'monster-launch-loader--hidden' : ''}`}>
        <p className="monster-launch-loader-kicker">Monster Energy x Lumiere 2026</p>
        <h2>Launching</h2>
      </div>

      <section className={`monster-launch-hero ${hideLoader ? '' : 'monster-launch-hero--hidden'}`}>
        <p className="monster-launch-eyebrow">Lumiere 2026</p>
        <div className="monster-launch-lumiere-wrap">
          <img
            src={LUMIERE_LOGO}
            alt="Lumiere logo"
            className="monster-launch-lumiere-logo"
          />
        </div>

        <p className="monster-launch-presents">presented by</p>

        <div className="monster-launch-logo-wrap">
          <img
            src={MONSTER_LOGO}
            alt="Monster Energy logo"
            className="monster-launch-logo"
          />
        </div>

        <div className="monster-launch-title-wrap">
          <p className="monster-launch-overline">Fuel The Frame</p>
          <h1>Walk In Charged</h1>
        </div>

        <p className="monster-launch-copy">
          Big screen energy. Fast competition. Loud nights. Lumiere 2026 is built for people who
          want more than a festival pass. Come in ready for the rush, stay for the films, the
          crowd, and everything moving around it.
        </p>

        <div className="monster-launch-signal">
          <span>Catch the charge when you land at Lumiere.</span>
        </div>

        <section className="monster-launch-stats" aria-label="Festival highlights">
          {FEATURE_STATS.map((item) => (
            <article key={item.label} className="monster-launch-stat-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="monster-launch-highlights" aria-label="Key attractions">
          <div className="monster-launch-panel monster-launch-panel--accent">
            <p className="monster-launch-panel-kicker">Festival Highlights</p>
            <h2>Key Festival Events</h2>
            <ul>
              <li>Lumiere Sprint and high-intensity filmmaking challenges</li>
              <li>Prism Showcase, Northern Ray, Vertical Ray, and Verite</li>
            </ul>
          </div>

          <div className="monster-launch-panel monster-launch-panel--accent">
            <p className="monster-launch-panel-kicker">DriftX Spotlight</p>
            <h2>Go-Karting Competition</h2>
            <ul>
              <li>Platform: Go-Karting</li>
              <li>Format: Individual races, time trials</li>
              <li>Prize pool: Part of 1.2L</li>
            </ul>
          </div>

          <div className="monster-launch-panel monster-launch-panel--accent">
            <p className="monster-launch-panel-kicker">BGMI Spotlight</p>
            <h2>BGMI FEST</h2>
            <ul>
              <li>Platform: BGMI</li>
              <li>Format: Team vs Team, round-robin + playoffs</li>
              <li>Prize pool: 10k, brought to you by Nordwin in support of Monster as energy drink partner</li>
            </ul>
          </div>
        </section>

        <div className="monster-launch-actions">
          <Link to="/register" className="monster-launch-button monster-launch-button--primary">
            Register For Lumiere
          </Link>
          <Link to="/" className="monster-launch-button monster-launch-button--secondary">
            Explore Lumiere
          </Link>
        </div>
      </section>
    </main>
  );
}
