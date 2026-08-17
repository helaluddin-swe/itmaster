const mongoose = require('mongoose');
const { Schema } = mongoose;

// Multi-language string – NOT required for every language
const localizedStringSchema = {
  en: { type: String, default: '' },
  bn: { type: String, default: '' },
  fr: { type: String, default: '' },
  es: { type: String, default: '' }
};

// Multi-language array of strings
const localizedArraySchema = {
  en: [{ type: String, default: '' }],
  bn: [{ type: String, default: '' }],
  fr: [{ type: String, default: '' }],
  es: [{ type: String, default: '' }]
};

// 1. Question Schema
const questionSchema = new Schema({
  questionText: localizedStringSchema,
  options: localizedArraySchema,
  correctOptionIndex: { type: Number, required: true, default: 0 },
  explanation: localizedStringSchema
}, { _id: false });

// 2. Subtopic Schema
const subtopicSchema = new Schema({
  id: { type: String, required: true },
  title: localizedStringSchema,
  content: localizedStringSchema,
  duration: { type: String, default: '10 min read' },
  questions: [questionSchema],
  bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }] // Fixed duplicate/conflicting declaration
}, { _id: false });

// 3. Topic Schema
const topicSchema = new Schema({
  id: { type: String, required: true },
  title: localizedStringSchema,
  subtopics: [subtopicSchema]
}, { _id: false });

// 4. Chapter Schema
const chapterSchema = new Schema({
  id: { type: String, required: true },
  title: localizedStringSchema,
  topics: [topicSchema]
}, { _id: false });

// 5. Main Course Schema
const courseSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: localizedStringSchema,
  chapters: [chapterSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);