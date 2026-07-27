'use strict';

const auditService = require('../services/audit.service');

/**
 * Controller to handle page audit requests.
 * Extracts URL parameter, dispatches to audit service, and builds
 * standardized success response conforming exactly to AGENTS.md contract:
 * {
 *   "success": true,
 *   "data": {
 *     "status": 200,
 *     "responseTime": "312ms",
 *     "title": "...",
 *     "metaDescription": "...",
 *     "h1Count": 1,
 *     "imagesWithoutAlt": 2,
 *     "wordCount": 964
 *   }
 * }
 */
const runAudit = async (req, res, next) => {
  try {
    const { url } = req.body || {};

    const rawMetrics = await auditService.auditPage(url);

    // Format & sanitize response payload according to API specification contract
    const formattedData = {
      status: rawMetrics.status || 200,
      responseTime: String(rawMetrics.responseTime || '0ms'),
      title: String(rawMetrics.title || ''),
      metaDescription: String(rawMetrics.metaDescription || ''),
      h1Count: Number(rawMetrics.h1Count) || 0,
      imagesWithoutAlt: Number(rawMetrics.imagesWithoutAlt) || 0,
      wordCount: Number(rawMetrics.wordCount) || 0,
    };

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  runAudit,
};
