import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin, getAdminDetails } from '../services/adminService';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        try {
          // Check if user is admin
          const adminStatus = await isAdmin(user.uid);
          
          if (adminStatus) {
            const adminDetails = await getAdminDetails(user.uid);
            setAdmin(adminDetails);
            setIsAdminUser(true);
          } else {
            setAdmin(null);
            setIsAdminUser(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setAdmin(null);
          setIsAdminUser(false);
        }
      } else {
        setAdmin(null);
        setIsAdminUser(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    admin,
    isAdminUser,
    loading,
    setAdmin,
    setIsAdminUser
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired
};
