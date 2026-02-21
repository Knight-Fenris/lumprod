import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { 
  generateUniqueDiscountCode,
  getAllDiscounts,
  getDiscountStats
} from '../../services/discountService';
import { useAdmin } from '../../contexts/AdminContext';
import './Discounts.css';

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    userEmail: '',
    discountType: 'FLAT',
    discountValue: '',
    eventId: '',
    eventName: '',
    expiryDate: '',
    maxUsage: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, expired, used
  const { admin } = useAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [discountsData, statsData] = await Promise.all([
        getAllDiscounts(),
        getDiscountStats()
      ]);
      setDiscounts(discountsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading discounts:', error);
      alert('Failed to load discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const discountData = {
        userId: formData.userId || null,
        userEmail: formData.userEmail || null,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        eventId: formData.eventId || null,
        eventName: formData.eventName || null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        maxUsage: Number(formData.maxUsage),
        createdBy: admin?.email || 'admin'
      };

      await generateUniqueDiscountCode(discountData);
      alert('Discount code created successfully!');
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error creating discount:', error);
      alert(error.message || 'Failed to create discount code');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      userEmail: '',
      discountType: 'FLAT',
      discountValue: '',
      eventId: '',
      eventName: '',
      expiryDate: '',
      maxUsage: 1
    });
    setShowForm(false);
  };

  const getFilteredDiscounts = () => {
    const now = new Date();
    
    switch(filter) {
      case 'active':
        return discounts.filter(d => 
          !d.isUsed && (!d.expiryDate || new Date(d.expiryDate) > now)
        );
      case 'expired':
        return discounts.filter(d => 
          d.expiryDate && new Date(d.expiryDate) <= now
        );
      case 'used':
        return discounts.filter(d => d.isUsed);
      default:
        return discounts;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No expiry';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString();
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) <= new Date();
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page">
          <div className="loading">Loading discounts...</div>
        </div>
      </>
    );
  }

  const filteredDiscounts = getFilteredDiscounts();

  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <div className="admin-header">
          <h1>Discount Codes</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Generate Code'}
          </button>
        </div>

        {stats && (
          <div className="discount-stats">
            <div className="stat-card">
              <h3>{stats.totalCodes}</h3>
              <p>Total Codes</p>
            </div>
            <div className="stat-card">
              <h3>{stats.activeCodes}</h3>
              <p>Active</p>
            </div>
            <div className="stat-card">
              <h3>{stats.usedCodes}</h3>
              <p>Used</p>
            </div>
            <div className="stat-card">
              <h3>{stats.expiredCodes}</h3>
              <p>Expired</p>
            </div>
            <div className="stat-card highlight">
              <h3>₹{stats.totalDiscount.toLocaleString()}</h3>
              <p>Total Discount Given</p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="discount-form-container">
            <h2>Generate New Discount Code</h2>
            <form onSubmit={handleSubmit} className="discount-form">
              <div className="form-row">
                <div className="form-group">
                  <label>User ID (optional)</label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    placeholder="Leave empty for public code"
                  />
                  <small>Restrict code to specific user</small>
                </div>

                <div className="form-group">
                  <label>User Email (optional)</label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select 
                    name="discountType" 
                    value={formData.discountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="0"
                    max={formData.discountType === 'PERCENTAGE' ? 100 : undefined}
                    required
                  />
                  <small>
                    {formData.discountType === 'FLAT' 
                      ? 'Amount in rupees' 
                      : 'Percentage (0-100)'}
                  </small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event ID (optional)</label>
                  <input
                    type="text"
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleChange}
                    placeholder="Leave empty for all events"
                  />
                  <small>Restrict to specific event</small>
                </div>

                <div className="form-group">
                  <label>Event Name (optional)</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="e.g., Northern Ray"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date (optional)</label>
                  <input
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                  <small>Leave empty for no expiry</small>
                </div>

                <div className="form-group">
                  <label>Max Usage *</label>
                  <input
                    type="number"
                    name="maxUsage"
                    value={formData.maxUsage}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  <small>How many times can be used</small>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={submitting} className="btn-submit">
                  {submitting ? 'Generating...' : 'Generate Code'}
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="discounts-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({discounts.length})
            </button>
            <button 
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={filter === 'used' ? 'active' : ''}
              onClick={() => setFilter('used')}
            >
              Used
            </button>
            <button 
              className={filter === 'expired' ? 'active' : ''}
              onClick={() => setFilter('expired')}
            >
              Expired
            </button>
          </div>
        </div>

        <div className="discounts-list">
          {filteredDiscounts.length === 0 ? (
            <p className="no-data">No discount codes found</p>
          ) : (
            <div className="discounts-table">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>User</th>
                    <th>Event</th>
                    <th>Usage</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDiscounts.map(discount => (
                    <tr key={discount.id}>
                      <td className="code-cell">
                        <span className="discount-code">{discount.code}</span>
                      </td>
                      <td>{discount.discountType}</td>
                      <td className="value-cell">
                        {discount.discountType === 'FLAT' 
                          ? `₹${discount.discountValue}` 
                          : `${discount.discountValue}%`}
                      </td>
                      <td>{discount.userEmail || 'Public'}</td>
                      <td>{discount.eventName || 'All Events'}</td>
                      <td>
                        {discount.usageCount || 0}/{discount.maxUsage}
                      </td>
                      <td className={isExpired(discount.expiryDate) ? 'expired-date' : ''}>
                        {formatDate(discount.expiryDate)}
                      </td>
                      <td>
                        {discount.isUsed ? (
                          <span className="status-badge used">Used</span>
                        ) : isExpired(discount.expiryDate) ? (
                          <span className="status-badge expired">Expired</span>
                        ) : (
                          <span className="status-badge active">Active</span>
                        )}
                      </td>
                      <td>
                        {discount.createdAt && formatDate(discount.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
