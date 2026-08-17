const express = require('express');
const { updateExamResult, syncQuestionClick, saveResult, getUserHistory, getLeaderboard, getDailyTestLeaderboard } = require('../controllers/UserController.js');
const router = express.Router();


// Points & Stats
router.post('/update-results', updateExamResult);
router.post('/sync-click', syncQuestionClick);

// History
router.post('/save-history', saveResult);
router.get('/history/:userId', getUserHistory);

// Leaderboards
router.get('/leaderboard/global', getLeaderboard);
router.get('/leaderboard/timeframe', getDailyTestLeaderboard);

module.exports = router;