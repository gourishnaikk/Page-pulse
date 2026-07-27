require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`[Page Pulse] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  }
});
