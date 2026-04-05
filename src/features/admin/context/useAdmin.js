import { useContext } from 'react';
import { AdminContext } from './AdminContextState';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export default useAdmin;
