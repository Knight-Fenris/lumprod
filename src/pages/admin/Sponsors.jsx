import { useMemo, useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import {
  DEFAULT_SPONSORS_CONTENT,
  normalizeSponsorRecord,
  normalizeSponsorsContent,
  sortSponsors,
} from '../../config/sponsors';
import { getSponsorsContent, saveSponsorsContent } from '../../services/sponsorService';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminCommon.css';
import './Sponsors.css';

const createDraftSponsor = () => ({
  id: `sponsor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  sectionTitle: '',
  logoUrl: '',
  websiteUrl: '',
  order: 0,
  description: '',
  isActive: true,
});

export default function SponsorsAdmin() {
  const { admin } = useAdmin();
  const [content, setContent] = useState(DEFAULT_SPONSORS_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await getSponsorsContent();
        setContent(payload);
      } catch (error) {
        console.error('Failed to load sponsors content:', error);
        setStatus('Failed to load sponsors content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sponsors = useMemo(() => sortSponsors(content.sponsors || []), [content.sponsors]);

  const updateSponsorField = (id, key, value) => {
    setContent((previous) => ({
      ...previous,
      sponsors: previous.sponsors.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [key]: value };
        return normalizeSponsorRecord(next);
      }),
    }));
  };

  const addSponsor = () => {
    setContent((previous) => ({
      ...previous,
      sponsors: [
        ...previous.sponsors,
        createDraftSponsor(),
      ].map((item, index) => normalizeSponsorRecord({ ...item, order: index })),
    }));
    setStatus('');
  };

  const removeSponsor = (id) => {
    setContent((previous) => ({
      ...previous,
      sponsors: previous.sponsors
        .filter((item) => item.id !== id)
        .map((item, index) => normalizeSponsorRecord({ ...item, order: index })),
    }));
    setStatus('');
  };

  const moveSponsor = (id, direction) => {
    setContent((previous) => {
      const orderedSponsors = sortSponsors(previous.sponsors || []);
      const currentIndex = orderedSponsors.findIndex((item) => item.id === id);
      if (currentIndex < 0) return previous;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= orderedSponsors.length) return previous;

      [orderedSponsors[currentIndex], orderedSponsors[targetIndex]] = [
        orderedSponsors[targetIndex],
        orderedSponsors[currentIndex],
      ];

      const reOrderedSponsors = orderedSponsors.map((item, index) =>
        normalizeSponsorRecord({ ...item, order: index })
      );

      return {
        ...previous,
        sponsors: reOrderedSponsors,
      };
    });
    setStatus('');
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('');

    try {
      const clean = normalizeSponsorsContent({
        ...content,
        sponsors: sortSponsors(content.sponsors)
          .filter((item) => String(item.name || '').trim())
          .map((item, index) => normalizeSponsorRecord({ ...item, order: index })),
      });

      const saved = await saveSponsorsContent(clean, admin?.email || 'admin');
      setContent(saved);
      setStatus('Sponsors page updated successfully.');
    } catch (error) {
      console.error('Failed to save sponsors content:', error);
      setStatus(error?.message || 'Failed to save sponsors content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page">
          <div className="loading">Loading sponsors editor...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-page sponsors-admin-page">
        <div className="admin-header sponsors-admin-head">
          <h1>Sponsors Page</h1>
          <p>Manage sponsor visibility, custom section titles, and display order.</p>
        </div>

        <section className="sponsors-admin-panel">
          <div className="sponsors-admin-grid">
            <label>
              Page Title
              <input
                type="text"
                value={content.title}
                onChange={(event) => setContent((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Our Sponsors"
              />
            </label>
            <label className="wide">
              Subtitle
              <textarea
                value={content.subtitle}
                onChange={(event) => setContent((prev) => ({ ...prev, subtitle: event.target.value }))}
                rows={3}
                placeholder="Short intro text for sponsors page"
              />
            </label>
          </div>

          <div className="sponsors-admin-toolbar">
            <button type="button" className="btn-primary" onClick={addSponsor}>
              + Add Sponsor
            </button>
            <button type="button" className="btn-submit" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {status ? <p className="sponsors-admin-status">{status}</p> : null}
        </section>

        <section className="sponsors-admin-list-wrap">
          {sponsors.length === 0 ? (
            <p className="no-data">No sponsors added yet. Click Add Sponsor to begin.</p>
          ) : (
            <div className="sponsors-admin-list">
              {sponsors.map((sponsor, index) => {

                return (
                <article key={sponsor.id} className="sponsors-admin-item">
                  <div className="sponsors-admin-item-head">
                    <h3>{sponsor.name || 'Untitled Sponsor'}</h3>
                    <div className="sponsors-admin-item-actions">
                      <button
                        type="button"
                        onClick={() => moveSponsor(sponsor.id, 'up')}
                        disabled={index <= 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSponsor(sponsor.id, 'down')}
                        disabled={index >= sponsors.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button type="button" className="danger" onClick={() => removeSponsor(sponsor.id)}>
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="sponsors-admin-item-grid">
                    <label>
                      Sponsor Name
                      <input
                        type="text"
                        value={sponsor.name}
                        onChange={(event) => updateSponsorField(sponsor.id, 'name', event.target.value)}
                        placeholder="Sponsor name"
                      />
                    </label>

                    <label>
                      Section Title
                      <input
                        type="text"
                        value={sponsor.sectionTitle || ''}
                        onChange={(event) => updateSponsorField(sponsor.id, 'sectionTitle', event.target.value)}
                        placeholder="e.g. Title Sponsor, Media Partner"
                      />
                    </label>

                    <label>
                      Logo URL
                      <input
                        type="url"
                        value={sponsor.logoUrl}
                        onChange={(event) => updateSponsorField(sponsor.id, 'logoUrl', event.target.value)}
                        placeholder="https://..."
                      />
                    </label>

                    <label>
                      Website URL
                      <input
                        type="url"
                        value={sponsor.websiteUrl}
                        onChange={(event) => updateSponsorField(sponsor.id, 'websiteUrl', event.target.value)}
                        placeholder="https://..."
                      />
                    </label>

                    <label className="inline-checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(sponsor.isActive)}
                        onChange={(event) => updateSponsorField(sponsor.id, 'isActive', event.target.checked)}
                      />
                      Show on page
                    </label>

                    <label className="wide">
                      Description (optional)
                      <textarea
                        value={sponsor.description}
                        onChange={(event) => updateSponsorField(sponsor.id, 'description', event.target.value)}
                        rows={2}
                        placeholder="Optional short sponsor description"
                      />
                    </label>
                  </div>

                </article>
              );})}
            </div>
          )}
        </section>
      </div>
    </>
  );
}