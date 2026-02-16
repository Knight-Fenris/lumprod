import { useEffect } from 'react';

/**
 * useClickOutside Hook
 * Detects clicks outside of a ref element
 * @param {React.RefObject} ref - Ref to the element
 * @param {Function} handler - Handler function to call on outside click
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
