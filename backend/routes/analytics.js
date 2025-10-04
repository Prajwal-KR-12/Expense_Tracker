const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSummary } = require('../controllers/analyticsController');

// @route   GET api/analytics/summary
// @desc    Get financial summary
// @access  Private
router.get('/summary', auth, getSummary);

// @route   GET api/analytics/monthly-summary
// @desc    Get monthly summary data
// @access  Private
router.get('/monthly-summary', auth, require('../controllers/analyticsController').getMonthlySummary);


module.exports = router;
