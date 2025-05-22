import { logger } from '../logger';

describe('Logger Utility', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it('logs info messages', () => {
    logger.info('Test info message');
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains INFO text
    expect(consoleInfoSpy.mock.calls[0][0]).toContain('[INFO]');
    // Verify message is in the first argument
    expect(consoleInfoSpy.mock.calls[0][0]).toContain('Test info message');
  });

  it('logs warning messages', () => {
    logger.warn('Test warning message');
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains WARN text
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
    // Verify message is in the first argument
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('Test warning message');
  });

  it('logs error messages', () => {
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains ERROR text
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
    // Verify message is in the first argument
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error message');
  });

  it('logs debug messages', () => {
    logger.debug('Test debug message');
    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains DEBUG text
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
    // Verify message is in the first argument
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('Test debug message');
  });

  it('logs messages with context', () => {
    const context = { userId: '123', action: 'login' };
    logger.info('Test message with context', context);
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    // Verify context object is passed as a later argument
    expect(consoleInfoSpy.mock.calls[0][3]).toEqual(context);
  });

  it('logs messages with source', () => {
    logger.info('Test message with source', undefined, 'AuthService');
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains the source
    expect(consoleInfoSpy.mock.calls[0][0]).toContain('[AuthService]');
    // Verify message is in the first argument
    expect(consoleInfoSpy.mock.calls[0][0]).toContain('Test message with source');
  });

  it('logs errors with Error objects', () => {
    const testError = new Error('Test error object');
    logger.error('Error occurred', testError);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains ERROR text
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
    // Verify message is in the first argument
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('Error occurred');
    // Verify error object is passed as a later argument
    expect(consoleErrorSpy.mock.calls[0][3]).toEqual(testError);
  });

  it('handles both context and source together', () => {
    const context = { status: 404, path: '/users' };
    logger.warn(
      'Test message with both context and source',
      context,
      'APIService'
    );
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    // Verify first argument contains both WARN and source
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('[APIService]');
    // Verify context object is passed as a later argument
    expect(consoleWarnSpy.mock.calls[0][3]).toEqual(context);
  });
}); 