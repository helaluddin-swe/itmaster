import { blog_details_data } from "../../assets/assest";
import McqList from "../../components/McqList";
import ExamQCard from "../previousExamQ/ExamQCard";

export const Subjects_Based_MCQ = [
  {
    name: "All MCQ",
    mark: 100,
    icon: "🔥",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    isSpecial: true,
    tags: ["bcs", "full model test", "popular", "important"]
  },
  {
    name: "বাংলা সাহিত্য",
    mark: 35,
    icon: "📖",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    tags: ["প্রাচীন যুগ", "মধ্যযুগ", "আধুনিক যুগ", "রবীন্দ্রনাথ", "নজরুল", "মুক্তিযুদ্ধ"]
  },
  {
    name: "ইংরেজি ভাষা ও সাহিত্য",
    mark: 35,
    icon: "🔤",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    tags: ["Grammar", "Literature", "Parts of Speech", "Idioms", "Synonym", "Antonym"]
  },
  {
    name: "বাংলাদেশ বিষয়াবলি",
    mark: 30,
    icon: "🇧🇩",
    color: "bg-green-50 text-green-600 border-green-100",
    tags: ["ইতিহাস", "সংবিধান", "অর্থনীতি", "ভূগোল", "মুক্তিযুদ্ধ", "সাম্প্রতিক"]
  },
  {
    name: "আন্তর্জাতিক বিষয়াবলি",
    mark: 20,
    icon: "🌍",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    tags: ["জাতিসংঘ", "সংস্থা", "চুক্তি", "বৈশ্বিক ইতিহাস", "পরিবেশ", "মধ্যপ্রাচ্য"]
  },
  {
    name: "ভুগোল ও পরিবেশ",
    mark: 10,
    icon: "🗺️",
    color: "bg-teal-50 text-teal-600 border-teal-100",
    tags: ["দুর্যোগ ব্যবস্থাপনা", "আবহাওয়া", "জলবায়ু", "প্রাকৃতিক সম্পদ", "মানচিত্র"]
  },
  {
    name: "সাধারণ বিজ্ঞান",
    mark: 15,
    icon: "🔬",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    tags: ["ভৌত বিজ্ঞান", "জীববিজ্ঞান", "আধুনিক বিজ্ঞান", "মানবদেহ", "রোগব্যাধি"]
  },
  {
    name: "কম্পিউটার ও তথ্যপ্রযুক্তি",
    mark: 15,
    icon: "💻",
    color: "bg-slate-50 text-slate-700 border-slate-100",
    tags: ["Hardware", "Software", "Internet", "Cyber Security", "Networking"]
  },
  {
    name: "গাণিতিক যুক্তি",
    mark: 15,
    icon: "➗",
    color: "bg-red-50 text-red-600 border-red-100",
    tags: ["পাটিগণিত", "বীজগণিত", "জ্যামিতি", "পরিসংখ্যান", "সেট"]
  },
  {
    name: "মানসিক দক্ষতা",
    mark: 15,
    icon: "🧠",
    color: "bg-pink-50 text-pink-600 border-pink-100",
    tags: ["রিজনিং", "ভারবাল", "গাণিতিক ক্ষমতা", "স্থানিক সম্পর্ক"]
  },
  {
    name: "সুশাসন ও নৈতিকতা",
    mark: 10,
    icon: "⚖️",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    tags: ["নৈতিকতা", "মূল্যবোধ", "সুশাসন", "সামাজিক মূল্যবোধ"]
  },
];
export const subjects_Model_Test = [
  {
    name: "Popular Test",
    mark: 100,
    icon: "🔥",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    isSpecial: true,
    tags: ["bcs", "full model test", "popular", "important"]
  },
  {
    name: "বাংলা সাহিত্য",
    mark: 35,
    icon: "📖",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    tags: ["প্রাচীন যুগ", "মধ্যযুগ", "আধুনিক যুগ", "রবীন্দ্রনাথ", "নজরুল", "মুক্তিযুদ্ধ"]
  },
  {
    name: "ইংরেজি ভাষা ও সাহিত্য",
    mark: 35,
    icon: "🔤",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    tags: ["Grammar", "Literature", "Parts of Speech", "Idioms", "Synonym", "Antonym"]
  },
  {
    name: "বাংলাদেশ বিষয়াবলি",
    mark: 30,
    icon: "🇧🇩",
    color: "bg-green-50 text-green-600 border-green-100",
    tags: ["ইতিহাস", "সংবিধান", "অর্থনীতি", "ভূগোল", "মুক্তিযুদ্ধ", "সাম্প্রতিক"]
  },
  {
    name: "আন্তর্জাতিক বিষয়াবলি",
    mark: 20,
    icon: "🌍",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    tags: ["জাতিসংঘ", "সংস্থা", "চুক্তি", "বৈশ্বিক ইতিহাস", "পরিবেশ", "মধ্যপ্রাচ্য"]
  },
  {
    name: "ভুগোল ও পরিবেশ",
    mark: 10,
    icon: "🗺️",
    color: "bg-teal-50 text-teal-600 border-teal-100",
    tags: ["দুর্যোগ ব্যবস্থাপনা", "আবহাওয়া", "জলবায়ু", "প্রাকৃতিক সম্পদ", "মানচিত্র"]
  },
  {
    name: "সাধারণ বিজ্ঞান",
    mark: 15,
    icon: "🔬",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    tags: ["ভৌত বিজ্ঞান", "জীববিজ্ঞান", "আধুনিক বিজ্ঞান", "মানবদেহ", "রোগব্যাধি"]
  },
  {
    name: "কম্পিউটার ও তথ্যপ্রযুক্তি",
    mark: 15,
    icon: "💻",
    color: "bg-slate-50 text-slate-700 border-slate-100",
    tags: ["Hardware", "Software", "Internet", "Cyber Security", "Networking"]
  },
  {
    name: "গাণিতিক যুক্তি",
    mark: 15,
    icon: "➗",
    color: "bg-red-50 text-red-600 border-red-100",
    tags: ["পাটিগণিত", "বীজগণিত", "জ্যামিতি", "পরিসংখ্যান", "সেট"]
  },
  {
    name: "মানসিক দক্ষতা",
    mark: 15,
    icon: "🧠",
    color: "bg-pink-50 text-pink-600 border-pink-100",
    tags: ["রিজনিং", "ভারবাল", "গাণিতিক ক্ষমতা", "স্থানিক সম্পর্ক"]
  },
  {
    name: "সুশাসন ও নৈতিকতা",
    mark: 10,
    icon: "⚖️",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    tags: ["নৈতিকতা", "মূল্যবোধ", "সুশাসন", "সামাজিক মূল্যবোধ"]
  },
];


