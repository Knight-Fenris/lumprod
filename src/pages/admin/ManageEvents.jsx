import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { 
  getAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../../services/eventService';
import { uploadImage } from '../../services/storageService';
import { useAdmin } from '../../contexts/AdminContext';
import './ManageEvents.css';

const CATEGORIES = [
  { id: 'northern-ray', name: 'The Northern Ray', desc: 'Regional Short Film (5-20 min)', fee: 499 },
  { id: 'prism', name: 'Prism Showcase', desc: 'National Student Film (5-15 min)', fee: 599 },
  { id: 'sprint', name: 'Lumiere Sprint', desc: '48-Hour Challenge (3-7 min)', fee: 200 },
  { id: 'vertical', name: 'Vertical Ray', desc: 'Mobile Vertical (60 sec)', fee: 149 },
];

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    eventName: '',
    regFees: '',
    dateTime: '',
    endDateTime: '',
    location: '',
    briefDescription: '',
    image: '',
    pdfLink: '',
    contactInfo: '',
    isTeamEvent: false,
    minTeamMembers: 1,
    maxTeamMembers: 1,
    teamLimit: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { admin } = useAdmin();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.image;

      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'events');
      }

      const eventData = {
        ...formData,
        image: imageUrl,
        regFees: Number(formData.regFees),
        dateTime: new Date(formData.dateTime),
        endDateTime: formData.endDateTime ? new Date(formData.endDateTime) : null,
        minTeamMembers: Number(formData.minTeamMembers),
        maxTeamMembers: Number(formData.maxTeamMembers),
        teamLimit: Number(formData.teamLimit),
        createdBy: admin?.email || ''
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        alert('Event updated successfully!');
      } else {
        await createEvent(eventData);
        alert('Event created successfully!');
      }

      resetForm();
      await loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      category: event.category,
      eventName: event.eventName,
      regFees: event.regFees,
      dateTime: event.dateTime instanceof Date 
        ? event.dateTime.toISOString().slice(0, 16)
        : new Date(event.dateTime).toISOString().slice(0, 16),
      endDateTime: event.endDateTime 
        ? (event.endDateTime instanceof Date 
          ? event.endDateTime.toISOString().slice(0, 16)
          : new Date(event.endDateTime).toISOString().slice(0, 16))
        : '',
      location: event.location,
      briefDescription: event.briefDescription,
      image: event.image,
      pdfLink: event.pdfLink || '',
      contactInfo: event.contactInfo || '',
      isTeamEvent: event.isTeamEvent,
      minTeamMembers: event.minTeamMembers,
      maxTeamMembers: event.maxTeamMembers,
      teamLimit: event.teamLimit || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (event) => {
    if (!confirm(`Delete event "${event.eventName}"?`)) return;

    try {
      await deleteEvent(event.id);
      alert('Event deleted successfully!');
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      eventName: '',
      regFees: '',
      dateTime: '',
      endDateTime: '',
      location: '',
      briefDescription: '',
      image: '',
      pdfLink: '',
      contactInfo: '',
      isTeamEvent: false,
      minTeamMembers: 1,
      maxTeamMembers: 1,
      teamLimit: 0
    });
    setImageFile(null);
    setEditingEvent(null);
    setShowForm(false);
  };

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
          <h1>Manage Events</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Create Event'}
          </button>
        </div>

        {showForm && (
          <div className="event-form-container">
            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} - {cat.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="e.g., Short Film Competition"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Registration Fee (₹) *</label>
                  <input
                    type="number"
                    name="regFees"
                    value={formData.regFees}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Main Auditorium"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date & Time</label>
                  <input
                    type="datetime-local"
                    name="endDateTime"
                    value={formData.endDateTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="briefDescription"
                  value={formData.briefDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Brief description of the event..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Info</label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Email or phone"
                  />
                </div>

                <div className="form-group">
                  <label>PDF Link (Rules)</label>
                  <input
                    type="url"
                    name="pdfLink"
                    value={formData.pdfLink}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && !imageFile && (
                  <div className="current-image">
                    <img src={formData.image} alt="Current" />
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isTeamEvent"
                    checked={formData.isTeamEvent}
                    onChange={handleChange}
                  />
                  <span>This is a team event</span>
                </label>
              </div>

              {formData.isTeamEvent && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Min Team Members</label>
                    <input
                      type="number"
                      name="minTeamMembers"
                      value={formData.minTeamMembers}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Team Members</label>
                    <input
                      type="number"
                      name="maxTeamMembers"
                      value={formData.maxTeamMembers}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Team Limit (0 = unlimited)</label>
                    <input
                      type="number"
                      name="teamLimit"
                      value={formData.teamLimit}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" disabled={submitting} className="btn-submit">
                  {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="events-list">
          <h2>All Events ({events.length})</h2>
          {events.length === 0 ? (
            <p className="no-data">No events yet. Create one above!</p>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card-admin">
                  {event.image && (
                    <div className="event-image">
                      <img src={event.image} alt={event.eventName} />
                    </div>
                  )}
                  <div className="event-content">
                    <h3>{event.eventName}</h3>
                    <p className="event-category">{event.category}</p>
                    <p className="event-fee">₹{event.regFees}</p>
                    <p className="event-date">
                      {event.dateTime instanceof Date
                        ? event.dateTime.toLocaleDateString()
                        : new Date(event.dateTime).toLocaleDateString()}
                    </p>
                    <p className="event-location">{event.location}</p>
                    {event.isTeamEvent && (
                      <p className="event-team">
                        Team Event ({event.minTeamMembers}-{event.maxTeamMembers} members)
                      </p>
                    )}
                  </div>
                  <div className="event-actions">
                    <button onClick={() => handleEdit(event)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
