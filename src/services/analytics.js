import { ENV } from '../config/env';

/**
 * Analytics Service
 * Handles user analytics and event tracking
 */

class Analytics {
  constructor() {
    this.initialized = false;
    this.queue = [];
  }

  /**
   * Initialize analytics
   */
  init() {
    if (this.initialized) return;
    
    // Check if analytics is enabled and configured
    if (!ENV?.ANALYTICS?.ENABLED || !ENV?.ANALYTICS?.GA_ID) {
      if (ENV?.IS_DEV) {
        console.log('[Analytics] Disabled or not configured');
      }
      return;
    }

    // Initialize Google Analytics if ID is provided
    if (ENV.ANALYTICS.GA_ID) {
      this.initGoogleAnalytics();
    }

    this.initialized = true;

    // Process queued events
    this.queue.forEach((event) => this.trackEvent(event));
    this.queue = [];
  }

  /**
   * Initialize Google Analytics
   */
  initGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ENV.ANALYTICS.GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ENV.ANALYTICS.GA_ID, {
      send_page_view: false, // We'll handle page views manually
    });
  }

  /**
   * Track page view
   */
  trackPageView(path, title) {
    if (!this.initialized) {
      this.queue.push({ type: 'pageview', path, title });
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }

    // Log in development
    if (ENV.IS_DEV) {
      console.log('[Analytics] Page View:', { path, title });
    }
  }

  /**
   * Track custom event
   */
  trackEvent({ category, action, label, value }) {
    if (!this.initialized) {
      this.queue.push({ type: 'event', category, action, label, value });
      return;
    }

    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Log in development
    if (ENV.IS_DEV) {
      console.log('[Analytics] Event:', { category, action, label, value });
    }
  }

  /**
   * Track user timing
   */
  trackTiming(category, variable, value, label) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category,
        event_label: label,
      });
    }

    // Log in development
    if (ENV.IS_DEV) {
      console.log('[Analytics] Timing:', { category, variable, value, label });
    }
  }

  /**
   * Track exception
   */
  trackException(description, fatal = false) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: description,
        fatal: fatal,
      });
    }

    // Log in development
    if (ENV.IS_DEV) {
      console.log('[Analytics] Exception:', { description, fatal });
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }

    // Log in development
    if (ENV.IS_DEV) {
      console.log('[Analytics] User Properties:', properties);
    }
  }

  /**
   * Identify user
   */
  identifyUser(userId) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('config', ENV.ANALYTICS.GA_ID, {
        user_id: userId,
      });
    }

    // Log in development
    if (ENV.IS_DEV) {
      console.log('[Analytics] Identify User:', userId);
    }
  }
}

// Export singleton instance
export default new Analytics();
