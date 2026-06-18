const express = require('express');
const router = express.Router();
const {
  getHabits, createHabit, getHabit, updateHabit,
  deleteHabit, suggestMicro, reorderHabits,
} = require('../controllers/habitController');
const { authenticate } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.get('/', getHabits);
router.post('/', createHabit);
router.patch('/reorder', reorderHabits);
router.get('/:id', getHabit);
router.patch('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/suggest-micro', aiRateLimiter, suggestMicro);

module.exports = router;