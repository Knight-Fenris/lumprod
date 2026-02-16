import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
    
    // Show success message if returning from payment page
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
      window.history.replaceState({}, document.title);
    }
  }, [user, location]);

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching submissions for user:', user.uid);
      const q = query(
        collection(db, 'lumiere_submissions'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      console.log('Submissions found:', snapshot.size);
      const subs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Submission data:', data);
        subs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null
        });
      });
      
      // Sort by createdAt in JavaScript
      subs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA; // descending order
      });
      
      console.log('Final submissions:', subs);
      setSubmissions(subs);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load submissions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      reviewing: 'status-reviewing',
      verified: 'status-verified',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
    };
    return statusClasses[status] || 'status-pending';
  };

  const getPaymentBadge = (paymentStatus) => {
    const statusClasses = {
      pending: 'status-pending',
      'confirmation-pending': 'status-reviewing',
      verified: 'status-verified',
      rejected: 'status-rejected',
    };
    return statusClasses[paymentStatus] || 'status-pending';
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.displayName || 'Filmmaker'}</p>
          </div>
          <Link to="/submit" className="btn btn-primary">
            + New Submission
          </Link>
        </div>

        {successMessage && (
          <div className="success-message" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#10b981',
            fontWeight: 600
          }}>
            ✓ {successMessage}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h2>No Submissions Yet</h2>
            <p>You haven't submitted any films yet. Start by submitting your first film!</p>
            <Link to="/submit" className="btn btn-primary">
              Submit Your Film
            </Link>
          </div>
        ) : (
          <div className="submissions-grid">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <h3 className="submission-title">{submission.title}</h3>
                  <div className="submission-badges">
                    <span className={`status-badge ${getPaymentBadge(submission.paymentStatus)}`}>
                      {submission.paymentStatus === 'verified' ? '✓ Successful Submission' : 
                       submission.paymentStatus === 'rejected' ? '✗ Rejected' :
                       submission.paymentStatus === 'confirmation-pending' ? '⏳ Confirmation Pending' :
                       '⏳ Pending Payment'}
                    </span>
                    {submission.status && submission.status !== 'submitted' && (
                      <span className={`status-badge ${getStatusBadge(submission.status)}`}>
                        {submission.status}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="submission-details">
                  <p><strong>Category:</strong> {submission.categoryName}</p>
                  <p><strong>Duration:</strong> {submission.duration} min</p>
                  <p><strong>Fee:</strong> ₹{submission.fee}</p>
                  <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
                  <p><strong>ID:</strong> {submission.submissionId}</p>
                  {submission.verifiedBy && (
                    <p><strong>Verified by:</strong> {submission.verifiedBy}</p>
                  )}
                  
                  {/* Team Members Section */}
                  <div className="team-members-section">
                    <p><strong>Director:</strong> {submission.directorName}</p>
                    <p className="director-email">{submission.directorEmail}</p>
                    
                    {submission.teamMemberEmails && submission.teamMemberEmails.length > 0 && (
                      <div className="team-members-list">
                        <p><strong>Team Members:</strong></p>
                        <ul>
                          {submission.teamMemberEmails.map((email, index) => (
                            <li key={index}>{email}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="submission-actions">
                  <a 
                    href={submission.filmLink?.startsWith('http') ? submission.filmLink : `https://${submission.filmLink}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    View Film
                  </a>
                  {submission.paymentStatus === 'pending' && (
                    <button 
                      onClick={() => navigate('/payment', { state: { submission } })}
                      className="btn btn-primary btn-sm"
                    >
                      Pay Now
                    </button>
                  )}
                  {submission.paymentStatus === 'verified' && (
                    <div className="verified-actions">
                      <span className="verified-badge">✓ Payment Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
