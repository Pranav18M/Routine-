const express = require('express');
const router = express.Router();
const { getBuddy, connectBuddy, removeBuddy, nudgeBuddy, getInviteCode } = require('../controllers/buddyController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getBuddy);
router.get('/invite-code', getInviteCode);
router.post('/connect', connectBuddy);
router.delete('/', removeBuddy);
router.post('/nudge', nudgeBuddy);

module.exports = router;