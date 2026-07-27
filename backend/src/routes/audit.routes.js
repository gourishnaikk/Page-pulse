'use strict';

const { Router } = require('express');
const { runAudit } = require('../controllers/audit.controller');
const { validateUrl } = require('../validators/url.validator');

const router = Router();

/**
 * POST /api/v1/audit
 */
router.post('/audit', validateUrl, runAudit);

module.exports = router;
