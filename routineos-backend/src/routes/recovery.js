const express = require('express');
const router = express.Router();
const { getRecoveryStatus, generateRecovery, completeRecovery, getRecoveryHistory } = require('../controllers/recoveryController');
const { authenticate } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.get('/status', getRecoveryStatus);
router.post('/generate', aiRateLimiter, generateRecovery);
router.post('/:id/complete', completeRecovery);
router.get('/history', getRecoveryHistory);

module.exports = router;