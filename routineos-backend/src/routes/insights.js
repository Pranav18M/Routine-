const express = require('express');
const router = express.Router();
const { getWeeklyInsights, generateInsight, getChartData } = require('../controllers/insightController');
const { authenticate } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.get('/weekly', getWeeklyInsights);
router.post('/generate', aiRateLimiter, generateInsight);
router.get('/charts', getChartData);

module.exports = router;