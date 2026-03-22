import { useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  DEFAULT_SPONSORS_CONTENT,
  sortSponsors,
} from '../config/sponsors';
import { getSponsorsContent } from '../services/sponsorService';
import './Sponsors.css';

const FALLBACK_LOGO = '/events/undermaintenance.png';

export default function Sponsors() {
  const [content, setContent] = useState(DEFAULT_SPONSORS_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSponsors = async () => {
      try {
        const nextContent = await getSponsorsContent();
        if (mounted) {
          setContent(nextContent);
        }
      } catch (error) {
        console.error('Failed to load sponsors content:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSponsors();

    return () => {
      mounted = false;
    };
  }, []);

  const groupedSponsors = useMemo(() => {
    const orderedSponsors = sortSponsors(content.sponsors.filter((item) => item.isActive));
    const groupsBySection = new Map();

    orderedSponsors.forEach((item) => {
      const title = String(item.sectionTitle || '').trim() || 'Sponsors';
      if (!groupsBySection.has(title)) {
        groupsBySection.set(title, []);
      }
      groupsBySection.get(title).push(item);
    });

    return Array.from(groupsBySection.entries()).map(([title, items]) => ({
      title,
      items,
    }));
  }, [content.sponsors]);

  return (
    <main className="sponsors-page">
      <section className="sponsors-hero">
        <p className="sponsors-eyebrow">Lumiere 2026</p>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </section>

      {loading ? (
        <section className="sponsors-state">Loading sponsors...</section>
      ) : groupedSponsors.length === 0 ? (
        <section className="sponsors-state">Sponsor details will be announced soon.</section>
      ) : (
        <div className="sponsors-sections">
          {groupedSponsors.map((group) => (
            <section key={group.title} className="sponsors-tier-block" aria-label={group.title}>
              <div className="sponsors-tier-head">
                <h2>{group.title}</h2>
              </div>

              <div className="sponsors-grid">
                {group.items.map((sponsor) => (
                  <article key={sponsor.id} className="sponsor-card">
                    <div className="sponsor-logo-wrap">
                      <img
                        src={sponsor.logoUrl || FALLBACK_LOGO}
                        alt={`${sponsor.name || 'Sponsor'} logo`}
                        className="sponsor-logo"
                        onError={(event) => {
                          if (event.currentTarget.dataset.fallbackApplied === 'true') return;
                          event.currentTarget.dataset.fallbackApplied = 'true';
                          event.currentTarget.src = FALLBACK_LOGO;
                        }}
                      />
                    </div>

                    <div className="sponsor-content">
                      <h3>{sponsor.name || 'Sponsor'}</h3>
                      {sponsor.description ? <p>{sponsor.description}</p> : null}

                      {sponsor.websiteUrl ? (
                        <a href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="sponsor-link">
                          Visit Website
                          <ExternalLink size={14} aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}