import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { blog_details_data } from "../../assets/assest.js";
import { useParams, useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import LastUpdate from "../../components/LastUpdate.jsx";
import Meta from "../../components/Meta.jsx";

const BlogDetails = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [blogData, setBlogData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const existingStats = JSON.parse(localStorage.getItem("blog_views") || "[]");
      const sessionKey = `viewed_${id}`;
      const hasViewed = sessionStorage.getItem(sessionKey);

      if (!hasViewed) {
        let updatedStats;
        const blogIndex = existingStats.findIndex((item) => item.id === id);

        if (blogIndex > -1) {
          updatedStats = [...existingStats];
          updatedStats[blogIndex].views += 1;
        } else {
          updatedStats = [...existingStats, { id: id, views: 1 }];
        }

        localStorage.setItem("blog_views", JSON.stringify(updatedStats));
        sessionStorage.setItem(sessionKey, "true");
      }
    }
  }, [id]);

  const fetchBlogData = () => {
    const singleBlog = blog_details_data.find((item) => item._id === id);
    if (singleBlog) {
      setBlogData(singleBlog);
    }
  };

  useEffect(() => {
    fetchBlogData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleMcqClick = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  if (!blogData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 dark:border-blue-500"></div>
        <p className="ml-4 mt-4 text-blue-900 dark:text-blue-400 font-bold">ডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300">
      <Meta title={blogData.title} keywords={blogData?.tags} description={blogData.article_content?.summary} />
      
      <article className="max-w-5xl mx-auto px-4 py-10 font-sans text-gray-800 dark:text-slate-100 mb-20 bg-white dark:bg-slate-900 shadow-sm rounded-b-3xl border-x border-b border-gray-200 dark:border-slate-800">
        <Breadcrumbs category="blog" customTitle={blogData?.title}/>

        {/* ১. শিরোনাম ও ট্যাগ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-400 mb-6 leading-tight">
            {blogData.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {blogData.tags?.map((tag, i) => (
              <span key={i} className="px-4 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-500 dark:text-slate-400 italic text-sm border-b dark:border-slate-800 pb-4 inline-block">
            <LastUpdate />
          </p>
        </motion.div>

        {/* ২. সংক্ষিপ্ত সারসংক্ষেপ */}
        <section className="bg-blue-50 dark:bg-slate-800/60 p-6 md:p-8 rounded-3xl border-l-8 border-blue-600 dark:border-blue-500 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-3 font-serif">সংক্ষিপ্ত সারসংক্ষেপ</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-slate-300 italic">
            {blogData.article_content?.summary}
          </p>
        </section>

        {/* ৩. মূল পয়েন্টসমূহ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-400 border-b-2 border-blue-100 dark:border-slate-800 pb-2">মূল পয়েন্টসমূহ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogData.article_content?.key_points?.map((point, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex items-start shadow-sm border border-blue-50 dark:border-slate-700">
                <span className="text-blue-600 dark:text-blue-400 font-bold mr-3 text-xl">●</span>
                <p className="text-gray-700 dark:text-slate-200 font-medium">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ৪. ভিজ্যুয়াল রিপ্রেজেন্টেশন */}
        <div className="my-12 text-center">
          <div className="overflow-hidden rounded-3xl shadow-lg border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
            {blogData.article_content?.visual_representation?.image_tag ? (
              <img
                src={blogData.article_content.visual_representation.image_tag}
                alt="Visual Content"
                className="w-full h-auto"
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 dark:text-slate-500 italic font-serif">
                [ইনফোগ্রাফিক চিত্র: {blogData.article_content?.visual_representation?.caption}]
              </div>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-slate-400 italic">
            {blogData.article_content?.visual_representation?.caption}
          </p>
        </div>

        {/* ৫. ডাইনামিক সেকশন (Table & Content) */}
        {blogData.article_content?.sections?.map((section, idx) => (
          <section key={idx} className="mb-12">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4">{section.heading}</h2>
            {section.content && (
              <p className="text-gray-700 dark:text-slate-300 mb-6 leading-relaxed bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border dark:border-slate-800">
                {section.content}
              </p>
            )}

            {section.table_data && (
              <div className="overflow-x-auto rounded-2xl shadow-md border dark:border-slate-800">
                <table className="w-full text-left bg-white dark:bg-slate-800 border-collapse">
                  <thead className="bg-blue-900 dark:bg-slate-950 text-white">
                    <tr>
                      <th className="p-4">বিষয়/টার্ম</th>
                      <th className="p-4">পূর্ণরূপ/বিস্তারিত ব্যাখ্যা</th>
                      <th className="p-4 text-center">গুরুত্ব/ব্যবহার/মূল লক্ষ্য</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {section?.table_data && section.table_data.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4 font-bold text-blue-800 dark:text-blue-300">
                          {row["সংস্থা"] || row.সংস্থা || row.অঞ্চল || row.দেশ}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-slate-300 font-medium">
                          {row["পূর্ণরূপ"] || row.পূর্ণরূপ || row.দেশসমূহ || row.রাজধানী}
                        </td>
                        <td className="p-4 italic text-blue-700 dark:text-blue-400 text-sm">
                          {row["লক্ষ্য"] || row.লক্ষ্য || row.বৈশিষ্ট্য}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {/* ৬. এমসিকিউ সেকশন */}
        <section className="bg-slate-900 dark:bg-slate-950 text-white p-6 md:p-10 rounded-3xl shadow-2xl mb-12 border dark:border-slate-800">
          <h2 className="text-3xl font-bold mb-8 flex items-center border-b border-slate-700 pb-4">
            <span className="mr-3">📝</span> প্রিলিমিনারি কুইজ
          </h2>
          <div className="space-y-8">
            {blogData.preliminary_exam_prep?.mcqs?.map((mcq) => {
              const questionKey = `${blogData._id}-${mcq.id}`;
              const selectedOption = selectedAnswers[questionKey];

              return (
                <div key={mcq.id} className="bg-slate-800 dark:bg-slate-900 p-6 rounded-2xl border border-slate-700 dark:border-slate-800 shadow-inner">
                  <p className="text-lg font-semibold mb-6">{mcq.id}. {mcq.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mcq.options?.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      const isCorrect = opt.trim().startsWith(mcq.answer.split(' ')[0]);

                      return (
                        <button
                          key={i}
                          disabled={!!selectedOption}
                          onClick={() => handleMcqClick(questionKey, opt)}
                          className={`text-left p-4 rounded-xl transition-all border-2 font-medium
                            ${isSelected
                              ? (isCorrect ? 'bg-green-600 border-green-400 text-white' : 'bg-red-600 border-red-400 text-white')
                              : 'bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-700 hover:border-blue-400 text-slate-100'
                            }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedOption && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border-l-4 border-green-500 overflow-hidden shadow-md"
                    >
                      <p className="font-bold text-blue-800 dark:text-blue-400 underline mb-1">সঠিক উত্তর: {mcq.answer}</p>
                      <p className="text-sm font-medium">ব্যাখ্যা: {mcq.explanation}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ৭. লিখিত পরীক্ষা প্রস্তুতি */}
        <section className="bg-amber-50 dark:bg-amber-950/20 p-6 md:p-8 rounded-3xl border-2 border-amber-100 dark:border-amber-900/40 shadow-sm">
          <h2 className="text-2xl font-black text-amber-900 dark:text-amber-400 mb-6 uppercase tracking-wider">✍️ লিখিত পরীক্ষা গাইডলাইন</h2>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl mb-8 border-l-4 border-amber-400 shadow-sm text-gray-700 dark:text-slate-300 italic">
            "{blogData.written_exam_prep?.guidelines}"
          </div>
          <div className="space-y-4">
            {blogData.written_exam_prep?.possible_questions?.map((q, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-3">প্রশ্ন {i + 1}: {q.question}</h3>
                <div className="flex flex-wrap gap-2">
                  {q.key_points_for_answer?.map((kp, ki) => (
                    <span key={ki} className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800"># {kp}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <div className="mt-10 flex justify-between items-center">
          <Breadcrumbs />
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate(-1);
            }}
            className="px-6 py-2.5 bg-blue-900 dark:bg-slate-800 text-white font-bold rounded-xl shadow hover:bg-blue-800 dark:hover:bg-slate-700 transition-all text-sm"
          >
            ← Back to List
          </button>
        </div>

        <hr className="mt-10 border-gray-100 dark:border-slate-800" />
      </article>
    </div>
  );
};


export default BlogDetails;