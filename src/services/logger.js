import { ENV } from '../config/env';

/**
 * Logger Service
 * Centralized logging with different levels
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

class Logger {
  constructor() {
    this.level = ENV.IS_DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
    this.logs = [];
    this.maxLogs = 100; // Keep last 100 logs
  }

  /**
   * Set log level
   */
  setLevel(level) {
    this.level = level;
  }

  /**
   * Add log to buffer
   */
  addLog(level, message, data) {
    const log = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(log);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    return log;
  }

  /**
   * Debug log
   */
  debug(message, data) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`, data || '');
      this.addLog('DEBUG', message, data);
    }
  }

  /**
   * Info log
   */
  info(message, data) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, data || '');
      this.addLog('INFO', message, data);
    }
  }

  /**
   * Warning log
   */
  warn(message, data) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, data || '');
      this.addLog('WARN', message, data);
    }
  }

  /**
   * Error log
   */
  error(message, error) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, error || '');
      this.addLog('ERROR', message, {
        message: error?.message,
        stack: error?.stack,
      });
    }

    // In production, you would send errors to a service
    // errorReportingService.captureException(error);
  }

  /**
   * Get all logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Download logs as JSON
   */
  downloadLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export default new Logger();
