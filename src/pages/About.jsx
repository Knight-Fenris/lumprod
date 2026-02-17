import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <div className="hero-stack">
        <h1 className="hero-title">LUMIERE</h1>
        {/* <p className="hero-subtitle">PEC</p> */}
      </div>

      {/* INTRO */}
      <div className="split">
        <div className="split-left">
          <h1 className="split-heading">Where It Began...</h1>
          <p className="split-content">
            It started in late-night edits, borrowed cameras,
            and conversations about films that deserved more space.
          </p>
          <p className="split-content">
            Lumiere is built for creators who want their stories
            to be seen, heard, and felt.
          </p>
        </div>

        <div className="split-right">
          <div className="image-box">
            🎥 Behind the Scenes
          </div>
        </div>
      </div>

      {/* QUOTE */}
      <div className="quote">
        “Where stories come alive and <br></br>dreams take flight.”
      </div>

      {/* AUDIENCE SECTION */}
      <div className="audience-section">

        <div className="audience-left">
          <div className="audience-image">
            🎬 Festival Visual
          </div>
        </div>

        <div className="audience-right">
          <h1 className="split-heading">Who Is It For?</h1>

          <div className="timeline">
            <div className="timeline-item">
              <h1>Student Filmmakers</h1>
              <p>Your first big cinematic stage.</p>
            </div>

            <div className="timeline-item">
              <h1>Content Creators</h1>
              <p>Fast, bold and digital-native storytelling.</p>
            </div>

            <div className="timeline-item">
              <h1>Cinema Lovers</h1>
              <p>Those who feel every frame deeply.</p>
            </div>

            <div className="timeline-item">
              <h1>Industry Mentors</h1>
              <p>Guiding the next generation of voices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* PDC SECTION */}
      <div className="pdc-section">

        <div className="pdc-left">
          <h2>Projection & Design Club (PDC)</h2>
          <p>
            The Projection and Design Club of PEC Chandigarh is the institute’s
            official creative and visual media society.
          </p>
          <p>
            From film-making and photography to large-scale event production,
            PDC has consistently shaped the cinematic and design culture on campus.
          </p>
          <p>
            Lumiere 2026 is a natural extension of that vision —
            taking PEC’s creative energy to a national stage.
          </p>
        </div>

        <div className="pdc-right">
          <div className="pdc-image">
            🏛 PDC Creative Space
          </div>
        </div>

      </div>

    </div>
  );
}
