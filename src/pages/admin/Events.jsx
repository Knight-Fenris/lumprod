import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminCommon.css';
import './Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { admin } = useAdmin();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  const loadEvents = async () => {
    try {
      const q = query(collection(db, 'lumiere_submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const eventsMap = new Map();

      snapshot.forEach((docSnap) => {
        const submission = docSnap.data();
        const category = submission.categoryName || 'Unknown';
        
        if (!eventsMap.has(category)) {
          eventsMap.set(category, {
            category: category,
            submissions: [],
            totalTeamMembers: 0,
            paymentStats: {
              pending: 0,
              'confirmation-pending': 0,
              verified: 0,
              rejected: 0
            }
          });
        }

        const eventData = eventsMap.get(category);
        eventData.submissions.push({
          id: docSnap.id,
          title: submission.title,
          directorName: submission.directorName,
          directorEmail: submission.directorEmail,
          teamMembers: submission.teamMemberEmails?.filter(e => e.trim()) || [],
          paymentStatus: submission.paymentStatus,
          fee: submission.fee,
          submissionId: submission.submissionId,
          createdAt: submission.createdAt?.toDate?.() || null
        });

        const teamMembers = submission.teamMemberEmails?.filter(email => email.trim()) || [];
        eventData.totalTeamMembers += teamMembers.length + 1; // +1 for director
        eventData.paymentStats[submission.paymentStatus]++;
      });

      const eventsArray = Array.from(eventsMap.values()).sort((a, b) => 
        b.submissions.length - a.submissions.length
      );

      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.category.toLowerCase().includes(term) ||
        event.submissions.some(sub =>
          sub.title?.toLowerCase().includes(term) ||
          sub.directorName?.toLowerCase().includes(term) ||
          sub.directorEmail?.toLowerCase().includes(term)
        )
      );
    }

    setFilteredEvents(filtered);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalSubmissions = () => events.reduce((acc, e) => acc + e.submissions.length, 0);
  const getTotalParticipants = () => events.reduce((acc, e) => acc + e.totalTeamMembers, 0);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page">
          <div className="loading">Loading events...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <div className="admin-header">
          <h1>Events</h1>
          <p>All film categories and submissions</p>
        </div>

        <div className="admin-content">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by event name or film title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Total Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{getTotalSubmissions()}</div>
              <div className="stat-label">Total Submissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{getTotalParticipants()}</div>
              <div className="stat-label">Total Participants</div>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <p>No events found</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event, idx) => (
                <div key={idx} className="event-card">
                  <div className="event-header">
                    <h3>{event.category}</h3>
                    <span className="submission-count">{event.submissions.length}</span>
                  </div>

                  <div className="event-stats">
                    <div className="stat-item">
                      <span className="label">Films</span>
                      <span className="value">{event.submissions.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Participants</span>
                      <span className="value">{event.totalTeamMembers}</span>
                    </div>
                  </div>

                  <div className="payment-breakdown">
                    <div className="status-row status-verified">
                      <span>Verified</span>
                      <span>{event.paymentStats.verified}</span>
                    </div>
                    <div className="status-row status-pending">
                      <span>Pending</span>
                      <span>{event.paymentStats.pending + event.paymentStats['confirmation-pending']}</span>
                    </div>
                    <div className="status-row status-rejected">
                      <span>Rejected</span>
                      <span>{event.paymentStats.rejected}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewEvent(event)}
                    className="btn-view-event"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.category}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <label>Overview</label>
                <div className="overview-stats">
                  <div className="overview-item">
                    <span className="label">Total Submissions</span>
                    <span className="value">{selectedEvent.submissions.length}</span>
                  </div>
                  <div className="overview-item">
                    <span className="label">Total Participants</span>
                    <span className="value">{selectedEvent.totalTeamMembers}</span>
                  </div>
                  <div className="overview-item">
                    <span className="label">Verified</span>
                    <span className="value verified">{selectedEvent.paymentStats.verified}</span>
                  </div>
                  <div className="overview-item">
                    <span className="label">Pending</span>
                    <span className="value pending">{selectedEvent.paymentStats.pending + selectedEvent.paymentStats['confirmation-pending']}</span>
                  </div>
                </div>
              </div>

              <div className="detail-group">
                <label>Submissions in this Category</label>
                <div className="submissions-list">
                  {selectedEvent.submissions.map((sub, idx) => (
                    <div key={idx} className="submission-item">
                      <div className="submission-info">
                        <h4>{sub.title}</h4>
                        <p className="director">Director: {sub.directorName}</p>
                        <p className="email">{sub.directorEmail}</p>
                        {sub.teamMembers.length > 0 && (
                          <p className="team-info">Team Members: {sub.teamMembers.length}</p>
                        )}
                      </div>
                      <div className="submission-meta">
                        <span className={`status-badge status-${sub.paymentStatus}`}>
                          {sub.paymentStatus}
                        </span>
                        <span className="fee">₹{sub.fee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
