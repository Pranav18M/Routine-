const express = require('express');
const router = express.Router();
const { getTodayLogs, getLogs, logHabit, bulkLogHabits, getLogStats } = require('../controllers/logController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/today', getTodayLogs);
router.get('/stats', getLogStats);
router.get('/', getLogs);
router.post('/', logHabit);
router.post('/bulk', bulkLogHabits);

module.exports = router;