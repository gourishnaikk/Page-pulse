'use strict';

const ERROR_STATUS_CODES = {
  INVALID_URL: 400,
  NOT_FOUND: 404,
  UNSUPPORTED_CONTENT: 415,
  TIMEOUT: 504,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_URL: 'Please provide a valid HTTP or HTTPS URL.',
  NOT_FOUND: 'The requested webpage could not be found.',
  UNSUPPORTED_CONTENT: 'The provided URL does not return an HTML document.',
  TIMEOUT: 'The request to the target website timed out.',
  INTERNAL_SERVER_ERROR: 'An unexpected server error occurred.',
};

/**
 * Formats every application error using the Page Pulse error response contract.
 * This middleware must be registered after all routes and other middleware.
 */
const errorHandler = (error, _req, res, _next) => {
  const code = ERROR_STATUS_CODES[error.code] ? error.code : 'INTERNAL_SERVER_ERROR';
  const status = ERROR_STATUS_CODES[code];
  const isProduction = process.env.NODE_ENV === 'production';
  const message = code === 'INTERNAL_SERVER_ERROR' && isProduction
    ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    : error.message || ERROR_MESSAGES[code];

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({
      level: 'error',
      event: 'request_failed',
      code,
      status,
      message,
    }));
  }

  return res.status(status).json({
    success: false,
    code,
    message,
  });
};

module.exports = {
  errorHandler,
};
