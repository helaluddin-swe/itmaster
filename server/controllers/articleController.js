const mongoose = require('mongoose');
const BCSArticle = require('../models/BCSArticleModel.js');

// @desc    Create a new article
exports.createArticle = async (req, res) => {
  try {
    const newArticle = new BCSArticle(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "এই স্লাগটি ইতিমধ্যে ব্যবহৃত হয়েছে।" });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all articles with specific selection for list view
exports.getAllArticles = async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};
    if (subject) query["content_header.subject"] = subject;

    const articles = await BCSArticle.find(query)
      .select('seo_metadata content_header createdAt views totalTimeSpent') 
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ভ্যালিড আইডি প্রদান করুন।" });
    }
    const article = await BCSArticle.findById(id);
    if (!article) return res.status(404).json({ message: "আর্টিকেলটি পাওয়া যায়নি।" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর: " + error.message });
  }
};

// @desc    Update Article Views
exports.updateViews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await BCSArticle.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { returnDocument:'after' }
    );
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Error updating views" });
  }
};

// @desc    Track Read Time (Seconds spent by user)
exports.trackReadTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { secondsSpent } = req.body; 

    const article = await BCSArticle.findByIdAndUpdate(
      id,
      { $inc: { totalTimeSpent: secondsSpent } }, 
      { returnDocument:'after' }
    );
    res.status(200).json({ message: "Time tracked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Global Reading Stats for Dashboard
exports.getArticleStats = async (req, res) => {
  try {
    const stats = await BCSArticle.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalSecondsSpent: { $sum: "$totalTimeSpent" },
          totalArticles: { $count: {} }
        }
      }
    ]);
    res.status(200).json(stats[0] || { totalViews: 0, totalSecondsSpent: 0, totalArticles: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an article
exports.updateArticle = async (req, res) => {
  try {
    const updatedArticle = await BCSArticle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    if (!updatedArticle) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await BCSArticle.findByIdAndDelete(req.params.id);
    if (!deletedArticle) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};