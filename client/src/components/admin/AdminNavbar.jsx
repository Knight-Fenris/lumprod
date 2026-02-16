import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminLogout } from '../../services/adminService';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminNavbar.css';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, setAdmin, setIsAdminUser } = useAdmin();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      setAdmin(null);
      setIsAdminUser(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <div className="admin-nav-brand">
          <Link to="/admin">
            <h2>🎬 Lumiere Admin</h2>
          </Link>
        </div>

        <div className="admin-nav-links">
          <Link to="/admin" className={isActive('/admin')}>
            📊 Dashboard
          </Link>
          <Link to="/admin/registrations" className={isActive('/admin/registrations')}>
            🎬 Submissions
          </Link>
          <Link to="/admin/submission-events" className={isActive('/admin/submission-events')}>
            🎪 Events
          </Link>
        </div>

        <div className="admin-nav-user">
          <span className="admin-email">{admin?.email || 'Admin'}</span>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
