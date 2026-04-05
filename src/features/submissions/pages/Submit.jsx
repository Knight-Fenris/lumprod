import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { db } from '../../../platform/firebase/client';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { getAllEvents } from '../../../services';
import './Submit.css';

const WORKSHOP_CATEGORY_TOKENS = ['aperture-lab', 'script-shadow', 'splice', 'chroma'];
const FUN_CATEGORY_TOKENS = ['under-the-stars', 'open-mic', 'face-painting', 'photo-walks'];

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');

const inferEventType = (event) => {
  const explicitType = normalize(event.eventType);
  if (explicitType === 'workshop' || explicitType === 'fun') {
    return explicitType;
  }
  if (explicitType.startsWith('compet')) {
    return 'competition';
  }

  const category = normalize(event.category);
  if (WORKSHOP_CATEGORY_TOKENS.some((token) => category.includes(token))) return 'workshop';
  if (FUN_CATEGORY_TOKENS.some((token) => category.includes(token))) return 'fun';
  return 'competition';
};

const generateSubmissionId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0, 4).toUpperCase();
  return `LUM-2026-${timestamp}-${random}`;
};

const isLumiereSprintCategory = (category) => {
  const value = normalize(category);
  return value.includes('lumiere-sprint') || value.includes('lumiere_sprint');
};

