import { Link } from 'react-router-dom';

const targetAudience = [
  {
    title: 'Student Filmmakers',
    subtitle: 'The Next Generation of Auteurs',
    description: 'Aspiring storytellers from Film, Mass Communication, and media-focused programs across North India seeking recognition and professional feedback.',
    icon: '🎓',
  },
  {
    title: 'Content Creators',
    subtitle: 'The Vertical Revolution',
    description: 'Masters of short-form, vertical video formats who engage audiences through Instagram Reels, YouTube Shorts, and digital-native content.',
    icon: '💡',
  },
  {
    title: 'Cinema Enthusiasts',
    subtitle: 'The Dedicated Audience',
    description: 'Tricity residents with deep appreciation for independent, arthouse cinema — seeking meaningful, challenging cinematic experiences.',
    icon: '❤️',
  },
  {
    title: 'Industry Professionals',
    subtitle: 'Mentors & Talent Scouts',
    description: 'Directors, cinematographers, producers, and representatives from production houses scouting for fresh, innovative talent.',
    icon: '💼',
  },
];

const outcomes = [
  { stat: '100,000+', label: 'Expected Audience Reach' },
  { stat: '10+', label: 'Industry Experts' },
  { stat: '250+', label: 'Students Trained' },
  { stat: '₹3,00,000', label: 'Total Event Budget' },
];

export default function About() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            About <span className="gradient-text">LUMIERE 2026</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.5rem' }}>
            "North India's definitive convergence of art and technology"
          </p>
        </div>

        {/* Executive Summary */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            🎯 Executive Summary
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>LUMIERE 2026</strong> is a strategic initiative by the Projection and Design Club (PDC) 
            to establish Punjab Engineering College as a hub for cinematic arts in North India. It is designed as a{' '}
            <strong style={{ color: '#a78bfa' }}>hybrid competitive and educational platform</strong> that 
            bridges the gap between technical engineering and creative storytelling.
          </p>
          
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card-label">Theme</div>
              <div className="info-card-value">"Stories That Matter: Cinema for Social Change"</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">📅 Dates</div>
              <div className="info-card-value">March 20 - 22, 2026</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">📍 Venue</div>
              <div className="info-card-value">PEC, Chandigarh</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">👥 Participation</div>
              <div className="info-card-value">500-600 Attendees</div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>🎬 Introduction</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            Prepare to witness North India's most monumental convergence of art and technology. Lumiere 2026 is not just a festival; 
            it is the <strong style={{ color: 'var(--text-primary)' }}>definitive Cinematic Arts Event</strong> of the region, designed to be the ultimate battleground 
            for India's most visionary student filmmakers. This is where the lens captures the future: a colossal stage where the precision 
            of engineering meets the boundless soul of storytelling.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
            With an elite ecosystem of industry giants and high-stakes competition, this event stands as the biggest, boldest, and most 
            immersive cultural movement in the history of Punjab Engineering College. <em style={{ color: '#a78bfa' }}>This is more than an event. It is a movement.</em>
          </p>
        </div>

        {/* Target Audience */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Target Audience</h2>
          <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {targetAudience.map((item, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ color: '#a78bfa', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{item.subtitle}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expected Outcomes */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Expected Outcomes</h2>
          <div className="stats-grid">
            {outcomes.map((item, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{item.stat}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to Showcase Your Story?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Submit your film and be part of North India's premier student film festival.
          </p>
          <Link to="/submit" className="btn btn-primary btn-lg">Submit Your Film →</Link>
        </section>
      </div>
    </div>
  );
}
