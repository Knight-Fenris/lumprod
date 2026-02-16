import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'northern_ray',
    name: 'The Northern Ray',
    tagline: 'Regional Shorts',
    description: 'Highlighting the soil and soul of the region. Regional narratives, folk adaptations, social realism, and rural/urban conflict.',
    icon: '📍',
    fee: 499,
    duration: '5-20 min',
    format: 'Narrative Short',
    eligibility: 'Students/Youth from Punjab, Chandigarh, Haryana, HP',
    genres: ['Regional Narratives', 'Folk Adaptations', 'Social Realism', 'Rural/Urban Conflict'],
    color: 'amber',
  },
  {
    id: 'prism',
    name: 'Prism Showcase',
    tagline: 'National Student Cinema',
    description: 'A spectrum of stories from across the nation refracting through one screen. Drama, thriller, sci-fi, comedy, and experimental fiction.',
    icon: '🌐',
    fee: 599,
    duration: '5-15 min',
    format: 'Narrative Short',
    eligibility: 'Students from any recognized Indian institution',
    genres: ['Drama', 'Thriller', 'Sci-Fi', 'Comedy', 'Experimental Fiction'],
    color: 'violet',
  },
  {
    id: 'lumiere_sprint',
    name: 'Lumiere Sprint',
    tagline: '48-Hour Challenge',
    description: 'A flash of creativity — high intensity filmmaking. Prompt-based themes given on the spot.',
    icon: '⚡',
    fee: 200,
    duration: '3-7 min',
    format: '48-Hour Short Film',
    eligibility: 'PEC Students (Internal Competition)',
    genres: ['Prompt-based', 'Any Genre'],
    color: 'cyan',
  },
  {
    id: 'vertical_ray',
    name: 'Vertical Ray',
    tagline: 'Mobile Storytelling',
    description: 'Cinema for the modern mobile era. Micro-stories, visual poems, comedy sketches, and "day in the life" content.',
    icon: '📱',
    fee: 149,
    duration: 'Max 60 sec',
    format: 'Vertical Video (9:16)',
    eligibility: 'Open to all',
    genres: ['Micro-stories', 'Visual Poems', 'Comedy Sketches'],
    color: 'rose',
  },
];

const technicalAwards = [
  'Best Director',
  'Best Cinematography', 
  'Best Editing',
  'Best Sound Design',
  'Best Screenplay',
  'Audience Aperture Award',
];

export default function Categories() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="gradient-text">Competition Categories</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            5 distinct competitive tracks designed to showcase diverse filmmaking talents.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {categories.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                {/* Left side */}
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                  <div className={`category-icon ${c.color}`} style={{ marginBottom: '1rem' }}>
                    {c.icon}
                  </div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{c.name}</h2>
                  <p style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem' }}>{c.tagline}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.6' }}>{c.description}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {c.genres.map((genre) => (
                      <span key={genre} style={{
                        padding: '0.25rem 0.75rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side */}
                <div style={{ flex: '1 1 300px', minWidth: '280px', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="info-card">
                      <div className="info-card-label">Submission Fee</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{c.fee}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per team</div>
                    </div>
                    <div className="info-card">
                      <div className="info-card-label">Duration</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{c.duration}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.format}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Eligibility</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                      👥 {c.eligibility}
                    </div>
                  </div>

                  <Link to="/submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                    Submit to {c.name} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Awards */}
        <section className="card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            🏆 Technical & Jury Awards
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            In addition to category winners, special recognition awards are given for technical excellence:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {technicalAwards.map((award) => (
              <span key={award} style={{
                padding: '0.5rem 1rem',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                color: '#a78bfa'
              }}>
                {award}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '2rem 0' }}>
          <Link to="/submit" className="btn btn-primary btn-lg">Submit Your Film →</Link>
        </section>
      </div>
    </div>
  );
}
