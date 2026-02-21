import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const q = query(collection(db, 'lumiere_submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      let submissions = [];
      let totalRevenue = 0;
      let pendingCount = 0;
      let verifiedCount = 0;

      snapshot.forEach((docSnap) => {
        const submission = docSnap.data();
        submissions.push({
          id: docSnap.id,
          ...submission,
          createdAt: submission.createdAt?.toDate?.() || null,
        });

        if (submission.paymentStatus === 'verified') {
          verifiedCount++;
          totalRevenue += submission.fee || 0;
        } else if (submission.paymentStatus === 'pending' || submission.paymentStatus === 'confirmation-pending') {
          pendingCount++;
        }
      });

      setStats({
        totalUsers: new Set(submissions.map(s => s.directorEmail)).size,
        totalSubmissions: submissions.length,
        pendingRegistrations: pendingCount,
        verifiedRegistrations: verifiedCount,
        totalRevenue: totalRevenue
      });

      setActivities(submissions.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page">
          <div className="loading">Loading dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Overview of Lumiere 2026</p>
        </div>

        <div className="stats-grid">
          <Link to="/admin/registrations" className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
              🎬
            </div>
            <div className="stat-info">
              <h3>{stats?.totalSubmissions || 0}</h3>
              <p>Film Submissions</p>
            </div>
          </Link>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
              ⏳
            </div>
            <div className="stat-info">
              <h3>{stats?.pendingRegistrations || 0}</h3>
              <p>Pending Verification</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              ✓
            </div>
            <div className="stat-info">
              <h3>{stats?.verifiedRegistrations || 0}</h3>
              <p>Verified</p>
            </div>
          </div>

          <div className="stat-card revenue-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              💰
            </div>
            <div className="stat-info">
              <h3>₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="recent-activities">
          <h2>Recent Submissions</h2>
          {activities.length === 0 ? (
            <p className="no-activities">No recent submissions</p>
          ) : (
            <div className="activities-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    🎬
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">
                      <strong>{activity.directorName || activity.userEmail}</strong> submitted{' '}
                      <strong>{activity.title}</strong>
                    </p>
                    <p className="activity-subtitle">
                      {activity.categoryName} • {activity.duration} min • ₹{activity.fee}
                    </p>
                    <p className="activity-time">
                      {activity.timestamp instanceof Date
                        ? activity.timestamp.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
                        : new Date(activity.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                  <div className={`activity-status status-${activity.paymentStatus || 'pending'}`}>
                    {activity.paymentStatus === 'verified' ? '✓ Verified' : 
                     activity.paymentStatus === 'rejected' ? '✗ Rejected' : 
                     '⏳ Pending'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/registrations" className="action-btn">
              📋 View Submissions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
