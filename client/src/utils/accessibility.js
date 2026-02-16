/**
 * Accessibility Utilities
 * Helper functions for accessibility features
 */

/**
 * Skip to main content link
 * Call this on page load to add skip link
 */
export const addSkipLink = () => {
  const skipLink = document.getElementById('skip-to-main');
  if (skipLink) return; // Already exists

  const link = document.createElement('a');
  link.id = 'skip-to-main';
  link.href = '#main-content';
  link.className = 'skip-link';
  link.textContent = 'Skip to main content';
  link.style.cssText = `
    position: absolute;
    top: -100px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    z-index: 10001;
    border: 2px solid #fff;
  `;

  link.addEventListener('focus', () => {
    link.style.top = '0';
  });

  link.addEventListener('blur', () => {
    link.style.top = '-100px';
  });

  document.body.insertBefore(link, document.body.firstChild);
};

/**
 * Trap focus within a container
 * Useful for modals and dialogs
 */
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Announce to screen readers
 * Uses aria-live region to announce messages
 */
export const announce = (message, priority = 'polite') => {
  let announcer = document.getElementById('aria-announcer');

  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'aria-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(announcer);
  }

  // Clear and set new message
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
};

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user prefers dark mode
 */
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Get WCAG contrast ratio between two colors
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g).map(Number);
    const [r, g, b] = rgb.map((val) => {
      const sRGB = val / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

export default {
  addSkipLink,
  trapFocus,
  announce,
  prefersReducedMotion,
  prefersDarkMode,
  getContrastRatio,
};
