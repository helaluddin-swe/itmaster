import React, { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2, Info, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const AddExamQuestion = ({ editMode = false, existingData = null, onSuccess }) => {
  const { backendUrl } = useAppContext();
  const { darkMode } = useTheme();

  // Mode state: 'single' or 'multiple'
  const [inputMode, setInputMode] = useState('single');

  // Single Question Form State
  const [formData, setFormData] = useState({
    question: existingData?.question || '',
    options: Array.isArray(existingData?.options) ? existingData.options.join(', ') : (existingData?.options || ''),
    answer: existingData?.answer || '',
    prevExams: existingData?.prevExams || '',
    explanation1: existingData?.explanation1 || '',
    explanation2: existingData?.explanation2 || '',
    hints: existingData?.hints || '',
    topic: existingData?.topic || 'বাংলা সাহিত্য'
  });

  // Multiple Question Forms State (One after another dynamic list)
  const [globalExamName, setGlobalExamName] = useState('');
  const [globalTopic, setGlobalTopic] = useState('বাংলা সাহিত্য');
  
  const [questionBlocks, setQuestionBlocks] = useState([
    {
      question: '',
      options: '',
      answer: '',
      explanation1: '',
      explanation2: '',
      hints: ''
    }
  ]);

  const [status, setStatus] = useState({ loading: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle single question submission or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, type: '', message: '' });

    const formattedData = {
      ...formData,
      options: typeof formData.options === 'string' 
        ? formData.options.split(',').map(opt => opt.trim()) 
        : formData.options
    };

    try {
      if (editMode) {
        await axios.put(`${backendUrl}/mcq/${existingData._id}`, formattedData);
        toast.success('Question updated successfully');
        setStatus({ loading: false, type: 'success', message: 'Question updated successfully!' });
      } else {
        await axios.post(`${backendUrl}/mcq`, formattedData);
        toast.success("Exam Question Added Successfully");
        setStatus({ loading: false, type: 'success', message: 'Question added to database!' });
        setFormData({ question: '', options: '', answer: '', prevExams: '', topic: 'বাংলা সাহিত্য', hints: '', explanation1: '', explanation2: '' });
      }

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        type: 'error',
        message: err.response?.data?.message || 'Failed to save. Check your connection.'
      });
    }
  };

  // Multiple Form Helpers
  const handleAddBlock = () => {
    setQuestionBlocks([
      ...questionBlocks,
      { question: '', options: '', answer: '', explanation1: '', explanation2: '', hints: '' }
    ]);
  };

  const handleRemoveBlock = (index) => {
    if (questionBlocks.length === 1) {
      toast.error('You must keep at least one question entry form.');
      return;
    }
    const updated = questionBlocks.filter((_, i) => i !== index);
    setQuestionBlocks(updated);
  };

  const handleBlockChange = (index, field, value) => {
    const updated = [...questionBlocks];
    updated[index][field] = value;
    setQuestionBlocks(updated);
  };

  // Submit Multiple Sequential Questions
  const handleMultipleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    for (let i = 0; i < questionBlocks.length; i++) {
      if (!questionBlocks[i].question || !questionBlocks[i].options || !questionBlocks[i].answer) {
        toast.error(`Please complete Question #${i + 1} (Text, Options, Answer required).`);
        return;
      }
    }

    setStatus({ loading: true, type: '', message: '' });

    try {
      let count = 0;
      for (const block of questionBlocks) {
        const payload = {
          question: block.question,
          options: block.options.split(',').map(opt => opt.trim()),
          answer: block.answer.trim(),
          prevExams: globalExamName,
          topic: globalTopic,
          explanation1: block.explanation1,
          explanation2: block.explanation2,
          hints: block.hints
        };

        await axios.post(`${backendUrl}/mcq`, payload);
        count++;
      }

      toast.success(`Successfully uploaded ${count} questions!`);
      setStatus({ loading: false, type: 'success', message: `Successfully uploaded ${count} questions!` });
      
      // Reset form blocks
      setQuestionBlocks([{ question: '', options: '', answer: '', explanation1: '', explanation2: '', hints: '' }]);
      setGlobalExamName('');
      setGlobalTopic('বাংলা সাহিত্য');

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload multiple questions. Check connection.'
      });
    }
  };

  const inputClass = `w-full border rounded-2xl py-3 px-4 outline-none transition-all text-xs font-medium focus:ring-2 focus:ring-indigo-500/50 ${
    darkMode 
      ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' 
      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
  }`;

  const labelClass = `block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`;

  // Helper to parse single option list for dropdown
  const singleOptionList = formData.options
    ? formData.options.split(',').map(opt => opt.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`border rounded-[2.5rem] p-6 sm:p-10 shadow-2xl ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Header and Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {editMode ? 'Edit Exam Question' : 'Upload Exam Question Bank'}
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {editMode ? 'Modify individual question parameters.' : 'Add single questions or easily add multiple questions one after another.'}
            </p>
          </div>

          {!editMode && (
            <div className={`flex items-center p-1.5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setInputMode('single')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  inputMode === 'single'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Single Entry
              </button>
              <button
                type="button"
                onClick={() => setInputMode('multiple')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  inputMode === 'multiple'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Multiple Entry (Sequential)
              </button>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {status.message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
            status.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-bold">{status.message}</span>
          </div>
        )}

        {/* MULTIPLE SEQUENTIAL ENTRY VIEW */}
        {inputMode === 'multiple' && !editMode ? (
          <form onSubmit={handleMultipleSubmit} className="space-y-8">
            {/* Global Exam Info Settings */}
            <div className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <label className={labelClass}>Target Exam Name (Applies to all below)</label>
                <input 
                  type="text" 
                  value={globalExamName} 
                  onChange={(e) => setGlobalExamName(e.target.value)} 
                  placeholder="e.g., BCS 45th Preliminary" 
                  className={inputClass} 
                />
              </div>
              <div>
                <label className={labelClass}>Subject / Topic (Applies to all below)</label>
                <select
                  value={globalTopic}
                  onChange={(e) => setGlobalTopic(e.target.value)}
                  className={inputClass}
                >
                  <option value="বাংলা সাহিত্য">📖 বাংলা সাহিত্য</option>
                  <option value="ইংরেজি ভাষা ও সাহিত্য">🔤 ইংরেজি ভাষা ও সাহিত্য</option>
                  <option value="বাংলাদেশ বিষয়াবলি">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
                  <option value="আন্তর্জাতিক বিষয়াবলি">🌍 আন্তর্জাতিক বিষয়াবলি</option>
                  <option value="ভুগোল ও পরিবেশ">🗺️ ভুগোল ও পরিবেশ</option>
                  <option value="সাধারণ বিজ্ঞান">🔬 সাধারণ বিজ্ঞান</option>
                  <option value="কম্পিউটার ও তথ্যপ্রযুক্তি">💻 কম্পিউটার ও তথ্যপ্রযুক্তি</option>
                  <option value="গাণিতিক যুক্তি">➗ গাণিতিক যুক্তি</option>
                  <option value="মানসিক দক্ষতা">🧠 মানসিক দক্ষতা</option>
                  <option value="সুশাসন ও নৈতিকতা">⚖️ সুশাসন ও নৈতিকতা</option>
                </select>
              </div>
            </div>

            {/* Dynamic Question Forms Stack */}
            <div className="space-y-6">
              {questionBlocks.map((block, index) => {
                const blockOptionList = block.options
                  ? block.options.split(',').map(opt => opt.trim()).filter(Boolean)
                  : [];

                return (
                  <div 
                    key={index} 
                    className={`p-6 rounded-3xl border relative space-y-4 transition-all ${
                      darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-black text-indigo-500 uppercase tracking-widest font-mono">
                        Question Entry #{index + 1}
                      </span>
                      {questionBlocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBlock(index)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Remove Question Block"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Question Text</label>
                      <textarea 
                        rows="2" 
                        required 
                        value={block.question} 
                        onChange={(e) => handleBlockChange(index, 'question', e.target.value)} 
                        placeholder="Type the question statement here..."
                        className={inputClass} 
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Options (Comma Separated)</label>
                      <input 
                        type="text" 
                        required 
                        value={block.options} 
                        onChange={(e) => handleBlockChange(index, 'options', e.target.value)} 
                        placeholder="Option A, Option B, Option C, Option D"
                        className={inputClass} 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Correct Answer</label>
                        <select
                          name="answer"
                          required
                          value={block.answer}
                          onChange={(e) => handleBlockChange(index, 'answer', e.target.value)}
                          className={inputClass}
                        >
                          <option value="" disabled>-- Select Correct Answer --</option>
                          {blockOptionList.length > 0 ? (
                            blockOptionList.map((opt, optIdx) => (
                              <option key={optIdx} value={opt}>
                                {opt}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>Fill options above first</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Hints (Optional)</label>
                        <input 
                          type="text" 
                          value={block.hints} 
                          onChange={(e) => handleBlockChange(index, 'hints', e.target.value)} 
                          placeholder="Quick hint..."
                          className={inputClass} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Detailed Explanation 1 (Optional)</label>
                        <textarea 
                          rows="2" 
                          value={block.explanation1} 
                          onChange={(e) => handleBlockChange(index, 'explanation1', e.target.value)} 
                          placeholder="Primary explanation..."
                          className={inputClass} 
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Detailed Explanation 2 (Optional)</label>
                        <textarea 
                          rows="2" 
                          value={block.explanation2} 
                          onChange={(e) => handleBlockChange(index, 'explanation2', e.target.value)} 
                          placeholder="Secondary explanation..."
                          className={inputClass} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add More Button */}
            <button
              type="button"
              onClick={handleAddBlock}
              className={`w-full py-3.5 rounded-2xl border border-dashed font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                darkMode 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800/50' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Plus size={16} className="text-indigo-500" /> Add Another Question Form
            </button>

            {/* Submit All Multiple Questions */}
            <button
              type="submit"
              disabled={status.loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                status.loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-[0.98]'
              }`}
            >
              {status.loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Upload All {questionBlocks.length} Question{questionBlocks.length > 1 ? 's' : ''} to Database
                </>
              )}
            </button>
          </form>
        ) : (
          /* SINGLE ENTRY VIEW */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className={labelClass}>Question Text</label>
              <textarea name="question" rows="2" required value={formData.question} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Options (Comma Separated)</label>
              <input type="text" name="options" required value={formData.options} onChange={handleChange} className={inputClass} />
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium italic">
                <Info size={12} /> Separate answers with commas (e.g., Apple, Banana, Orange)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Correct Answer</label>
                <select
                  name="answer"
                  required
                  value={formData.answer}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>-- Select Correct Answer --</option>
                  {singleOptionList.length > 0 ? (
                    singleOptionList.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Fill options above first</option>
                  )}
                </select>
              </div>
              <div>
                <label className={labelClass}>Subject / Topic</label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="বাংলা সাহিত্য">📖 বাংলা সাহিত্য</option>
                  <option value="ইংরেজি ভাষা ও সাহিত্য">🔤 ইংরেজি ভাষা ও সাহিত্য</option>
                  <option value="বাংলাদেশ বিষয়াবলি">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
                  <option value="আন্তর্জাতিক বিষয়াবলি">🌍 আন্তর্জাতিক বিষয়াবলি</option>
                  <option value="ভুগোল ও পরিবেশ">🗺️ ভুগোল ও পরিবেশ</option>
                  <option value="সাধারণ বিজ্ঞান">🔬 সাধারণ বিজ্ঞান</option>
                  <option value="কম্পিউটার ও তথ্যপ্রযুক্তি">💻 কম্পিউটার ও তথ্যপ্রযুক্তি</option>
                  <option value="গাণিতিক যুক্তি">➗ গাণিতিক যুক্তি</option>
                  <option value="মানসিক দক্ষতা">🧠 মানসিক দক্ষতা</option>
                  <option value="সুশাসন ও নৈতিকতা">⚖️ সুশাসন ও নৈতিকতা</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Exam Name / Previous Exams</label>
              <input type="text" name="prevExams" value={formData.prevExams} onChange={handleChange} placeholder="e.g., BCS 45th Preliminary" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Detailed Explanation 1</label>
              <textarea name="explanation1" rows="5" value={formData.explanation1} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Detailed Explanation 2</label>
              <textarea name="explanation2" rows="5" value={formData.explanation2} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Hints</label>
              <textarea name="hints" rows="3" value={formData.hints} onChange={handleChange} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                status.loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-[0.98]'
              }`}
            >
              {status.loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  {editMode ? 'Update Question Record' : 'Upload to Exam Database'}
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AddExamQuestion;