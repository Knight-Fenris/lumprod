export const DEFAULT_SPONSORS_CONTENT = {
  title: 'Our Sponsors',
  subtitle:
    'Lumiere 2026 is made possible by partners who believe in student cinema, creator communities, and bold storytelling.',
  sponsors: [],
};

const toSafeNumber = (value, fallback = 0) => {
  const next = Number(value);
  if (Number.isNaN(next)) return fallback;
  return next;
};

export const normalizeSponsorRecord = (record) => {
  const rawId = String(record?.id || '').trim();
  const name = String(record?.name || '').trim();
  const fallbackId = name
    ? `sponsor-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
    : `sponsor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: rawId || fallbackId,
    name,
    sectionTitle: String(record?.sectionTitle || record?.tier || '').trim(),
    logoUrl: String(record?.logoUrl || '').trim(),
    websiteUrl: String(record?.websiteUrl || '').trim(),
    order: toSafeNumber(record?.order, toSafeNumber(record?.rank, 0)),
    description: String(record?.description || '').trim(),
    isActive: record?.isActive !== false,
  };
};

export const normalizeSponsorsContent = (content) => {
  const sponsors = Array.isArray(content?.sponsors) ? content.sponsors.map(normalizeSponsorRecord) : [];

  return {
    title: String(content?.title || DEFAULT_SPONSORS_CONTENT.title).trim() || DEFAULT_SPONSORS_CONTENT.title,
    subtitle:
      String(content?.subtitle || DEFAULT_SPONSORS_CONTENT.subtitle).trim() ||
      DEFAULT_SPONSORS_CONTENT.subtitle,
    sponsors,
  };
};

export const sortSponsors = (sponsors) => {
  return [...sponsors].sort((a, b) => {
    const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
    if (orderDiff !== 0) return orderDiff;

    return String(a.name || '').localeCompare(String(b.name || ''));
  });
};