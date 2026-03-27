import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_SPONSORS_CONTENT } from '../config/sponsors';
import { getSponsorsContent } from '../services/sponsorService';
import './Sponsors.css';

const FALLBACK_LOGO = '/events/undermaintenance.png';
const BRAND_LOGO_FILES = [
  'Monster Energy (Presented By).png',
  'RIF (Industry and Festival partner).png',
  'DriftX (Go karting partner).jpeg',
];

const toPublicLogoUrl = (fileName) => `/Brand_Logos/${encodeURIComponent(fileName)}`;

const parseLogoFilename = (fileName) => {
  const withoutExtension = String(fileName || '').replace(/\.[^/.]+$/, '');
  const match = withoutExtension.match(/^(.*)\((.*)\)$/);

  if (!match) {
    return {
      name: withoutExtension.trim() || 'Sponsor',
      tierLabel: 'Partner',
    };
  }

  return {
    name: match[1].trim() || 'Sponsor',
    tierLabel: match[2].trim() || 'Partner',
  };
};

const inferTier = (tierLabel) => {
  const normalized = String(tierLabel || '').toLowerCase();

  if (/presented\s*by/.test(normalized)) {
    return { rank: 1, label: 'Presented By' };
  }

  if (/industry|festival/.test(normalized)) {
    return { rank: 2, label: 'Industry and Festival Partner' };
  }

  return { rank: 3, label: tierLabel || 'Partner' };
};

const DEFAULT_LOCAL_SPONSORS = BRAND_LOGO_FILES.map((fileName, index) => {
  const parsed = parseLogoFilename(fileName);
  const tier = inferTier(parsed.tierLabel);

  return {
    id: `local-${index}-${parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: parsed.name,
    tierLabel: parsed.tierLabel || tier.label,
    tierRank: tier.rank,
    logoUrl: toPublicLogoUrl(fileName),
    order: index,
  };
});

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

  const arrangedSponsors = useMemo(() => {
    const serviceSponsors = content.sponsors
      .filter((item) => item.isActive)
      .map((item, index) => {
        const tier = inferTier(item.sectionTitle || item.tier || '');
        const order = Number(item.order);

        return {
          id: item.id || `service-${index}`,
          name: item.name || 'Sponsor',
          tierLabel: String(item.sectionTitle || item.tier || tier.label).trim() || tier.label,
          tierRank: tier.rank,
          logoUrl: item.logoUrl || FALLBACK_LOGO,
          order: Number.isFinite(order) ? order : index,
        };
      });

    const baseList = serviceSponsors.length > 0 ? serviceSponsors : DEFAULT_LOCAL_SPONSORS;

    return [...baseList]
      .sort((a, b) => {
        const tierDiff = a.tierRank - b.tierRank;
        if (tierDiff !== 0) return tierDiff;

        const orderDiff = a.order - b.order;
        if (orderDiff !== 0) return orderDiff;

        return a.name.localeCompare(b.name);
      });
  }, [content.sponsors]);

  const presentedBySponsors = useMemo(() => {
    return arrangedSponsors.filter((item) => item.tierRank === 1);
  }, [arrangedSponsors]);

  const partnerSponsors = useMemo(() => {
    const others = arrangedSponsors.filter((item) => item.tierRank !== 1);
    const drift = others.find((item) => String(item.name || '').toLowerCase().includes('drift'));
    const rif = others.find((item) => {
      const normalizedName = String(item.name || '').toLowerCase();
      const normalizedTier = String(item.tierLabel || '').toLowerCase();

      return normalizedName.includes('rif') || /industry|festival/.test(normalizedTier);
    });

    const selectedIds = new Set([drift?.id, rif?.id].filter(Boolean));
    const remaining = others.filter((item) => !selectedIds.has(item.id));

    return [drift, rif, ...remaining].filter(Boolean);
  }, [arrangedSponsors]);

  const topLogos = presentedBySponsors.length > 0 ? presentedBySponsors : arrangedSponsors.slice(0, 1);

  return (
    <main className="sponsors-page">
      <section className="sponsors-hero">
        <p className="sponsors-eyebrow">Lumiere 2026</p>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </section>

      {loading ? (
        <section className="sponsors-state">Loading sponsors...</section>
      ) : arrangedSponsors.length === 0 ? (
        <section className="sponsors-state">Sponsor details will be announced soon.</section>
      ) : (
        <section className="sponsors-poster-layout" aria-label="Sponsors lineup">
          <section className="sponsors-top-slot" aria-label="Presented By">
            <h2 className="sponsors-slot-title">Presented By</h2>

            <div className="sponsors-top-logos">
              {topLogos.map((sponsor) => (
                <figure key={sponsor.id} className="sponsor-poster-node sponsor-poster-node--top">
                  <div className="sponsor-poster-media">
                    <img
                      src={sponsor.logoUrl || FALLBACK_LOGO}
                      alt={`${sponsor.name || 'Sponsor'} logo`}
                      className="sponsor-poster-logo sponsor-poster-logo--top"
                      onError={(event) => {
                        if (event.currentTarget.dataset.fallbackApplied === 'true') return;
                        event.currentTarget.dataset.fallbackApplied = 'true';
                        event.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>

          {partnerSponsors.length > 0 ? (
            <section className="sponsors-bottom-slot" aria-label="Partners">
              {partnerSponsors.map((sponsor) => (
                <figure key={sponsor.id} className="sponsor-poster-node sponsor-poster-node--bottom">
                  <p className="sponsors-partner-label">{sponsor.tierLabel}</p>

                  <div className="sponsor-poster-media">
                    <img
                      src={sponsor.logoUrl || FALLBACK_LOGO}
                      alt={`${sponsor.name || 'Sponsor'} logo`}
                      className="sponsor-poster-logo sponsor-poster-logo--bottom"
                      onError={(event) => {
                        if (event.currentTarget.dataset.fallbackApplied === 'true') return;
                        event.currentTarget.dataset.fallbackApplied = 'true';
                        event.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  </div>
                </figure>
              ))}
            </section>
          ) : null}
        </section>
      )}
    </main>
  );
}