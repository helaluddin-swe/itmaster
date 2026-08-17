const User = require("../models/AuthModel.js");
const History = require("../models/historySchemaModel.js");

// 1. Update user stats after an exam (Lifetime Stats)
exports.updateExamResult = async (req, res) => {
  try {
    const { userId, correct, wrong, total } = req.body;

    // BCS Logic: 1 mark for correct, -0.50 for wrong
    const sessionPoints = (correct * 1) - (wrong * 0.50);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          "stats.totalTestsTaken": 1,
          "stats.totalSolved": total,
          "stats.totalCorrect": correct,
          "stats.totalWrong": wrong,
          "stats.totalPoints": sessionPoints
        },
        $set: { "stats.lastTestDate": new Date() }
      },
      { returnDocument:'after', runValidators: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, stats: user.stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Sync single question clicks (Real-time tracking)
exports.syncQuestionClick = async (req, res) => {
  try {
    const { userId, isCorrect } = req.body;
    const points = isCorrect ? 1 : -0.50;

    const user = await User.findByIdAndUpdate(
      userId, 
      {
        $inc: {
          "stats.totalSolved": 1,
          "stats.totalCorrect": isCorrect ? 1 : 0,
          "stats.totalWrong": isCorrect ? 0 : 1,
          "stats.totalPoints": points
        }
      }, 
     { returnDocument: 'after' }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ 
      success: true, 
      totalPoints: user.stats.totalPoints,
      stats: user.stats 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sync failed", error: error.message });
  }
};

// 3. Save detailed result to History
exports.saveResult = async (req, res) => {
  try {
    const { userId, userName, topic, correct, incorrect, unanswered, total, timeSpentSeconds, testId } = req.body;
    
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    const points = (correct * 1) - (incorrect * 0.50);

    const newResult = new History({
      userId, 
      userName, 
      topic: topic || "General Practice", 
      correct: correct || 0, 
      incorrect: incorrect || 0, 
      unanswered: unanswered || 0, 
      total: total || 0, 
      percentage, 
      points,
      timeSpentSeconds: timeSpentSeconds || 0,
      // Optional: Generate a review link for the frontend
      link: testId ? `/review/${testId}` : null, 
      timestamp: new Date()
    });

    await newResult.save();
    res.status(201).json({ success: true, data: newResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Get User History
exports.getUserHistory = async (req, res) => {
  try {
    const logs = await History.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed", error: error.message });
  }
};

// 5. Global Leaderboard (Lifetime)
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'user' })
      .select('name stats')
      .sort({ "stats.totalPoints": -1 }) 
      .limit(50);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Timeframe Leaderboard (Daily/Weekly)
exports.getDailyTestLeaderboard = async (req, res) => {
  try {
    const { timeframe } = req.query; 
    const now = new Date();
    let startTime = new Date();

    if (timeframe === 'weekly') {
      startTime.setDate(now.getDate() - now.getDay());
    }
    startTime.setHours(0, 0, 0, 0);

    const leaderboard = await History.aggregate([
      { $match: { timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          bestPercentage: { $max: "$percentage" },
          totalPoints: { $sum: "$points" },
          minTime: { $min: "$timeSpentSeconds" },
          totalTests: { $sum: 1 },
          totalCorrect: { $sum: "$correct" },
          totalWrong: { $sum: "$incorrect" }
        }
      },
      { $sort: { totalPoints: -1, bestPercentage: -1 } },
      { $limit: 50 },
      {
        $project: {
          _id: 1,
          name: "$userName",
          stats: {
            totalPoints: "$totalPoints",
            totalCorrect: "$totalCorrect",
            totalWrong: "$totalWrong",
            totalTestsTaken: "$totalTests",
            accuracy: "$bestPercentage"
          }
        }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};