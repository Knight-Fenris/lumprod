/**
 * Cache Service
 * Manages client-side caching with expiration
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.expirations = new Map();
  }

  /**
   * Set cache item with optional TTL
   */
  set(key, value, ttl = null) {
    this.cache.set(key, value);

    if (ttl) {
      const expiresAt = Date.now() + ttl;
      this.expirations.set(key, expiresAt);

      // Auto-cleanup after TTL
      setTimeout(() => {
        this.delete(key);
      }, ttl);
    }
  }

  /**
   * Get cache item
   */
  get(key) {
    // Check if expired
    if (this.isExpired(key)) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  /**
   * Check if key exists and is not expired
   */
  has(key) {
    if (this.isExpired(key)) {
      this.delete(key);
      return false;
    }
    return this.cache.has(key);
  }

  /**
   * Delete cache item
   */
  delete(key) {
    this.cache.delete(key);
    this.expirations.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.expirations.clear();
  }

  /**
   * Check if key is expired
   */
  isExpired(key) {
    if (!this.expirations.has(key)) return false;
    return Date.now() > this.expirations.get(key);
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get all keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Cache decorator for async functions
   */
  memoize(fn, keyGenerator, ttl = 300000) {
    return async (...args) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

      if (this.has(key)) {
        return this.get(key);
      }

      const result = await fn(...args);
      this.set(key, result, ttl);
      return result;
    };
  }
}

// Export singleton instance
export default new CacheService();
