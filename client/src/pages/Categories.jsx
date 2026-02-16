import { Link } from "react-router-dom";
import "./Categories.css";

const categories = [
  {
    id: "lumiere_sprint",
    name: "Lumiere Sprint",
    tagline: "48-Hour Challenge",
    description:
      "A flash of creativity — high intensity filmmaking.",
    icon: "⚡",
    fee: 200,
    duration: "3-7 min",
    format: "48-Hour Short Film",
    eligibility: "Open to all",
    genres: ["Prompt-based", "Any Genre"],
  },
  {
    id: "northern_ray",
    name: "The Northern Ray",
    tagline: "Regional Shorts",
    description:
      "Highlighting the soil and soul of the region. Regional narratives, folk adaptations, social realism, and rural/urban conflict.",
    icon: "📍",
    fee: 499,
    duration: "5-20 min",
    format: "Narrative Short",
    eligibility:
      "Students/Youth from Punjab, Chandigarh, Haryana, HP",
    genres: [
      "Regional Narratives",
      "Folk Adaptations",
      "Social Realism",
      "Rural/Urban Conflict",
    ],
  },
  {
    id: "prism",
    name: "Prism Showcase",
    tagline: "National Student Cinema",
    description:
      "A spectrum of stories from across the nation refracting through one screen.",
    icon: "🌐",
    fee: 599,
    duration: "5-15 min",
    format: "Narrative Short",
    eligibility:
      "Students from any recognized Indian institution",
    genres: ["Drama", "Thriller", "Sci-Fi", "Comedy"],
  },
  {
    id: "vertical_ray",
    name: "Vertical Ray",
    tagline: "Mobile Storytelling",
    description:
      "Cinema for the modern mobile era. Micro-stories and visual poems.",
    icon: "📱",
    fee: 149,
    duration: "Max 60 sec",
    format: "Vertical Video (9:16)",
    eligibility: "Open to all",
    genres: ["Micro-stories", "Visual Poems", "Comedy"],
  },
];

const technicalAwards = [
  "Best Director",
  "Best Cinematography",
  "Best Editing",
  "Best Sound Design",
  "Best Screenplay",
  "Audience Aperture Award",
];

export default function Categories() {
  return (
    <div className="categories-page">
      {/* HERO */}
      <div className="categories-hero-stack">
        <h1 className="categories-hero-title">Competition Categories</h1>
        <p className="categories-hero-subtitle">5 distinct competitive tracks designed to showcase diverse filmmaking talents.</p>
      </div>

      {/* CATEGORY CARDS */}
      <div className="categories-wrapper">
        {categories.map((c) => (
          <div
            key={c.id}
            className={`category-card${c.id === "lumiere_sprint" ? " sprint-card" : ""}`}
          >
            <div className="category-left">
              <div className="category-title-row">
                <span className="category-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <h3>{c.tagline}</h3>
              <p className="category-description">{c.description}</p>

              <div className="genre-list">
                {c.genres.map((g) => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            </div>

            <div className="category-right">
              <div className="info-block">

                <div className="info-row">
                  <span>Submission</span>
                  <p>₹{c.fee}</p>
                </div>

                <div className="info-row">
                  <span>Duration</span>
                  <p>{c.duration}</p>
                </div>

                <div className="info-row eligibility">
                  <span>Eligibility</span>
                  <p>{c.eligibility}</p>
                </div>

              </div>

              <Link to="/submit" className="submit-btn">
                {`Submit to ${c.name} →`}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* TECHNICAL AWARDS */}
      <section className="awards-section">
        <h2>Technical & Jury Awards</h2>
        <p>
          In addition to category winners, special recognition awards are given for technical excellence.
        </p>

        <div className="awards-grid">
          {technicalAwards.map((award) => (
            <span key={award} className="award-pill">
              {award}
            </span>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Ready to Showcase Your Vision?</h2>
        <Link to="/submit" className="submit-main-btn">
          Submit Your Film →
        </Link>
      </section>
    </div>
  );
}
