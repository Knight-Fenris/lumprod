import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { submitWorkshopApplication } from '../services';
import { getAllEvents } from '../services';
import './WorkshopSubmit.css';

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');

const WORKSHOP_CATEGORY_TOKENS = ['aperture-lab', 'script-shadow', 'splice', 'chroma'];

const inferEventType = (event) => {
  const explicitType = normalize(event.eventType);
  if (explicitType === 'workshop') return 'workshop';

  const category = normalize(event.category);
  if (WORKSHOP_CATEGORY_TOKENS.some((token) => category.includes(token))) return 'workshop';
  return 'other';
};

export default function WorkshopSubmit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();

  const initialWorkshop = state?.workshop;
  const [workshopOptions, setWorkshopOptions] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(initialWorkshop?.id || '');
  const [formData, setFormData] = useState({
    applicantName: user?.displayName || '',
    applicantPhone: '',
    experience: 'Beginner',
    motivation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadWorkshopOptions = async () => {
      try {
        const events = await getAllEvents({ forceRefresh: true });
        const workshops = events
          .filter((event) => inferEventType(event) === 'workshop')
          .map((event) => ({
            id: event.category || event.eventId || event.id,
            name: event.eventName || 'Untitled Workshop',
            type: event.tagline || 'Workshop',
          }));

        const uniqueWorkshops = [];
        const seenIds = new Set();
        workshops.forEach((workshop) => {
          if (seenIds.has(workshop.id)) return;
          seenIds.add(workshop.id);
          uniqueWorkshops.push(workshop);
        });

        setWorkshopOptions(uniqueWorkshops);

        if (!selectedWorkshopId && uniqueWorkshops.length > 0) {
          setSelectedWorkshopId(uniqueWorkshops[0].id);
        }
      } catch (workshopError) {
        console.error('Error loading workshops:', workshopError);
        setWorkshopOptions([]);
      } finally {
        setLoadingWorkshops(false);
      }
    };

    loadWorkshopOptions();
  }, []);

  const selectedWorkshop = useMemo(() => {
    if (!selectedWorkshopId) return null;
    return workshopOptions.find((item) => item.id === selectedWorkshopId) || null;
  }, [selectedWorkshopId, workshopOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedWorkshop) {
      setError('Please select a workshop.');
      return;
    }

    if (!formData.applicantName.trim() || !formData.applicantPhone.trim() || !formData.motivation.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitWorkshopApplication({
        user,
        workshop: selectedWorkshop,
        applicantName: formData.applicantName,
        applicantPhone: formData.applicantPhone,
        experience: formData.experience,
        motivation: formData.motivation,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', {
          state: { message: 'Workshop submission received. No payment is required.' },
        });
      }, 1800);
    } catch (submissionError) {
      setError(submissionError.message || 'Failed to submit workshop application.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="workshop-submit-page">
        <div className="container workshop-submit-shell">
          <div className="workshop-success-card">
            <div className="workshop-success-icon">Done</div>
            <h1>Workshop Submission Received</h1>
            <p>Your workshop seat request is submitted successfully.</p>
            <p className="workshop-success-note">This workshop is free of cost. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingWorkshops) {
    return (
      <div className="workshop-submit-page">
        <div className="container workshop-submit-shell">
          <div className="workshop-submit-card">
            <div className="loading">Loading workshops...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workshop-submit-page">
      <div className="container workshop-submit-shell">
        <div className="workshop-submit-card">
          <div className="workshop-submit-head">
            <p className="workshop-eyebrow">Lumiere Workshops</p>
            <h1>Workshop Submission</h1>
            <p>Reserve your place in a guided session. Workshops are free for all registered participants.</p>
          </div>

          <div className="workshop-free-pill" aria-live="polite">Free of Cost</div>

          {error && <div className="workshop-error">{error}</div>}

          <form onSubmit={handleSubmit} className="workshop-form">
            <div className="workshop-form-group">
              <label htmlFor="workshop-select" className="workshop-label">Workshop *</label>
              <select
                id="workshop-select"
                className="workshop-input"
                value={selectedWorkshopId}
                onChange={(event) => setSelectedWorkshopId(event.target.value)}
                required
                disabled={workshopOptions.length === 0}
              >
                <option value="">Select a workshop</option>
                {workshopOptions.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.name} ({workshop.type})
                  </option>
                ))}
              </select>
              {workshopOptions.length === 0 ? (
                <p className="workshop-empty-note">No active workshops are available right now.</p>
              ) : null}
            </div>

            <div className="workshop-form-row">
              <div className="workshop-form-group">
                <label htmlFor="applicantName" className="workshop-label">Applicant Name *</label>
                <input
                  id="applicantName"
                  type="text"
                  name="applicantName"
                  className="workshop-input"
                  value={formData.applicantName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="workshop-form-group">
                <label htmlFor="applicantPhone" className="workshop-label">Phone Number *</label>
                <input
                  id="applicantPhone"
                  type="tel"
                  name="applicantPhone"
                  className="workshop-input"
                  value={formData.applicantPhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            <div className="workshop-form-group">
              <label htmlFor="experience" className="workshop-label">Experience Level *</label>
              <select
                id="experience"
                name="experience"
                className="workshop-input"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="workshop-form-group">
              <label htmlFor="motivation" className="workshop-label">Why do you want to join? *</label>
              <textarea
                id="motivation"
                name="motivation"
                className="workshop-input workshop-textarea"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Tell us what you want to learn from this workshop"
                rows={4}
                required
              />
            </div>

            <div className="workshop-actions">
              <button type="button" className="workshop-btn workshop-btn-ghost" onClick={() => navigate('/categories')}>
                Back
              </button>
              <button type="submit" className="workshop-btn workshop-btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Workshop Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
