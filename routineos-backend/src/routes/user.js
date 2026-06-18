const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, completeOnboarding, switchMode, deleteAccount } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.post('/onboarding', aiRateLimiter, completeOnboarding);
router.patch('/mode', switchMode);
router.delete('/me', deleteAccount);

module.exports = router;