import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../components/ui/Spinner';

const LoadingContext = createContext(null);

/**
 * Loading Provider
 * Manages global loading states
 */
export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState(new Map());

  const startLoading = useCallback((key = 'global', label = 'Loading...') => {
    setLoadingStates((prev) => {
      const next = new Map(prev);
      next.set(key, { active: true, label });
      return next;
    });
  }, []);

  const stopLoading = useCallback((key = 'global') => {
    setLoadingStates((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isLoading = useCallback(
    (key = 'global') => {
      return loadingStates.has(key) && loadingStates.get(key)?.active === true;
    },
    [loadingStates]
  );

  const value = {
    startLoading,
    stopLoading,
    isLoading,
  };

  // Show global overlay spinner if global loading is active
  const globalLoading = loadingStates.get('global');
  const showGlobalSpinner = globalLoading?.active === true;

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {showGlobalSpinner && (
        <Spinner
          variant="overlay"
          size="large"
          label={globalLoading.label || 'Loading...'}
        />
      )}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use loading context
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }

  return context;
};

export default LoadingContext;
