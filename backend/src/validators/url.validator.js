'use strict';

const net = require('net');
const dns = require('dns').promises;

const createInvalidUrlError = () => {
  const error = new Error('Please provide a valid HTTP or HTTPS URL.');
  error.code = 'INVALID_URL';
  return error;
};

/**
 * Checks if an IP string is a loopback, private, or link-local address.
 * @param {string} ip 
 * @returns {boolean}
 */
const isPrivateOrLoopbackIp = (ip) => {
  // IPv6 Loopback
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') {
    return true;
  }

  // IPv4 or IPv4-mapped IPv6
  const normalizedIp = ip.replace(/^::ffff:/, '');
  if (net.isIPv4(normalizedIp)) {
    const parts = normalizedIp.split('.').map(Number);
    
    // Loopback (127.0.0.0/8)
    if (parts[0] === 127) {
      return true;
    }
    // 0.0.0.0/8
    if (parts[0] === 0) {
      return true;
    }
    // Private 10.0.0.0/8
    if (parts[0] === 10) {
      return true;
    }
    // Private 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
      return true;
    }
    // Private 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) {
      return true;
    }
    // Link-local 169.254.0.0/16
    if (parts[0] === 169 && parts[1] === 254) {
      return true;
    }
  }

  return false;
};

/**
 * Validation Middleware for Audit URLs.
 * Validates existence, format, protocol (HTTP/HTTPS), and prevents SSRF targeting local/private networks.
 */
const validateUrl = async (req, res, next) => {
  const { url } = req.body || {};

  // 1. Required Verification
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return next(createInvalidUrlError());
  }

  const trimmedUrl = url.trim();

  // 2. Syntax & Protocol Validation using URL constructor
  let parsedUrl;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch (_err) {
    return next(createInvalidUrlError());
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return next(createInvalidUrlError());
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // 3. Hostname Checks (localhost / loopback / direct IP)
  if (hostname === 'localhost' || hostname === '::1' || hostname === '127.0.0.1') {
    return next(createInvalidUrlError());
  }

  if (net.isIP(hostname)) {
    if (isPrivateOrLoopbackIp(hostname)) {
      return next(createInvalidUrlError());
    }
  } else {
    // DNS resolution check to prevent SSRF via domain names resolving to internal IPs
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      for (const addr of addresses) {
        if (isPrivateOrLoopbackIp(addr.address)) {
          return next(createInvalidUrlError());
        }
      }
    } catch (_dnsErr) {
      // Domain lookup failures are handled in subsequent fetch/service layers or returned as invalid URL
      // If DNS resolution fails completely, we pass it down or let service capture target not found.
    }
  }

  return next();
};

module.exports = {
  validateUrl,
  isPrivateOrLoopbackIp,
};
