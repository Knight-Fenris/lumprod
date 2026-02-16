import { ENV } from '../config/env';

/**
 * Performance Monitoring Service
 * Tracks performance metrics and reports issues
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      this.observeNavigation();
      this.observeResources();
      this.observeLongTasks();
      this.observeLayoutShifts();
    }

    // Web Vitals
    this.measureWebVitals();
  }

  /**
   * Observe navigation timing
   */
  observeNavigation() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const timing = {
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          tcp: entry.connectEnd - entry.connectStart,
          ttfb: entry.responseStart - entry.requestStart,
          download: entry.responseEnd - entry.responseStart,
          domInteractive: entry.domInteractive - entry.fetchStart,
          domComplete: entry.domComplete - entry.fetchStart,
          loadComplete: entry.loadEventEnd - entry.fetchStart,
        };

        this.metrics.navigation = timing;

        if (ENV.IS_DEV) {
          console.debug('[Performance] Navigation Timing:', timing);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Navigation timing not supported');
    }
  }

  /**
   * Observe resource timing
   */
  observeResources() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Track very slow resources (>2s)
        if (entry.duration > 2000) {
          if (ENV.IS_DEV) {
            console.debug('[Performance] Slow Resource:', {
              name: entry.name.substring(0, 100),
              duration: Math.round(entry.duration),
              size: entry.transferSize,
            });
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Resource timing not supported');
    }
  }

  /**
   * Observe long tasks
   */
  observeLongTasks() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only log very long tasks (>100ms)
        if (ENV.IS_DEV && entry.duration > 100) {
          console.debug('[Performance] Long Task:', {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Long task monitoring not supported');
    }
  }

  /**
   * Observe layout shifts (CLS)
   */
  observeLayoutShifts() {
    let clsScore = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          this.metrics.cls = clsScore;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Layout shift monitoring not supported');
    }
  }

  /**
   * Measure Core Web Vitals
   */
  measureWebVitals() {
    // LCP - Largest Contentful Paint
    const observeLCP = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;

      if (ENV.IS_DEV) {
        console.debug('[Performance] LCP:', Math.round(this.metrics.lcp));
      }
    });

    try {
      observeLCP.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observeLCP);
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }

    // FID - First Input Delay
    const observeFID = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;

        if (ENV.IS_DEV) {
          console.debug('[Performance] FID:', Math.round(this.metrics.fid));
        }
      });
    });

    try {
      observeFID.observe({ entryTypes: ['first-input'] });
      this.observers.push(observeFID);
    } catch (e) {
      console.warn('FID monitoring not supported');
    }
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Mark a custom timing
   */
  mark(name) {
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  measure(name, startMark, endMark) {
    if ('performance' in window && 'measure' in window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];

        if (ENV.IS_DEV) {
          console.log(`[Performance] ${name}:`, measure.duration, 'ms');
        }

        return measure.duration;
      } catch (e) {
        console.warn('Performance measure failed:', e);
      }
    }
    return null;
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export default new PerformanceMonitor();