export const subjects = [
  {
    name: "Popular Blog",
    mark: 100,
    icon: "🔥",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    isSpecial: true,
  },

  {
    name: "বাংলা ভাষা ও সাহিত্য",
    mark: 30,
    icon: "📖",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    name: "ইংরেজি ভাষা ও সাহিত্য",
    mark: 30,
    icon: "🔤",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    name: "বাংলাদেশ বিষয়াবলি",
    mark: 25,
    icon: "🇧🇩",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  {
    name: "আন্তর্জাতিক বিষয়াবলি",
    mark: 25,
    icon: "🌍",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    name: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
    mark: 10,
    icon: "🗺️",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    name: "সাধারণ বিজ্ঞান",
    mark: 15,
    icon: "🔬",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    name: "কম্পিউটার ও তথ্যপ্রযুক্তি",
    mark: 15,
    icon: "💻",
    color: "bg-slate-50 text-slate-700 border-slate-100",
  },
  {
    name: "গাণিতিক যুক্তি",
    mark: 20,
    icon: "➗",
    color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    name: "মানসিক দক্ষতা",
    mark: 15,
    icon: "🧠",
    color: "bg-pink-50 text-pink-600 border-pink-100",
  },
  {
    name: "নৈতিকতা, মূল্যবোধ ও সুশাসন",
    mark: 15,
    icon: "⚖️",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
   {
    name: "Blog-MCQ",
    mark: 15,
    icon: "🗺️",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    component: McqList
    
  },
  {
    name: "Exam-MCQ",
    mark: 100,
    icon: "🗺️",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    component: ExamQCard
    
  },
];


export const MENU_DATA = subjects.map((subject) => {
  let matchedArticles = [];

  // 1. POPULAR BLOG LOGIC
  if (subject.name === "Popular Blog") {
    const storedViews = JSON.parse(localStorage.getItem("blog_views") || "[]");
    matchedArticles = blog_details_data
      .map((post) => {
        const viewData = storedViews.find((v) => v.id === post._id);
        return { ...post, views: viewData ? viewData.views : 0 };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  } 
  // 2. BLOG-MCQ LOGIC
  else if (subject.name === 'Blog-MCQ') {
    matchedArticles = blog_details_data.filter(post => 
      post.category?.includes("Blog-MCQ") || post.tags?.includes("MCQ")
    );
  }
  else if (subject.name === 'Exam-MCQ') {
    matchedArticles = blog_details_data.filter(post => 
      post.category?.includes("Exam-MCQ") || post.tags?.includes("MCQ")
    );
  }
  // 3. GENERAL SUBJECT FILTERING
  else {
    matchedArticles = blog_details_data.filter((post) => {
      const cat = post.category || "";
      const name = subject.name;
      return (
        cat.includes(name) ||
        (name === "বাংলাদেশ বিষয়াবলি" && (cat.includes("বাংলাদেশ") || cat.includes("Bangladesh"))) ||
        (name === "আন্তর্জাতিক বিষয়াবলি" && (cat.includes("আন্তর্জাতিক") || cat.includes("International"))) ||
        (name.includes("সাহিত্য") && cat.includes("সাহিত্য")) ||
        (name.includes("ইংরেজি") && (cat.includes("English") || cat.includes("ইংরেজি"))) ||
        (name.includes("বিজ্ঞান") && cat.includes("বিজ্ঞান")) ||
        (name.includes("ভূগোল") && (cat.includes("Geography") || cat.includes("ভূগোল") || cat.includes("পরিবেশ"))) ||
        (name.includes("কম্পিউটার") && (cat.includes("ICT") || cat.includes("তথ্যপ্রযুক্তি") || cat.includes("Computer"))) ||
        (name.includes("গাণিতিক") && (cat.includes("Math") || cat.includes("গণিত"))) ||
        (name.includes("মানসিক") && (cat.includes("Mental") || cat.includes("IQ"))) ||
        (name.includes("নৈতিকতা") && (cat.includes("Ethics") || cat.includes("মূল্যবোধ")))
      );
    });
  }

  return {
    id: subject.name.toLowerCase().replace(/\s+/g, "-"),
    label: subject.name,
    icon: subject.icon,
    color: subject.color,
    mark: subject.mark,
    isSpecial: subject.isSpecial || false,
    // This allows ArticleMenu to render the component if it exists
    component: subject.component || null, 

    articles: matchedArticles.map((post) => ({
      _id: post._id,
      title: post.title,
      summary: post.article_content?.summary || "সারাংশ পাওয়া যায়নি",
      tags: post.tags || [],
      views: post.views || 0,
      fullData: post,
    })),
  };
});



export const generatePopularTest = (allQuestions) => {
  const topics = [
    "বাংলা ভাষা ও সাহিত্য",
    "ইংরেজি ভাষা ও সাহিত্য",
    "বাংলাদেশ বিষয়াবলি",
    "আন্তর্জাতিক বিষয়াবলি",
    "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
    "সাধারণ বিজ্ঞান",
    "কম্পিউটার ও তথ্যপ্রযুক্তি",
    "গাণিতিক যুক্তি",
    "মানসিক দক্ষতা",
    "নৈতিকতা, মূল্যবোধ ও সুশাসন"
  ];

  let combinedTest = [];

  topics.forEach((topicName) => {
    // ১. ওই নির্দিষ্ট টপিকের প্রশ্নগুলো খুঁজে বের করা
    const topicQuestions = allQuestions[topicName] || [];
    
    // ২. প্রশ্নগুলোকে র‍্যান্ডমাইজ (Shuffle) করা
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    
    // ৩. প্রথম ১০টি ইউনিক প্রশ্ন নেওয়া
    const selected = shuffled.slice(0,10);
    
    combinedTest = [...combinedTest, ...selected];
  });

  // পুরো ১০০টি প্রশ্নকেও একবার মিক্স করে দেওয়া (ঐচ্ছিক)
  return combinedTest.sort(() => 0.5 - Math.random());
};