export default function Submit() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { state } = useLocation();
  const preselectedCategoryId = String(state?.category?.id || '').trim();
  const preselectedCategoryName = String(state?.category?.name || '').trim();
  const [formData, setFormData] = useState({
    // Film Details
    title: '',
    category: preselectedCategoryId,
    duration: '',
    language: '',
    synopsis: '',
    // Links
    filmLink: '',
    posterLink: '',
    subtitlesLink: '',
    // Team
    directorName: '',
    directorEmail: '',
    directorPhone: '',
    teamMemberEmails: ['', '', '', ''],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [, setSelectedCategoryDetails] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const selectedCategory = categories.find((c) => c.id === formData.category);
  const isLumiereSprint = isLumiereSprintCategory(formData.category) || isLumiereSprintCategory(selectedCategory?.name);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const selected = categories.find((category) => category.id === formData.category) || null;
    setSelectedCategoryDetails(selected);
  }, [categories, formData.category]);

  useEffect(() => {
    if (categories.length === 0) return;

    const hasValidCategory = categories.some((category) => category.id === formData.category);
    if (hasValidCategory) return;

    let matchedCategory = null;

    if (preselectedCategoryId) {
      const normalizedRequestedId = normalize(preselectedCategoryId);
      matchedCategory =
        categories.find((category) => category.id === preselectedCategoryId) ||
        categories.find((category) => normalize(category.id) === normalizedRequestedId) ||
        null;
    }

    if (!matchedCategory && preselectedCategoryName) {
      const normalizedRequestedName = normalize(preselectedCategoryName);
      matchedCategory =
        categories.find((category) => normalize(category.name) === normalizedRequestedName) || null;
    }

    if (matchedCategory) {
      setFormData((prev) => ({ ...prev, category: matchedCategory.id }));
      return;
    }

    if (formData.category) {
      setFormData((prev) => ({ ...prev, category: '' }));
    }
  }, [categories, formData.category, preselectedCategoryId, preselectedCategoryName]);

  const loadCategories = async () => {
    try {
      const events = await getAllEvents({ forceRefresh: true });
      const competitionEvents = events
        .filter((event) => inferEventType(event) === 'competition')
        .map((event) => ({
          id: event.category || event.eventId || event.id,
          name: event.eventName || 'Untitled competition',
          desc: event.briefDescription || event.tagline || 'Competition category',
          fee: Number(event.regFees) || 0,
        }));

      const uniqueEvents = [];
      const seenIds = new Set();
      competitionEvents.forEach((event) => {
        if (seenIds.has(event.id)) return;
        seenIds.add(event.id);
        uniqueEvents.push(event);
      });

      setCategories(uniqueEvents);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('teamMemberEmail-')) {
      const index = parseInt(name.split('-')[1]);
      setFormData(prev => {
        const newEmails = [...prev.teamMemberEmails];
        newEmails[index] = value;
        return { ...prev, teamMemberEmails: newEmails };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (categories.length === 0) {
        setError('No active competition categories are available right now. Please try again later.');
        return false;
      }
      if (!formData.category) {
        setError('Please select a category');
        return false;
      }
      if (!isLumiereSprint && (!formData.title || !formData.duration || !formData.language || !formData.synopsis)) {
        setError('Please fill in all required fields');
        return false;
      }
    } else if (step === 2) {
      if (isLumiereSprint) {
        setError('');
        return true;
      }
      if (!formData.filmLink) {
        setError('Film link is required');
        return false;
      }
      // Basic Google Drive link validation
      if (!formData.filmLink.includes('drive.google.com')) {
        setError('Please provide a valid Google Drive link');
        return false;
      }
    } else if (step === 3) {
      if (!formData.directorName || !formData.directorEmail || !formData.directorPhone) {
        setError('Director information is required');
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 1 && isLumiereSprint) {
        setStep(3);
        return;
      }
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 3 && isLumiereSprint) {
      setStep(1);
      setError('');
      return;
    }
    setStep((prev) => prev - 1);
    setError('');
  };

  const validateUserEmails = async (directorEmail, teamMemberEmails) => {
    try {
      // Collect all emails to validate (director + team members)
      const allEmails = [directorEmail, ...teamMemberEmails.filter(email => email.trim() !== '')];
      
      // Check if each email is registered
      for (const email of allEmails) {
        const usersQuery = query(collection(db, 'users'), where('email', '==', email));
        const snapshot = await getDocs(usersQuery);
        
        if (snapshot.empty) {
          throw new Error(`Email "${email}" is not registered in the system`);
        }
      }
      
      return true;
    } catch (error) {
      throw new Error(error.message || 'Email validation failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    setError('');

    try {
      if (!user) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      // Validate all team member emails and director email
      const validTeamEmails = formData.teamMemberEmails.filter(email => email.trim() !== '');
      await validateUserEmails(formData.directorEmail, validTeamEmails);
      
      const submissionId = generateSubmissionId();
      
      const fee = Number(selectedCategory?.fee) || 0;
      const normalizedSubmissionTitle = isLumiereSprint
        ? 'Lumiere Sprint Team Submission'
        : formData.title;
      const normalizedDuration = isLumiereSprint ? 'Live Event' : formData.duration;
      const normalizedLanguage = isLumiereSprint ? 'N/A' : formData.language;
      const normalizedSynopsis = isLumiereSprint
        ? 'Live competition entry - no pre-submitted film required.'
        : formData.synopsis;
      const normalizedFilmLink = isLumiereSprint ? '' : formData.filmLink;
      const normalizedPosterLink = isLumiereSprint ? '' : (formData.posterLink || '');
      const normalizedSubtitlesLink = isLumiereSprint ? '' : (formData.subtitlesLink || '');
      
      // Save submission with all team information (using lumiere_submissions collection)
      const createdSubmission = await addDoc(collection(db, 'lumiere_submissions'), {
        submissionId,
        userId: user.uid,
        userEmail: user.email,
        
        // Film info
        title: normalizedSubmissionTitle,
        category: formData.category,
        categoryName: selectedCategory?.name || '',
        synopsis: normalizedSynopsis,
        duration: normalizedDuration,
        language: normalizedLanguage,
        
        // Director/Team info
        directorName: formData.directorName,
        directorEmail: formData.directorEmail,
        directorPhone: formData.directorPhone,
        teamMemberEmails: validTeamEmails,
        totalTeamMembers: validTeamEmails.length + 1, // including director
        
        // Links
        filmLink: normalizedFilmLink,
        posterLink: normalizedPosterLink,
        subtitlesLink: normalizedSubtitlesLink,
        
        // Fee - EXPLICITLY ensure it's a number and not 0
        fee,
        
        // Status
        status: 'submitted',
        paymentStatus: 'pending',
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (isLumiereSprint) {
        navigate('/payment', {
          state: {
            submission: {
              id: createdSubmission.id,
              submissionId,
              title: normalizedSubmissionTitle,
              categoryName: selectedCategory?.name || '',
              directorEmail: formData.directorEmail,
              fee,
              paymentStatus: 'pending'
            }
          }
        });
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="submit-page">
        <div className="container submit-shell">
          <div className="success-container">
            <div className="success-icon">Done</div>
            <h1>Submission Received!</h1>
            <p>Your film has been successfully submitted. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingCategories) {
    return (
      <div className="submit-page">
        <div className="container submit-shell">
          <div className="loading">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="container submit-shell">
        <div className="submit-container">
          <h1 className="page-title">Submit Your Film</h1>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Film Details</span>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Upload Links</span>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Team Info</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="submit-form">
            {/* Step 1: Film Details */}
            {step === 1 && (
              <div className="form-step">
                <h2 className="step-title">Film Details</h2>
                {isLumiereSprint ? (
                  <p className="step-description">
                    Lumiere Sprint is a live competition. Film upload details are not required.
                    Continue after selecting the category to enter team details.
                  </p>
                ) : null}
                
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  {categories.length === 0 ? (
                    <div className="error-message">No active competition categories available.</div>
                  ) : null}
                  <select
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={categories.length === 0}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} - {cat.desc} - ₹{cat.fee}
                      </option>
                    ))}
                  </select>
                </div>

                {!isLumiereSprint ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Film Title *</label>
                      <input
                        type="text"
                        name="title"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter your film's title"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Duration (minutes) *</label>
                        <input
                          type="number"
                          name="duration"
                          className="form-input"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="e.g., 15"
                          min="1"
                          max="60"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Primary Language *</label>
                        <input
                          type="text"
                          name="language"
                          className="form-input"
                          value={formData.language}
                          onChange={handleChange}
                          placeholder="e.g., Hindi, English"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Synopsis *</label>
                      <textarea
                        name="synopsis"
                        className="form-input form-textarea"
                        value={formData.synopsis}
                        onChange={handleChange}
                        placeholder="Brief description of your film (100-500 characters)"
                        rows="4"
                        required
                      />
                    </div>
                  </>
                ) : null}

                <div className="form-actions">
                  <button type="button" className="btn btn--primary" onClick={nextStep}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload Links */}
            {step === 2 && !isLumiereSprint && (
              <div className="form-step">
                <h2 className="step-title">Upload Links</h2>
                <p className="step-description">
                  Upload your files to Google Drive and share the links below. 
                  Make sure the links are accessible to anyone with the link.
                </p>
                
                <div className="form-group">
                  <label className="form-label">Film Link (Google Drive) *</label>
                  <input
                    type="url"
                    name="filmLink"
                    className="form-input"
                    value={formData.filmLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <span className="form-hint">MP4 format recommended. Max 4GB.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Poster Image (Google Drive)</label>
                  <input
                    type="url"
                    name="posterLink"
                    className="form-input"
                    value={formData.posterLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <span className="form-hint">JPG/PNG, minimum 1080x1920px</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitles (Google Drive)</label>
                  <input
                    type="url"
                    name="subtitlesLink"
                    className="form-input"
                    value={formData.subtitlesLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <span className="form-hint">SRT format. Required if non-English dialogue.</span>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn--secondary" onClick={prevStep}>
                    Back
                  </button>
                  <button type="button" className="btn btn--primary" onClick={nextStep}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Team Info */}
            {step === 3 && (
              <div className="form-step">
                <h2 className="step-title">Team Information</h2>
                
                <div className="form-group">
                  <label className="form-label">Director Name *</label>
                  <input
                    type="text"
                    name="directorName"
                    className="form-input"
                    value={formData.directorName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Director Email *</label>
                    <input
                      type="email"
                      name="directorEmail"
                      className="form-input"
                      value={formData.directorEmail}
                      onChange={handleChange}
                      placeholder="director@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Director Phone *</label>
                    <input
                      type="tel"
                      name="directorPhone"
                      className="form-input"
                      value={formData.directorPhone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Team Members (Optional)</label>
                  <p className="form-hint" style={{marginBottom: '15px'}}>Add up to 4 team member email addresses</p>
                  {formData.teamMemberEmails.map((email, index) => (
                    <div key={index} className="form-group" style={{marginBottom: '12px'}}>
                      <input
                        type="email"
                        name={`teamMemberEmail-${index}`}
                        className="form-input"
                        value={email}
                        onChange={handleChange}
                        placeholder={`Team member ${index + 1} email (optional)`}
                      />
                    </div>
                  ))}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn--secondary" onClick={prevStep}>
                    Back
                  </button>
                  <button type="submit" className="btn btn--primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Film'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
