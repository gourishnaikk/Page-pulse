'use strict';

const axios = require('axios');
const { startTimer } = require('../utils/timer');
const { parseHtml } = require('../utils/parser');

const getTargetHost = (url) => {
  try {
    return new URL(url).hostname;
  } catch (_error) {
    return 'unknown';
  }
};

const logAuditEvent = (level, event, details) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  // eslint-disable-next-line no-console
  console[level](JSON.stringify({ level, event, ...details }));
};

class AuditService {
  constructor() {
    this.client = axios.create({
      timeout: 10000, // 10 seconds timeout
      headers: {
        'User-Agent': 'PagePulse/1.0 (+https://pagepulse.app)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
    });
  }

  /**
   * Fetches remote webpage HTML and computes latency.
   * @param {string} url - Target URL
   * @returns {Promise<Object>} Object containing status, responseTime, html content, and targetUrl
   */
  async auditPage(url) {
    const elapsed = startTimer();
    const targetHost = getTargetHost(url);

    logAuditEvent('info', 'audit_started', { targetHost });

    try {
      const response = await this.client.get(url, {
        responseType: 'text',
      });

      const responseTime = elapsed();
      const contentType = response.headers['content-type'] || '';

      // Content-Type validation: must contain text/html
      if (!contentType.toLowerCase().includes('text/html')) {
        const error = new Error('The provided URL does not return an HTML document.');
        error.code = 'UNSUPPORTED_CONTENT';
        error.status = 415;
        throw error;
      }

      const html = response.data;
      const status = response.status;

      // Extract SEO and accessibility metrics using Cheerio parser
      const metrics = parseHtml(html);

      logAuditEvent('info', 'audit_completed', {
        targetHost,
        status,
        responseTime,
      });

      return {
        status,
        responseTime,
        ...metrics,
      };
    } catch (error) {
      let applicationError;

      // Re-throw custom unsupported content error
      if (error.code === 'UNSUPPORTED_CONTENT') {
        applicationError = error;
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Handle Axios timeouts (ECONNABORTED or ETIMEDOUT)
        const timeoutError = new Error('The request to the target website timed out.');
        timeoutError.code = 'TIMEOUT';
        timeoutError.status = 504;
        applicationError = timeoutError;
      } else if (error.response) {
        // Handle HTTP status rejections
        if (error.response.status === 404) {
          const notFoundError = new Error('The requested webpage could not be found.');
          notFoundError.code = 'NOT_FOUND';
          notFoundError.status = 404;
          applicationError = notFoundError;
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        // Handle DNS failures
        const notFoundError = new Error('The requested webpage could not be found.');
        notFoundError.code = 'NOT_FOUND';
        notFoundError.status = 404;
        applicationError = notFoundError;
      }

      if (!applicationError) {
        // Default network/server error fallback
        const internalError = new Error(error.message || 'An unexpected error occurred.');
        internalError.code = error.code || 'INTERNAL_SERVER_ERROR';
        internalError.status = error.status || 500;
        applicationError = internalError;
      }

      logAuditEvent('error', 'audit_failed', {
        targetHost,
        code: applicationError.code || 'INTERNAL_SERVER_ERROR',
        message: applicationError.message,
      });

      throw applicationError;
    }
  }
}

module.exports = new AuditService();
