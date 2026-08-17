const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  subtopicId: { type: String, required: true },
  id: { type: String, required: true },
  startMeta: { type: mongoose.Schema.Types.Mixed, required: true },
  endMeta: { type: mongoose.Schema.Types.Mixed, required: true },
  text: { type: String, required: true },
  extra: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

highlightSchema.index(
  {
    subtopicId: 1,
    id: 1
  },
  {
    unique: true
  }
);

const Highlight = mongoose.models.Highlight || mongoose.model("Highlight", highlightSchema);

module.exports = Highlight;