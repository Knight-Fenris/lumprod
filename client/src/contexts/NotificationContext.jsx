import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Toast from '../components/ui/Toast';

const NotificationContext = createContext(null);

/**
 * Notification Provider
 * Manages global notifications/toasts
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(
    ({ message, type = 'info', duration = 5000, position = 'top-right' }) => {
      const id = Date.now() + Math.random();
      const notification = { id, message, type, duration, position };

      setNotifications((prev) => [...prev, notification]);

      return id;
    },
    []
  );

  const hideNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, options = {}) => {
      return showNotification({ message, type: 'success', ...options });
    },
    [showNotification]
  );

  const error = useCallback(
    (message, options = {}) => {
      return showNotification({ message, type: 'error', ...options });
    },
    [showNotification]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return showNotification({ message, type: 'warning', ...options });
    },
    [showNotification]
  );

  const info = useCallback(
    (message, options = {}) => {
      return showNotification({ message, type: 'info', ...options });
    },
    [showNotification]
  );

  const value = {
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          position={notification.position}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
};

export default NotificationContext;
