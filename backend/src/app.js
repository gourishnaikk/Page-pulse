const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');
const auditRoutes = require('./routes/audit.routes');

const app = express();

const logRequest = (req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.info(JSON.stringify({
      level: 'info',
      event: 'request_received',
      method: req.method,
      path: req.originalUrl,
    }));
  }

  next();
};

// --- Global Middleware ---

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logRequest);

// --- Routes ---
app.use('/api/v1', auditRoutes);

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Error Handling ---
// Must be mounted after all routes so forwarded errors reach one response formatter.
app.use(errorHandler);

module.exports = app;
