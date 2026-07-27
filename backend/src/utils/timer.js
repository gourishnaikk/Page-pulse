'use strict';

/**
 * Creates a timer to measure latency in milliseconds.
 * @returns {Function} Function that returns elapsed time formatted string (e.g. "312ms")
 */
const startTimer = () => {
  const start = process.hrtime.bigint();
  return () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    return `${Math.round(durationMs)}ms`;
  };
};

module.exports = {
  startTimer,
};
