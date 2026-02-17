import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import PropTypes from 'prop-types';

export default function AdminProtected({ children }) {
  const { isAdminUser, loading } = useAdmin();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: 'var(--text-primary)'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAdminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

AdminProtected.propTypes = {
  children: PropTypes.node.isRequired
};
