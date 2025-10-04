const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getInsights } = require('../controllers/aiController');

// @route   GET api/ai/insights
// @desc    Get AI-powered financial insights
// @access  Private
router.get('/insights', auth, getInsights);

// @route   POST api/ai/chat
// @desc    Chat with the AI assistant
// @access  Private
router.post('/chat', auth, require('../controllers/aiController').chat);


module.exports = router;
