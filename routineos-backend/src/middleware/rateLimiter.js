const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter — 200 requests per 15 minutes per IP
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  skip: (req) => req.path === '/health',
});

/**
 * Strict rate limiter for AI endpoints — 30 requests per hour per IP
 */
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please try again in an hour.',
  },
});

/**
 * Auth rate limiter — 10 attempts per 15 minutes
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes.',
  },
});

module.exports = { globalRateLimiter, aiRateLimiter, authRateLimiter };