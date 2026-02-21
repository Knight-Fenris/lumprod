/**
 * Register Service Worker
 * Registers PWA service worker for offline support
 */

export const registerServiceWorker = () => {
  // Temporarily disabled to force fresh content
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Add cache busting query parameter to force fresh sw.js
      const swUrl = `/sw.js?v=${Date.now()}`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error);
      });
  }
};

export default { registerServiceWorker, unregisterServiceWorker };
