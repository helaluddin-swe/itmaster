import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  BookOpen,
  Eye,
  Code,
  Layers,
  RefreshCw,
  Highlighter,
  AlertCircle,
  Circle,
  PlusCircle,
  Lightbulb,
  X,
  HelpCircle
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { htmlTags, subjectCourses } from '../../../../client/src/utils/data';

const LANGS = ['en', 'bn', 'fr', 'es'];

const emptyLocalized = () => ({ en: '', bn: '', fr: '', es: '' });
const emptyOptions = () => ({
  en: ['', '', '', ''],
  bn: ['', '', '', ''],
  fr: ['', '', '', ''],
  es: ['', '', '', '']
});

export default function AdminTopicManager() {
  const { darkMode } = useTheme();
  const { backendUrl } = useAppContext();
  const [currentLang, setCurrentLang] = useState('en');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Database Data State
  const [dbCourses, setDbCourses] = useState([]);
  const [selectedCourseData, setSelectedCourseData] = useState(null);

  const defaultRichHTML = `
<article>
  <header>
    <h1>JavaScript & TypeScript: Scope & Closures</h1>
    <p>A <b>Closure</b> is a fundamental concept where an inner function retains access to variables in its outer lexical scope, even after the outer function has executed.</p>
  </header>
  <section>
    <h2>Key Characteristics</h2>
    <ul>
      <li>Preserves lexical state between function calls.</li>
      <li>Enables data privacy and encapsulation (e.g., private variables).</li>
      <li>Used extensively in callbacks, event listeners, and currying.</li>
    </ul>
    <p>For official documentation, visit: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" target="_blank" rel="noopener noreferrer">MDN Web Docs</a></p>
  </section>
</article>
`.trim();

  // Unified Form State
  const [formData, setFormData] = useState({
    slug: 'javascript-typescript',
    title: {
      en: 'JavaScript & TypeScript',
      bn: 'জাভাস্ক্রিপ্ট এবং টাইপস্ক্রিপ্ট',
      fr: 'JavaScript & TypeScript',
      es: 'JavaScript y TypeScript'
    },
    chapterId: 'ch-js-ts-1',
    chapterTitle: {
      en: 'Chapter 1: Advanced Execution Context & Scope',
      bn: 'অধ্যায় ১: উন্নত এক্সিকিউশন কনটেক্সট এবং স্কোপ',
      fr: "Chapitre 1 : Contexte d'exécution avancé et portée",
      es: 'Capítulo 1: Contexto de ejecución avanzado y alcance'
    },
    topicId: 'top-js-ts-1',
    topicTitle: {
      en: '1.1 Closures & Lexical Scope',
      bn: '১.১ ক্লোজার এবং লেক্সিক্যাল স্কোপ',
      fr: '1.1 Fermetures (Closures) et portée lexicale',
      es: '1.1 Clousures (Clausuras) y ámbito léxico'
    },
    subtopics: [
      {
        id: 'sub-js-ts-1',
        title: {
          en: 'Understanding Closures and Data Privacy',
          bn: 'ক্লোজার এবং ডেটা প্রাইভেসি বোঝা',
          fr: 'Comprendre les fermetures et la confidentialité des données',
          es: 'Comprender las clausuras y la privacidad de los datos'
        },
        content: {
          en: defaultRichHTML,
          bn: defaultRichHTML,
          fr: defaultRichHTML,
          es: defaultRichHTML
        },
        duration: '10 min read',
        completed: false,
        questions: [
          {
            questionText: {
              en: 'What will be logged to the console when running: `function makeAdder(x) { return function(y) { return x + y; }; } const add5 = makeAdder(5); console.log(add5(2));`?',
              bn: 'নিচের কোডটি চালালে কনসোলে কী লগ হবে: `function makeAdder(x) { return function(y) { return x + y; }; } const add5 = makeAdder(5); console.log(add5(2));`?',
              fr: "Que sera affiché dans la console lors de l'exécution de : `function makeAdder(x) { return function(y) { return x + y; }; } const add5 = makeAdder(5); console.log(add5(2));` ?",
              es: '¿Qué se registrará en la consola al ejecutar: `function makeAdder(x) { return function(y) { return x + y; }; } const add5 = makeAdder(5); console.log(add5(2));`?'
            },
            options: {
              en: ['Undefined', '7', 'NaN', 'TypeError'],
              bn: ['আনডিফাইন্ড (Undefined)', '৭ (7)', 'ন্যান (NaN)', 'টাইপ এরর (TypeError)'],
              fr: ['Undefined', '7', 'NaN', 'TypeError'],
              es: ['Undefined', '7', 'NaN', 'TypeError']
            },
            correctOptionIndex: 1,
            explanation: {
              en: 'The returned inner function creates a closure that captures `x = 5`. Calling `add5(2)` evaluates `5 + 2`, returning `7`.',
              bn: 'রিটার্ন করা ইনার ফাংশনটি একটি ক্লোজার তৈরি করে যা `x = 5` ধরে রাখে। `add5(2)` কল করলে `5 + 2` মূল্যায়ন করে `7` রিটার্ন করে।',
              fr: "La fonction interne renvoyée crée une fermeture qui capture `x = 5`. L'appel de `add5(2)` évalue `5 + 2`, renvoyant `7`.",
              es: 'La función interna devuelta crea una clausura que captura `x = 5`. Llamar a `add5(2)` evalúa `5 + 2`, devolviendo `7`.'
            }
          }
        ]
      }
    ]
  });

  useEffect(() => {
    fetchCourseCatalog();
  }, []);

  const fetchCourseCatalog = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/v1/courses`);
      if (res.data.success && res.data.data.length > 0) {
        setDbCourses(res.data.data);
        loadCourseDetails(res.data.data[0].slug);
      }
    } catch (err) {
      console.error('Failed to load courses from DB:', err);
    }
  };

  const normalizeSubtopic = (sub) => {
    // Ensure content / title are objects and questions have proper shape
    const content =
      typeof sub.content === 'string'
        ? { en: sub.content, bn: '', fr: '', es: '' }
        : { ...emptyLocalized(), ...(sub.content || {}) };

    const title =
      typeof sub.title === 'string'
        ? { en: sub.title, bn: '', fr: '', es: '' }
        : { ...emptyLocalized(), ...(sub.title || {}) };

    const questions = (sub.questions || []).map((q) => {
      const questionText =
        typeof q.questionText === 'string'
          ? { en: q.questionText, bn: '', fr: '', es: '' }
          : { ...emptyLocalized(), ...(q.questionText || {}) };

      let options = q.options;
      if (Array.isArray(options)) {
        // Old flat array → convert to localized
        options = {
          en: [...options],
          bn: [...options],
          fr: [...options],
          es: [...options]
        };
      } else {
        options = { ...emptyOptions(), ...(options || {}) };
      }

      const explanation =
        typeof q.explanation === 'string'
          ? { en: q.explanation, bn: '', fr: '', es: '' }
          : { ...emptyLocalized(), ...(q.explanation || {}) };

      return {
        ...q,
        questionText,
        options,
        explanation,
        correctOptionIndex: q.correctOptionIndex ?? 0
      };
    });

    return {
      id: sub.id || `sub-${Date.now()}`,
      title,
      content,
      duration: sub.duration || '10 min read',
      completed: !!sub.completed,
      questions
    };
  };

  const loadCourseDetails = async (slug) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await axios.get(`${backendUrl}/api/v1/courses/${slug}`);
      if (res.data.success) {
        const course = res.data.data;
        setSelectedCourseData(course);

        const firstChapter = course.chapters?.[0] || {
          id: `ch-${Date.now()}`,
          title: { en: 'New Chapter', bn: 'নতুন অধ্যায়', fr: 'Nouveau chapitre', es: 'Nuevo capítulo' },
          topics: []
        };

        const firstTopic = firstChapter.topics?.[0] || {
          id: `top-${Date.now()}`,
          title: { en: 'New Topic', bn: 'নতুন টপিক', fr: 'Nouveau sujet', es: 'Nuevo tema' },
          subtopics: []
        };

        const subtopics =
          firstTopic.subtopics?.length > 0
            ? firstTopic.subtopics.map(normalizeSubtopic)
            : [
                normalizeSubtopic({
                  id: `sub-${Date.now()}`,
                  title: emptyLocalized(),
                  content: {
                    en: '<section>\n  <h2>New Content</h2>\n</section>',
                    bn: '<section>\n  <h2>নতুন কন্টেন্ট</h2>\n</section>',
                    fr: '<section>\n  <h2>Nouveau contenu</h2>\n</section>',
                    es: '<section>\n  <h2>Nuevo contenido</h2>\n</section>'
                  },
                  duration: '10 min read',
                  questions: []
                })
              ];

        setFormData({
          slug: course.slug,
          title: course.title || emptyLocalized(),
          chapterId: firstChapter.id,
          chapterTitle: firstChapter.title || emptyLocalized(),
          topicId: firstTopic.id,
          topicTitle: firstTopic.title || emptyLocalized(),
          subtopics
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to fetch course details from database. Using default/local schema.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const slug = e.target.value;
    const found = subjectCourses.find((s) => s.slug === slug);

    const localizedTitle = found
      ? typeof found.name === 'object'
        ? found.name
        : { en: found.name, bn: '', fr: '', es: '' }
      : formData.title;

    setFormData((prev) => ({ ...prev, slug, title: localizedTitle }));
    loadCourseDetails(slug);
  };

  const handleChapterSelect = (e) => {
    const chId = e.target.value;
    const foundChapter = selectedCourseData?.chapters?.find((c) => c.id === chId);
    if (!foundChapter) return;

    const firstTopic = foundChapter.topics?.[0] || {
      id: `top-${Date.now()}`,
      title: { en: 'New Topic', bn: 'নতুন টপিক', fr: 'Nouveau sujet', es: 'Nuevo tema' },
      subtopics: []
    };

    const subtopics =
      firstTopic.subtopics?.length > 0
        ? firstTopic.subtopics.map(normalizeSubtopic)
        : formData.subtopics;

    setFormData((prev) => ({
      ...prev,
      chapterId: foundChapter.id,
      chapterTitle: foundChapter.title || emptyLocalized(),
      topicId: firstTopic.id,
      topicTitle: firstTopic.title || emptyLocalized(),
      subtopics
    }));
  };

  const handleTopicSelect = (e) => {
    const topId = e.target.value;
    const foundChapter = selectedCourseData?.chapters?.find((c) => c.id === formData.chapterId);
    const foundTopic = foundChapter?.topics?.find((t) => t.id === topId);
    if (!foundTopic) return;

    const subtopics =
      foundTopic.subtopics?.length > 0
        ? foundTopic.subtopics.map(normalizeSubtopic)
        : formData.subtopics;

    setFormData((prev) => ({
      ...prev,
      topicId: foundTopic.id,
      topicTitle: foundTopic.title || emptyLocalized(),
      subtopics
    }));
  };

  // --- Subtopic (Parts) Handlers ---
  const handleAddSubtopic = () => {
    setFormData((prev) => ({
      ...prev,
      subtopics: [
        ...prev.subtopics,
        normalizeSubtopic({
          id: `sub-${Date.now()}`,
          title: emptyLocalized(),
          content: {
            en: '<section>\n  <h2>New Part</h2>\n  <p>Content goes here...</p>\n</section>',
            bn: '<section>\n  <h2>নতুন পার্ট</h2>\n  <p>এখানে কন্টেন্ট লিখুন...</p>\n</section>',
            fr: '<section>\n  <h2>Nouvelle partie</h2>\n  <p>Le contenu va ici...</p>\n</section>',
            es: '<section>\n  <h2>Nueva parte</h2>\n  <p>El contenido va aquí...</p>\n</section>'
          },
          duration: '10 min read',
          questions: []
        })
      ]
    }));
  };

  const handleRemoveSubtopic = (sIdx) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.filter((_, idx) => idx !== sIdx)
    }));
  };

  const handleSubtopicChange = (sIdx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) =>
        idx === sIdx ? { ...sub, [field]: value } : sub
      )
    }));
  };

  // --- Editor Tag Insertion (language-aware) ---
  const insertTag = (sIdx, openTag, closeTag = '') => {
    const textarea = document.getElementById(`editor-${sIdx}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Always work with the CURRENT language string
    const currentContentObj = formData.subtopics[sIdx].content || {};
    const currentText = currentContentObj[currentLang] || '';

    const selectedText = currentText.substring(start, end);
    const newText =
      currentText.substring(0, start) + openTag + selectedText + closeTag + currentText.substring(end);

    handleSubtopicChange(sIdx, 'content', {
      ...currentContentObj,
      [currentLang]: newText
    });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + openTag.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleHighlight = (sIdx, color) => {
    const colorClasses = {
      yellow: 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 px-1 rounded',
      blue: 'bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 px-1 rounded',
      red: 'bg-rose-200 dark:bg-rose-900/50 text-rose-900 dark:text-rose-100 px-1 rounded',
      orange: 'bg-orange-200 dark:bg-orange-900/50 text-orange-900 dark:text-orange-100 px-1 rounded'
    };
    const openTag = `<span class="${colorClasses[color]} font-medium">`;
    const closeTag = `</span>`;
    insertTag(sIdx, openTag, closeTag);
  };

  // ==========================================
  // --- ADVANCED MCQ HANDLERS (localized) ---
  // ==========================================
  const handleAddQuestion = (sIdx) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) => {
        if (idx !== sIdx) return sub;
        return {
          ...sub,
          questions: [
            ...sub.questions,
            {
              questionText: emptyLocalized(),
              options: emptyOptions(),
              correctOptionIndex: 0,
              explanation: emptyLocalized()
            }
          ]
        };
      })
    }));
  };

  const handleQuestionChange = (sIdx, qIdx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) => {
        if (idx !== sIdx) return sub;
        return {
          ...sub,
          questions: sub.questions.map((q, questionIndex) =>
            questionIndex === qIdx ? { ...q, [field]: value } : q
          )
        };
      })
    }));
  };

  const handleOptionChange = (sIdx, qIdx, optIdx, value) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) => {
        if (idx !== sIdx) return sub;
        return {
          ...sub,
          questions: sub.questions.map((q, questionIndex) => {
            if (questionIndex !== qIdx) return q;

            // options is { en: [], bn: [], ... }
            const currentOptions = q.options || emptyOptions();
            const langOptions = [...(currentOptions[currentLang] || [])];
            langOptions[optIdx] = value;

            return {
              ...q,
              options: {
                ...currentOptions,
                [currentLang]: langOptions
              }
            };
          })
        };
      })
    }));
  };

  const handleAddOption = (sIdx, qIdx) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) => {
        if (idx !== sIdx) return sub;
        return {
          ...sub,
          questions: sub.questions.map((q, questionIndex) => {
            if (questionIndex !== qIdx) return q;

            const currentOptions = q.options || emptyOptions();
            const updated = {};
            LANGS.forEach((lang) => {
              updated[lang] = [...(currentOptions[lang] || []), ''];
            });

            return { ...q, options: updated };
          })
        };
      })
    }));
  };

  const handleRemoveOption = (sIdx, qIdx, optIdx) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) => {
        if (idx !== sIdx) return sub;
        return {
          ...sub,
          questions: sub.questions.map((q, questionIndex) => {
            if (questionIndex !== qIdx) return q;

            const currentOptions = q.options || emptyOptions();
            const updated = {};
            LANGS.forEach((lang) => {
              updated[lang] = (currentOptions[lang] || []).filter((_, i) => i !== optIdx);
            });

            // Adjust correct index safely
            let newCorrectIndex = q.correctOptionIndex ?? 0;
            const newLength = updated.en?.length ?? 0;
            if (newCorrectIndex >= newLength) {
              newCorrectIndex = Math.max(0, newLength - 1);
            } else if (optIdx === newCorrectIndex) {
              newCorrectIndex = 0;
            }

            return {
              ...q,
              options: updated,
              correctOptionIndex: newCorrectIndex
            };
          })
        };
      })
    }));
  };

  const handleRemoveQuestion = (sIdx, qIdx) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) => {
        if (idx !== sIdx) return sub;
        return {
          ...sub,
          questions: sub.questions.filter((_, questionIndex) => questionIndex !== qIdx)
        };
      })
    }));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const payload = {
        slug: formData.slug,
        title: formData.title,
        chapters: [
          {
            id: formData.chapterId,
            title: formData.chapterTitle,
            topics: [
              {
                id: formData.topicId,
                title: formData.topicTitle,
                subtopics: formData.subtopics
              }
            ]
          }
        ]
      };

      await axios.post(`${backendUrl}/api/v1/courses/seed`, payload, headers);
      setMessage({
        type: 'success',
        text: 'Curriculum content and all parts published successfully!'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save to database.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Theme Object
  const theme = {
    bgMain: darkMode ? 'bg-slate-950' : 'bg-slate-100',
    bgCard: darkMode ? 'bg-slate-900' : 'bg-white',
    border: darkMode ? 'border-slate-800' : 'border-slate-200',
    textMain: darkMode ? 'text-slate-100' : 'text-slate-900',
    textMuted: darkMode ? 'text-slate-400' : 'text-slate-600',
    inputBg: darkMode ? 'bg-slate-950' : 'bg-slate-50',
    primary: darkMode ? 'text-indigo-400' : 'text-indigo-600',
    cardShadow: darkMode ? 'shadow-xl shadow-black/20' : 'shadow-lg shadow-slate-200/50',
    previewBg: darkMode ? 'bg-slate-950' : 'bg-white',
    proseTheme: darkMode
      ? 'prose-invert text-slate-300 marker:text-slate-500'
      : 'prose-slate text-slate-700'
  };

  const banglaOptionLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];

  // Helper to safely get options array for current language
  const getOptionsForLang = (q) => {
    if (!q?.options) return ['', '', '', ''];
    if (Array.isArray(q.options)) return q.options; // legacy
    return q.options[currentLang] || q.options.en || ['', '', '', ''];
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${theme.bgMain} ${theme.textMain}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header & Language Switcher */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4 ${theme.border}`}
        >
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <BookOpen className={`w-6 h-6 ${theme.primary}`} />
              Advanced Topic & Content Manager
            </h1>
            <p className={`text-sm mt-1 ${theme.textMuted}`}>
              Upload multi-part localized HTML content, inject SEO/Semantic tags, and build smart
              interactive MCQs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Tabs */}
            <div className={`flex items-center p-1 rounded-xl border ${theme.inputBg} ${theme.border}`}>
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setCurrentLang(lang)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                    currentLang === lang
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : `${theme.textMuted} hover:${theme.textMain}`
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading DB Data...
              </div>
            )}
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hierarchy Global Settings */}
          <div
            className={`${theme.bgCard} border ${theme.border} p-5 md:p-8 rounded-2xl space-y-6 ${theme.cardShadow}`}
          >
            <h2
              className={`text-sm font-bold uppercase tracking-wider ${theme.primary} flex items-center gap-2`}
            >
              <Layers className="w-4 h-4" /> 1. Topic Hierarchy Allocation ({currentLang.toUpperCase()})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Subject / Course Slug
                </label>
                <select
                  value={formData.slug}
                  onChange={handleSubjectChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                >
                  {subjectCourses.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {typeof sub.name === 'object'
                        ? sub.name[currentLang] || sub.name.en
                        : sub.name}{' '}
                      ({sub.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Select Existing Chapter
                </label>
                <select
                  value={formData.chapterId}
                  onChange={handleChapterSelect}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                  disabled={!selectedCourseData?.chapters?.length}
                >
                  {selectedCourseData?.chapters?.length ? (
                    selectedCourseData.chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {typeof ch.title === 'object'
                          ? ch.title[currentLang] || ch.title.en
                          : ch.title}
                      </option>
                    ))
                  ) : (
                    <option value={formData.chapterId}>New / Manual Chapter</option>
                  )}
                </select>
              </div>

              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Select Existing Topic
                </label>
                <select
                  value={formData.topicId}
                  onChange={handleTopicSelect}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                  disabled={
                    !selectedCourseData?.chapters?.find((c) => c.id === formData.chapterId)?.topics
                      ?.length
                  }
                >
                  {selectedCourseData?.chapters?.find((c) => c.id === formData.chapterId)?.topics
                    ?.length ? (
                    selectedCourseData.chapters
                      .find((c) => c.id === formData.chapterId)
                      .topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {typeof t.title === 'object'
                            ? t.title[currentLang] || t.title.en
                            : t.title}
                        </option>
                      ))
                  ) : (
                    <option value={formData.topicId}>New / Manual Topic</option>
                  )}
                </select>
              </div>
            </div>

            <hr className={`my-2 ${theme.border}`} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Chapter ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.chapterId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, chapterId: e.target.value }))
                  }
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                />
              </div>
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Chapter Title ({currentLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  required
                  value={formData.chapterTitle[currentLang] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      chapterTitle: { ...prev.chapterTitle, [currentLang]: e.target.value }
                    }))
                  }
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                />
              </div>
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Topic ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.topicId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, topicId: e.target.value }))
                  }
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                />
              </div>
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                  Topic Title ({currentLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  required
                  value={formData.topicTitle[currentLang] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      topicTitle: { ...prev.topicTitle, [currentLang]: e.target.value }
                    }))
                  }
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SUBTOPICS (PARTS) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold ${theme.textMain}`}>2. Content Parts & MCQs</h2>
              <button
                type="button"
                onClick={handleAddSubtopic}
                className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> <span>Add New Part</span>
              </button>
            </div>

            {formData.subtopics.map((subtopic, sIdx) => (
              <div
                key={subtopic.id}
                className={`${theme.bgCard} border ${theme.border} p-5 md:p-8 rounded-2xl space-y-6 ${theme.cardShadow} relative`}
              >
                {formData.subtopics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtopic(sIdx)}
                    className="absolute top-4 right-4 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg transition-colors"
                    title="Remove this entire part"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <h3 className={`text-base font-bold ${theme.primary} mb-2`}>Part {sIdx + 1}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                      Part ID
                    </label>
                    <input
                      type="text"
                      required
                      value={subtopic.id}
                      onChange={(e) => handleSubtopicChange(sIdx, 'id', e.target.value)}
                      className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                      Part Title ({currentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      required
                      value={subtopic.title?.[currentLang] || ''}
                      onChange={(e) =>
                        handleSubtopicChange(sIdx, 'title', {
                          ...subtopic.title,
                          [currentLang]: e.target.value
                        })
                      }
                      className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-sm font-medium ${theme.textMuted}`}>
                      Est. Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={subtopic.duration}
                      onChange={(e) => handleSubtopicChange(sIdx, 'duration', e.target.value)}
                      className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                    />
                  </div>
                </div>

                {/* Rich HTML Editor with Custom Toolbar */}
                <div className="space-y-3">
                  <label className={`text-sm font-bold flex items-center gap-2 ${theme.textMain}`}>
                    <Code className="w-4 h-4 text-indigo-500" /> HTML Source Code (
                    {currentLang.toUpperCase()})
                  </label>

                  {/* HTML TAGS & SEO TOOLBAR */}
                  <div
                    className={`p-3 rounded-lg border flex flex-col gap-3 ${theme.inputBg} ${theme.border}`}
                  >
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${theme.textMuted}`}
                      >
                        <Highlighter className="w-3.5 h-3.5" /> Colors:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleHighlight(sIdx, 'yellow')}
                        className="w-5 h-5 rounded-full bg-yellow-400 border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                        title="Yellow"
                      />
                      <button
                        type="button"
                        onClick={() => handleHighlight(sIdx, 'blue')}
                        className="w-5 h-5 rounded-full bg-blue-400 border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                        title="Blue"
                      />
                      <button
                        type="button"
                        onClick={() => handleHighlight(sIdx, 'red')}
                        className="w-5 h-5 rounded-full bg-rose-400 border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                        title="Red"
                      />
                      <button
                        type="button"
                        onClick={() => handleHighlight(sIdx, 'orange')}
                        className="w-5 h-5 rounded-full bg-orange-400 border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                        title="Orange"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {htmlTags.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertTag(sIdx, tag.open, tag.close)}
                          className={`px-2 py-1 text-[11px] font-mono rounded border hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 transition-colors ${theme.border} ${theme.textMain} ${theme.bgCard}`}
                          title={`Insert <${tag.label}>`}
                        >
                          &lt;{tag.label}&gt;
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    id={`editor-${sIdx}`}
                    rows={8}
                    required
                    value={subtopic.content?.[currentLang] || ''}
                    onChange={(e) =>
                      handleSubtopicChange(sIdx, 'content', {
                        ...subtopic.content,
                        [currentLang]: e.target.value
                      })
                    }
                    className={`w-full border rounded-lg p-4 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                  />
                </div>

                {/* LIVE PREVIEW SECTION */}
                <div className={`mt-2 border rounded-xl overflow-hidden ${theme.border}`}>
                  <div
                    className={`px-4 py-2 border-b flex items-center gap-2 bg-slate-800/5 dark:bg-slate-800/30 ${theme.border}`}
                  >
                    <Eye className={`w-4 h-4 ${theme.primary}`} />
                    <h3 className={`text-xs font-bold ${theme.textMain}`}>
                      Live Preview (Part {sIdx + 1} - {currentLang.toUpperCase()})
                    </h3>
                  </div>
                  <div className={`p-5 ${theme.previewBg}`}>
                    <div
                      className={`prose max-w-none prose-sm leading-relaxed wrap-break-word ${theme.proseTheme}`}
                      dangerouslySetInnerHTML={{
                        __html: subtopic.content?.[currentLang] || ''
                      }}
                    />
                  </div>
                </div>

                {/* --- ADVANCED MCQ SECTION --- */}
                <div className={`pt-6 border-t ${theme.border} space-y-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className={`w-5 h-5 ${theme.primary}`} />
                      <h4 className={`text-base font-bold ${theme.textMain}`}>
                        Practice MCQs{' '}
                        <span className={`text-xs font-normal ${theme.textMuted}`}>
                          (For Part {sIdx + 1} - {currentLang.toUpperCase()})
                        </span>
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion(sIdx)}
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> <span>Add New Question</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {subtopic.questions.map((q, qIdx) => {
                      const optionsArr = getOptionsForLang(q);

                      return (
                        <div
                          key={qIdx}
                          className={`border p-5 rounded-2xl space-y-4 relative transition-all ${theme.bgMain} ${theme.border}`}
                        >
                          {/* Question Header & Remove Button */}
                          <div className="flex items-start justify-between gap-3">
                            <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shrink-0">
                              Q{qIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(sIdx, qIdx)}
                              className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-1.5 rounded-lg transition-colors shrink-0"
                              title="Delete this question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Question Input */}
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Enter question text..."
                              value={q.questionText?.[currentLang] || ''}
                              onChange={(e) =>
                                handleQuestionChange(sIdx, qIdx, 'questionText', {
                                  ...q.questionText,
                                  [currentLang]: e.target.value
                                })
                              }
                              className={`w-full border rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                            />
                          </div>

                          {/* Options Section */}
                          <div className="space-y-2.5">
                            <label
                              className={`block text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}
                            >
                              Options{' '}
                              <span className="normal-case font-normal text-slate-400">
                                (Click checkmark to select correct answer):
                              </span>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {optionsArr.map((opt, optIdx) => {
                                const isCorrect = q.correctOptionIndex === optIdx;
                                const banglaChar = banglaOptionLabels[optIdx] || optIdx + 1;

                                return (
                                  <div
                                    key={optIdx}
                                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                                      isCorrect
                                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-sm'
                                        : `${theme.border} ${theme.bgCard}`
                                    }`}
                                  >
                                    {/* Radio / Checkmark selector */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuestionChange(
                                          sIdx,
                                          qIdx,
                                          'correctOptionIndex',
                                          optIdx
                                        )
                                      }
                                      className={`p-1 rounded-full shrink-0 transition-transform active:scale-95 ${
                                        isCorrect
                                          ? 'text-emerald-600 dark:text-emerald-400'
                                          : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                                      }`}
                                      title="Mark as Correct Answer"
                                    >
                                      {isCorrect ? (
                                        <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-900" />
                                      ) : (
                                        <Circle className="w-5 h-5" />
                                      )}
                                    </button>

                                    <span
                                      className={`text-xs font-bold w-6 text-center uppercase shrink-0 ${
                                        isCorrect
                                          ? 'text-emerald-700 dark:text-emerald-300'
                                          : theme.textMuted
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)} ({banglaChar})
                                    </span>

                                    {/* Option Input */}
                                    <input
                                      type="text"
                                      required
                                      value={opt}
                                      onChange={(e) =>
                                        handleOptionChange(sIdx, qIdx, optIdx, e.target.value)
                                      }
                                      placeholder={`Option ${optIdx + 1}`}
                                      className={`w-full bg-transparent text-sm focus:outline-none ${theme.textMain}`}
                                    />

                                    {optionsArr.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveOption(sIdx, qIdx, optIdx)}
                                        className="text-slate-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 p-1 shrink-0"
                                        title="Remove option"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {optionsArr.length < 6 && (
                              <button
                                type="button"
                                onClick={() => handleAddOption(sIdx, qIdx)}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 pt-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Add Another Option
                              </button>
                            )}
                          </div>

                          {/* Explanation Field */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                            <label
                              className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider items-center gap-1.5 ${theme.textMuted}`}
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
                              Solution / Explanation ({currentLang.toUpperCase()})
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Explain why this option is correct..."
                              value={q.explanation?.[currentLang] || ''}
                              onChange={(e) =>
                                handleQuestionChange(sIdx, qIdx, 'explanation', {
                                  ...q.explanation,
                                  [currentLang]: e.target.value
                                })
                              }
                              className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed ${theme.inputBg} ${theme.border} ${theme.textMain}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {subtopic.questions.length === 0 && (
                      <div
                        className={`text-center py-8 border-2 border-dashed rounded-2xl ${theme.border}`}
                      >
                        <HelpCircle
                          className={`w-8 h-8 mx-auto mb-2 opacity-30 ${theme.textMuted}`}
                        />
                        <p className={`text-sm font-medium ${theme.textMuted}`}>
                          No MCQs added for Part {sIdx + 1} yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-base font-bold flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>Publish Full Multi-Language Curriculum</span>
          </button>
        </form>
      </div>
    </div>
  );
}