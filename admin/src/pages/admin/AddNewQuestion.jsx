import React, { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2, Info, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { examCategories } from './data';
import RelatedQuestionsModal from './RelatedQuestionsModal';

export default function AddNewQuestion({ editMode = false, existingData = null, onSuccess, onAdd }) {
  // Handle mongoose array fields conversion for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRelatedDocs, setSelectedRelatedDocs] = useState(existingData?.relatedQuestions || []);
  const initialOptions = existingData?.options
    ? (Array.isArray(existingData.options) ? existingData.options.join(', ') : existingData.options)
    : '';

  const initialTopic = existingData?.topic
    ? (Array.isArray(existingData.topic) ? existingData.topic[0] : existingData.topic)
    : 'বাংলা সাহিত্য';

  const initialPrevExams = existingData?.prevExams
    ? (Array.isArray(existingData.prevExams) ? existingData.prevExams.join(', ') : existingData.prevExams)
    : '';

  // NEW: Handle related questions initialization
  const initialRelated = existingData?.relatedQuestions
    ? (Array.isArray(existingData.relatedQuestions) ? existingData.relatedQuestions.join(', ') : existingData.relatedQuestions)
    : '';

  // Main Form State matching your QuestionSchema fields
  const [formData, setFormData] = useState({
    question: existingData?.question || '',
    options: initialOptions,
    answer: existingData?.answer || '',
    prevExams: initialPrevExams,
    explanation: existingData?.explanation || '',
    topic: initialTopic,
    examAppearances: existingData?.examAppearances || [], 
    relatedQuestions: initialRelated 
  });

  // Local state for the specific exam being added to the list
  const [currentExamInput, setCurrentExamInput] = useState({
    examCategory: '',
    specificExam: '',
    year: ''
  });

  const [status, setStatus] = useState({ loading: false, type: '', message: '' });
  const { backendUrl } = useAppContext();
  const { darkMode } = useTheme();

  // Handle standard text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input for the exam currently being added
  const handleExamInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'examCategory') {
      setCurrentExamInput({ ...currentExamInput, [name]: value, specificExam: '' });
    } else {
      setCurrentExamInput({ ...currentExamInput, [name]: value });
    }
  };

  // Add exam to the array
  const handleAddExam = () => {
    if (!currentExamInput.examCategory || !currentExamInput.specificExam) {
      toast.error('Please select both Exam Category and Specific Exam.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      examAppearances: [...prev.examAppearances, { ...currentExamInput }]
    }));

    // Reset input fields
    setCurrentExamInput({ examCategory: '', specificExam: '', year: '' });
  };

  // Remove exam from the array
  const handleRemoveExam = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      examAppearances: prev.examAppearances.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Fetch dynamic specific exams for the current input selection
  const selectedCategoryData = examCategories?.find(cat => cat.id === currentExamInput.examCategory);
  const specificExamOptions = selectedCategoryData?.exams || [];

  const optionList = formData.options
    ? formData.options.split(',').map(opt => opt.trim()).filter(Boolean)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auto-calculate index for AdminTopicManager compatibility if it needs it, 
    // while conforming strictly to your QuestionSchema model structure.
    const correctIndex = optionList.findIndex(opt => opt === formData.answer.trim());

    // NEW: Parse related questions string into an array of IDs
    const relatedQuestionsArray = formData.relatedQuestions
      ? formData.relatedQuestions.split(',').map(id => id.trim()).filter(Boolean)
      : [];

    const formattedData = {
      question: formData.question.trim(),
      options: optionList,
      answer: formData.answer.trim(),
      correctOptionIndex: correctIndex >= 0 ? correctIndex : 0,
      prevExams: formData.prevExams ? formData.prevExams.split(',').map(item => item.trim()).filter(Boolean) : [],
      explanation: formData.explanation.trim(),
      topic: [formData.topic], // Saved as array matching schema type: [String]
      examAppearances: formData.examAppearances,
      relatedQuestions: selectedRelatedDocs.map(q => (typeof q === 'object' ? q._id : q))
    };

    // IF ONADD PROP IS PASSED: Send data to parent (AdminTopicManager) instead of API
    if (onAdd) {
      onAdd(formattedData);
      setFormData({ question: '', options: '', answer: '', prevExams: '', explanation: '', topic: 'বাংলা সাহিত্য', examAppearances: [], relatedQuestions: '' });
      toast.success('Question added to this part!');
      return;
    }

    // NORMAL API BEHAVIOR (If used standalone with your Questions model)
    setStatus({ loading: true, type: '', message: '' });
    try {
      if (editMode) {
        await axios.put(`${backendUrl}/api/v1/questions/${existingData._id}`, formattedData);
        setStatus({ loading: false, type: 'success', message: 'Question updated successfully!' });
      } else {
        await axios.post(`${backendUrl}/api/v1/questions`, formattedData);
        setStatus({ loading: false, type: 'success', message: 'Question added to database!' });
        setFormData({ question: '', options: '', answer: '', prevExams: '', explanation: '', topic: 'বাংলা সাহিত্য', examAppearances: [], relatedQuestions: '' });
      }
      if (onSuccess) setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, type: 'error', message: err.response?.data?.message || 'Failed to save.' });
    }
  };

  const inputClass = `w-full border rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs sm:text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-sm'
    }`;

  const labelClass = `block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'
    }`;

  return (
    <div className="w-full mx-auto transition-colors mt-4">
      <div className={`${editMode ? '' : darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {editMode ? 'Edit Question' : 'Add MCQ to this Part'}
        </h2>

        {status.message && (
          <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 text-sm border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="font-semibold">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Question Text</label>
            <textarea name="question" rows="2" required value={formData.question} onChange={handleChange} className={inputClass} placeholder="যেমন: বাংলা গদ্যের জনক কে?" />
          </div>

          <div>
            <label className={labelClass}>Options (Comma Separated - Min 4 Required)</label>
            <input type="text" name="options" required value={formData.options} onChange={handleChange} className={inputClass} placeholder="বঙ্কিমচন্দ্র চট্টোপাধ্যায়, ঈশ্বরচন্দ্র বিদ্যাসাগর..." />
            <div className={`mt-1.5 flex items-center gap-1.5 text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Enter at least 4 choices separated by commas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Correct Answer</label>
              <select name="answer" required value={formData.answer} onChange={handleChange} className={inputClass}>
                <option value="" disabled>-- Select Correct Answer --</option>
                {optionList.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Subject / Topic</label>
              <select name="topic" value={formData.topic} onChange={handleChange} className={inputClass}>
                <option value="বাংলা সাহিত্য">📖 বাংলা সাহিত্য</option>
                <option value="ইংরেজি ভাষা ও সাহিত্য">🔤 ইংরেজি ভাষা ও সাহিত্য</option>
                <option value="বাংলাদেশ বিষয়াবলি">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
                <option value="সাধারণ বিজ্ঞান">🔬 সাধারণ বিজ্ঞান</option>
                <option value="কম্পিউটার ও তথ্যপ্রযুক্তি">কম্পিউটার ও তথ্যপ্রযুক্তি</option>
                <option value="গাণিতিক যুক্তি">গাণিতিক যুক্তি</option>
                <option value="মানসিক দক্ষতা">মানসিক দক্ষতা</option>
                <option value="আন্তর্জাতিক বিষয়াবলি">আন্তর্জাতিক বিষয়াবলি</option>
                <option value="ভুগোল ও পরিবেশ">ভুগোল ও পরিবেশ</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Explanation</label>
            <textarea name="explanation" rows="2" value={formData.explanation} onChange={handleChange} className={inputClass} placeholder="সঠিক উত্তরের ব্যাখ্যা লিখুন..." />
          </div>

          {/* NEW: Related Questions Input */}
          <div>
            <label className={labelClass}>Related Questions</label>

            {/* Render Selected Question Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedRelatedDocs.map((item, idx) => {
                // Handles cases whether it's populated objects or raw ID strings
                const qId = typeof item === 'object' ? item._id : item;
                const qText = typeof item === 'object' ? item.question : `ID: ${qId.slice(-6)}`;

                return (
                  <span key={idx} className={`text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                    <span className="max-w-[200px] truncate">{qText}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRelatedDocs(prev => prev.filter(q => (typeof q === 'object' ? q._id !== qId : q !== qId)))}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Trigger Modal Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`w-full py-2.5 px-4 rounded-xl border border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-colors ${darkMode ? 'border-slate-800 hover:bg-slate-900 text-indigo-400' : 'border-slate-300 hover:bg-slate-50 text-indigo-600'
                }`}
            >
              <Plus size={16} /> Link Related Questions
            </button>
          </div>

          {/* Modal Integration */}
          <RelatedQuestionsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedIds={selectedRelatedDocs.map(q => (typeof q === 'object' ? q._id : q))}
            onSelect={(questionObj) => {
              setSelectedRelatedDocs(prev => {
                const exists = prev.some(q => (typeof q === 'object' ? q._id === questionObj._id : q === questionObj._id));
                if (exists) {
                  return prev.filter(q => (typeof q === 'object' ? q._id !== questionObj._id : q !== questionObj._id));
                } else {
                  return [...prev, questionObj];
                }
              });
            }}
          />

          {/* EXAM MULTIPLE ADDITION SECTION */}
          <div className={`p-4 border rounded-xl space-y-4 ${darkMode ? 'bg-indigo-900/10 border-indigo-900/30' : 'bg-indigo-50/50 border-indigo-100'}`}>
            <label className={`${labelClass} mb-0`}>Exam Appearances Details</label>

            {/* Display Added Exams */}
            {formData.examAppearances.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 pb-2">
                {formData.examAppearances.map((exam, idx) => (
                  <span key={idx} className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>
                    {exam.examCategory} - {exam.specificExam} ({exam.year})
                    <button type="button" onClick={() => handleRemoveExam(idx)} className="hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select name="examCategory" value={currentExamInput.examCategory} onChange={handleExamInputChange} className={inputClass}>
                <option value="">Select Category</option>
                {examCategories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select name="specificExam" value={currentExamInput.specificExam} onChange={handleExamInputChange} className={inputClass} disabled={!currentExamInput.examCategory}>
                <option value="">Select Specific Exam</option>
                {specificExamOptions.map((exam, i) => (
                  <option key={i} value={exam}>{exam}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <input type="text" name="year" placeholder="Year (e.g. 2023)" value={currentExamInput.year} onChange={handleExamInputChange} className={inputClass} />
                <button type="button" onClick={handleAddExam} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={status.loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Send className="w-4 h-4" />
              {onAdd ? 'Save Question to Part' : (editMode ? 'Update Question' : 'Publish Question')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}