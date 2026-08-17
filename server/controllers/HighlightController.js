const Highlight = require("../models/Highlight.js");

// @route   GET /api/v1/highlights/:subtopicId
exports.getHighlights = async (req, res) => {
  try {
    const { subtopicId } = req.params;
    if (!subtopicId || subtopicId === "undefined") {
      return res.status(400).json({ success: false, error: "Valid subtopicId is required." });
    }

    const highlights = await Highlight.find({ subtopicId });
    res.status(200).json({ success: true, data: highlights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Save a new highlight
// @route   POST /api/v1/highlights
exports.saveHighlight = async (req, res) => {
  try {
    const { subtopicId, highlightData } = req.body;

    if (!subtopicId || !highlightData || !highlightData.id) {
      return res.status(400).json({ success: false, error: "Missing required highlight data." });
    }

    const newHighlight = await Highlight.findOneAndUpdate(
      {
        subtopicId,
        id: highlightData.id
      },
      {
        subtopicId,
        id: highlightData.id,
        startMeta: highlightData.startMeta,
        endMeta: highlightData.endMeta,
        text: highlightData.text,
        extra: highlightData.extra
      },
      {
        upsert: true,
        new: true
      }
    );

    // Note: findOneAndUpdate already saves the document. Calling .save() here was redundant.
    res.status(201).json({ success: true, data: newHighlight });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Clear all highlights for a specific subtopic
// @route   DELETE /api/v1/highlights/:subtopicId
exports.clearHighlights = async (req, res) => {
  try {
    const { subtopicId } = req.params;
    if (!subtopicId || subtopicId === "undefined") {
      return res.status(400).json({ success: false, error: "Valid subtopicId is required." });
    }

    await Highlight.deleteMany({ subtopicId });
    res.status(200).json({ success: true, message: 'Highlights cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};