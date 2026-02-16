import { useState } from "react";
import { Link } from "react-router-dom";
import "./FAQ.css";

const faqs = [
  {
    question: 'Who can participate in LUMIERE 2026?',
    answer: 'LUMIERE 2026 is open to all student filmmakers across India. Different categories have different eligibility criteria. The Northern Ray is specifically for filmmakers from Punjab, Chandigarh, Haryana, and Himachal Pradesh. Prism Showcase and Vérité are open to students from any recognized Indian institution. Lumiere Sprint is an internal competition for PEC students only.',
  },
  {
    question: 'What is the submission deadline?',
    answer: 'Submissions open in January 2026 and close 2 weeks before the event (approximately March 6, 2026). The Lumiere Sprint (48-hour challenge) has its own deadline during the event itself. Make sure to submit early to avoid last-minute issues.',
  },
  {
    question: 'How do I submit my film?',
    answer: 'Upload your film to Google Drive, set sharing to "Anyone with the link can view", create an account on our portal, fill in the submission form with your film details, paste the Google Drive link, complete the category fee payment, and submit. You will receive a confirmation email.',
  },
  {
    question: 'What are the submission fees?',
    answer: 'The Northern Ray: ₹499 per team | Prism Showcase: ₹599 per team | Vérité: ₹499 per team | Lumiere Sprint: ₹200 per team | Vertical Ray: ₹149 per entry. All fees are non-refundable.',
  },
  {
    question: 'What file formats are accepted?',
    answer: 'We accept MP4, MOV, and MKV files. Videos should be in H.264 or Apple ProRes 422 codec, minimum 1080p resolution, 24 or 25 fps frame rate. Audio should be AAC or PCM at 48kHz. English subtitles are mandatory for non-English films.',
  },
  {
    question: 'Can I submit multiple films?',
    answer: 'Yes! You can submit multiple different films across different categories. However, the same film cannot be submitted to multiple categories. Each submission requires a separate fee.',
  },
  {
    question: 'What happens after I submit?',
    answer: 'After submission, your film goes through our jury review process. Selected films will be notified via email and will be screened during the festival (March 20-22, 2026). Winners will be announced at The Luminous Gala on the final evening.',
  },
  {
    question: 'Is there a maximum file size?',
    answer: 'There is no strict file size limit since you upload to your own Google Drive. However, we recommend keeping files under 4GB for optimal playback. Ensure your Google Drive has sufficient storage.',
  },
  {
    question: 'What is the Lumiere Sprint?',
    answer: 'Lumiere Sprint is our 48-hour filmmaking challenge. Participants receive a surprise theme/prompt at the kickoff (Day 1, 12 PM) and must complete their 3-7 minute film within 48 hours. This is an internal competition open only to PEC students.',
  },
  {
    question: 'Can I attend the festival without submitting a film?',
    answer: 'Yes! The festival is open to all cinema enthusiasts. Screenings, workshops, and panels are open to the public. Only the competition categories require submission and payment.',
  },
  {
    question: 'How are films judged?',
    answer: 'Films are evaluated by a jury of industry professionals based on: storytelling and narrative, technical excellence (cinematography, editing, sound), originality and creativity, adherence to the theme, and overall impact. Technical awards are given separately for specific achievements.',
  },
  {
    question: 'What are the prizes?',
    answer: 'Total prize pool exceeds ₹1.2 Lakhs across all categories. Each category has Winner and Runner-up prizes. Additionally, technical awards (Best Director, Best Cinematography, Best Editing, Best Sound Design, Best Screenplay) and the Audience Aperture Award are given.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about LUMIERE 2026</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleFaq(index)}
            >
              <span>{faq.question}</span>
              <span
                className={`arrow ${
                  openIndex === index ? "rotate" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`faq-answer ${
                openIndex === index ? "open" : ""
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <h2>Still have questions?</h2>
        <p>
          Contact us at{" "}
          <a href="mailto:pdc@pec.edu.in">pdc@pec.edu.in</a>
        </p>
      </div>
    </div>
  );
}
