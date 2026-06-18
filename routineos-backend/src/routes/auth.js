const express = require('express');
const router = express.Router();
const { signup, login, refreshToken, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authRateLimiter, signup);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);

module.exports = router;