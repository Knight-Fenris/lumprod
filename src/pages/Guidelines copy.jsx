import { Link } from 'react-router-dom';

const submissionRules = [
  { 
    title: 'Original Work Declaration', 
    desc: 'You must own or have rights to all content (music, footage, artwork) included in the film. No third-party copyrights, trademarks, or intellectual property infringement.',
    icon: '✅',
  },
  { 
    title: 'Duration Limits', 
    desc: 'The Northern Ray: 5-20 min | Prism: 5-15 min | Lumiere Sprint: 3-7 min | Vertical Ray: Max 60 seconds. Submissions exceeding limits may be disqualified.',
    icon: '⏱️',
  },
  { 
    title: 'Credits & Metadata', 
    desc: 'Ensure film title, synopsis, and credits are accurate and consistent. Burnt-in English subtitles are mandatory for all non-English films.',
    icon: 'ℹ️',
  },
  { 
    title: 'Content Guidelines', 
    desc: 'Content must comply with applicable laws and platform policies. No harassment, hate speech, or harmful content. Theme: "Stories That Matter: Cinema for Social Change".',
    icon: '⚠️',
  },
  { 
    title: 'One Film, One Category', 
    desc: 'Submit the same film only once per category. Multiple different films can be submitted across categories with separate fees.',
    icon: '🎬',
  },
  { 
    title: 'Deadline', 
    desc: 'All uploads must complete before the submission deadline. Late submissions are not guaranteed review. Lumiere Sprint has a strict 48-hour window.',
    icon: '📅',
  },
];

const technicalSpecs = {
  video: [
    { label: 'Video Codec', value: 'H.264 or Apple ProRes 422' },
    { label: 'Resolution', value: '1920 x 1080 (Full HD) minimum' },
    { label: 'Frame Rate', value: '24 fps or 25 fps' },
    { label: 'Bitrate', value: 'Minimum 20 Mbps' },
  ],
  audio: [
    { label: 'Audio Codec', value: 'AAC or PCM' },
    { label: 'Sample Rate', value: '48kHz' },
    { label: 'Peak Levels', value: '-12dB' },
  ],
  general: [
    { label: 'File Formats', value: 'MP4, MOV, MKV' },
    { label: 'Subtitles', value: 'Burnt-in English (required)' },
    { label: 'Aspect Ratio', value: '16:9 or 9:16 (Vertical)' },
  ],
};

export default function Guidelines() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="gradient-text">Submission Guidelines</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Technical specifications and rules to ensure your submission meets LUMIERE 2026 standards.
          </p>
        </div>

        {/* Submission Rules */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Submission Rules</h2>
          <div className="guidelines-grid">
            {submissionRules.map((rule, i) => (
              <div key={i} className="guideline-card">
                <div className="guideline-icon">{rule.icon}</div>
                <div className="guideline-content">
                  <h3>{rule.title}</h3>
                  <p>{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            🖥️ Technical Specifications
          </h2>
          
          <div className="specs-grid">
            {/* Video Specs */}
            <div className="spec-section">
              <div className="spec-header">
                <span>🎬</span> Video
              </div>
              {technicalSpecs.video.map((spec, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Audio Specs */}
            <div className="spec-section">
              <div className="spec-header">
                <span>🔊</span> Audio
              </div>
              {technicalSpecs.audio.map((spec, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* General Specs */}
            <div className="spec-section">
              <div className="spec-header">
                <span>📁</span> General
              </div>
              {technicalSpecs.general.map((spec, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upload Instructions */}
        <section className="card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            📤 How to Submit
          </h2>
          <ol style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.5rem' }}>
            <li>Upload your film to <strong style={{ color: 'var(--text-primary)' }}>Google Drive</strong></li>
            <li>Set sharing permissions to <strong style={{ color: 'var(--text-primary)' }}>"Anyone with the link can view"</strong></li>
            <li>Create an account or log in to the Lumiere portal</li>
            <li>Fill in the submission form with film details</li>
            <li>Paste your Google Drive link in the submission form</li>
            <li>Complete payment for your category</li>
            <li>Submit and wait for confirmation email</li>
          </ol>
        </section>

        {/* Important Notes */}
        <section className="card" style={{ background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24' }}>
            ⚠️ Important Notes
          </h2>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.5rem' }}>
            <li>Keep your Google Drive link accessible until the festival ends</li>
            <li>Do not delete or move your uploaded files after submission</li>
            <li>Submission fees are non-refundable</li>
            <li>Results will be announced on the final day of the festival</li>
            <li>Selected films will be notified via email</li>
          </ul>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Link to="/submit" className="btn btn-primary btn-lg">Submit Your Film →</Link>
        </section>
      </div>
    </div>
  );
}
