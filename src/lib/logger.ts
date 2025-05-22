/**
 * Permisoria Logger Utility
 * 
 * A centralized logging utility that can be configured to redirect logs
 * to different destinations based on the environment.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  source?: string;
}

class Logger {
  private enabledInProduction: boolean = false;
  private isProduction: boolean = process.env.NODE_ENV === 'production';

  /**
   * Log a debug message
   * These logs are suppressed in production by default
   */
  debug(message: string, context?: Record<string, any>, source?: string): void {
    this.log('debug', message, context, source);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>, source?: string): void {
    this.log('info', message, context, source);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>, source?: string): void {
    this.log('warn', message, context, source);
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, any>, source?: string): void {
    this.log('error', message, context, source);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, source?: string): void {
    // Skip debug logs in production unless explicitly enabled
    if (level === 'debug' && this.isProduction && !this.enabledInProduction) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
      context
    };

    // In production, we might want to send logs to a service like Sentry or LogRocket
    // For now, we'll just use console with appropriate log levels
    if (this.isProduction) {
      this.logToProduction(entry);
    } else {
      this.logToDevelopment(entry);
    }
  }

  /**
   * Log to production services
   */
  private logToProduction(entry: LogEntry): void {
    // In the future, integrate with external logging services
    // For now, still use console but with minimal output
    
    switch (entry.level) {
      case 'debug':
        console.debug(`[${entry.timestamp}] ${entry.message}`);
        break;
      case 'info':
        console.info(`[${entry.timestamp}] ${entry.message}`);
        break;
      case 'warn':
        console.warn(`[${entry.timestamp}] ${entry.message}`);
        break;
      case 'error':
        console.error(`[${entry.timestamp}] ${entry.message}`, entry.context || '');
        break;
    }
  }

  /**
   * Log to development console with formatting
   */
  private logToDevelopment(entry: LogEntry): void {
    const sourceInfo = entry.source ? ` [${entry.source}]` : '';
    
    switch (entry.level) {
      case 'debug':
        console.debug(
          `%c[DEBUG]${sourceInfo}%c ${entry.message}`,
          'color: #6c757d', 'color: #6c757d; font-weight: normal',
          entry.context || ''
        );
        break;
      case 'info':
        console.info(
          `%c[INFO]${sourceInfo}%c ${entry.message}`,
          'color: #0d6efd', 'color: inherit; font-weight: normal',
          entry.context || ''
        );
        break;
      case 'warn':
        console.warn(
          `%c[WARN]${sourceInfo}%c ${entry.message}`,
          'color: #fd7e14', 'color: inherit; font-weight: normal',
          entry.context || ''
        );
        break;
      case 'error':
        console.error(
          `%c[ERROR]${sourceInfo}%c ${entry.message}`,
          'color: #dc3545', 'color: inherit; font-weight: normal',
          entry.context || ''
        );
        break;
    }
  }

  /**
   * Enable debug logs in production
   */
  enableProductionDebugLogs(): void {
    this.enabledInProduction = true;
  }

  /**
   * Disable debug logs in production
   */
  disableProductionDebugLogs(): void {
    this.enabledInProduction = false;
  }
}

// Export a singleton instance
export const logger = new Logger();

// For convenience, also export individual methods
export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger); 