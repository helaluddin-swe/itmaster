const express = require('express');
const { getHighlights, saveHighlight, clearHighlights } = require('../controllers/HighlightController.js');

const router = express.Router();

router.get('/:subtopicId', getHighlights);
router.post('/', saveHighlight);
router.delete('/:subtopicId', clearHighlights);

module.exports = router;