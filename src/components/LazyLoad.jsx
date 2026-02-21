import { Suspense } from 'react';
import PropTypes from 'prop-types';
import Spinner from './ui/Spinner';

/**
 * Lazy Load Wrapper
 * Wrapper for lazy-loaded components with suspense fallback
 */
const LazyLoad = ({ children, fallback = null, minHeight = '400px' }) => {
  const defaultFallback = (
    <div
      style={{
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner size="large" label="Loading..." />
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};

LazyLoad.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  minHeight: PropTypes.string,
};

export default LazyLoad;
