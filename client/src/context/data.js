import { 
  Award, 
  BarChart3, 
  BookOpen, 
  Compass, 
  Cpu, 
  Globe, 
  PenTool, 
  Smartphone, 
  Sparkles, 
  Target, 
  Timer, 
  Users, 
  Zap 
} from "lucide-react";

// --- All Categories Data ---
export const allCategories = [
  // Subject Categories
  { 
    name: "বাংলা ভাষা ও সাহিত্য", 
    count: "১,২০০+ প্রশ্ন", 
    icon: BookOpen, 
    iconColor: "text-pink-500",
    color: "from-pink-500 to-rose-500", 
    lightBg: "bg-pink-50", 
    border: "border-pink-100 dark:border-pink-500/20",
    navigateLink: "/bengali-mcq"
  },
  { 
    name: "ইংরেজি ভাষা ও সাহিত্য", 
    count: "৯৫০+ প্রশ্ন", 
    icon: Sparkles, 
    iconColor: "text-indigo-500",
    color: "from-indigo-500 to-blue-500", 
    lightBg: "bg-indigo-50",
    border: "border-indigo-100 dark:border-indigo-500/20",
    navigateLink: "/english-mcq"
  },
  { 
    name: "গাণিতিক যুক্তি ও মানসিক দক্ষতা", 
    count: "৮০০+ প্রশ্ন", 
    icon: Award, 
    iconColor: "text-amber-500",
    color: "from-amber-500 to-orange-500", 
    lightBg: "bg-amber-50", 
    border: "border-amber-100 dark:border-amber-500/20",
    navigateLink: "/math-mcq"
  },
  { 
    name: "বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী", 
    count: "১,৫০০+ প্রশ্ন", 
    icon: Compass, 
    iconColor: "text-emerald-500",
    color: "from-emerald-500 to-teal-500", 
    lightBg: "bg-emerald-50", 
    border: "border-emerald-100 dark:border-emerald-500/20",
    navigateLink: "/gk-mcq"
  },

  // Exam / Hub Categories
  { 
    name: "বিসিএস প্রিলিমিনারি", 
    count: "১২,৫০০+ প্রশ্ন", 
    icon: Globe, 
    iconColor: "text-indigo-600", 
    color: "from-indigo-500 to-blue-500",
    lightBg: "bg-indigo-50",
    border: "border-indigo-100 dark:border-indigo-500/20",
    navigateLink: "/mcq-hub" 
  },
  { 
    name: "ব্যাংক জবস", 
    count: "৮,২০০+ প্রশ্ন", 
    icon: Zap, 
    iconColor: "text-amber-500", 
    color: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    border: "border-amber-100 dark:border-amber-500/20",
    navigateLink: "/bank-mcq" 
  },
  { 
    name: "Test-Hub", 
    count: "Unlimited", 
    icon: Target, 
    iconColor: "text-indigo-500", 
    color: "from-indigo-500 to-purple-500",
    lightBg: "bg-indigo-50",
    border: "border-indigo-100 dark:border-indigo-500/20",
    navigateLink: "/test-hub" 
  },
  { 
    name: "প্রাথমিক শিক্ষক নিয়োগ", 
    count: "৫,০০০+ প্রশ্ন", 
    icon: BookOpen, 
    iconColor: "text-emerald-600", 
    color: "from-emerald-500 to-teal-500",
    lightBg: "bg-emerald-50",
    border: "border-emerald-100 dark:border-emerald-500/20",
    navigateLink: "/primary-mcq" 
  },
  { 
    name: "বিশ্ববিদ্যালয় ভর্তি", 
    count: "১৫,০০০+ প্রশ্ন", 
    icon: Smartphone, 
    iconColor: "text-rose-500", 
    color: "from-rose-500 to-pink-500",
    lightBg: "bg-rose-50",
    border: "border-rose-100 dark:border-rose-500/20",
    navigateLink: "/university-mcq" 
  },
  { 
    name: "Article Hub", 
    count: "১৫,০০০+ কন্টেন্ট", 
    icon: PenTool, 
    iconColor: "text-cyan-500", 
    color: "from-cyan-500 to-blue-500",
    lightBg: "bg-cyan-50",
    border: "border-cyan-100 dark:border-cyan-500/20",
    navigateLink: "/article-hub" 
  },
  { 
    name: "Previous Exam", 
    count: "বিগত বছরের প্রশ্ন", 
    icon: Timer, 
    iconColor: "text-orange-500", 
    color: "from-orange-500 to-amber-500",
    lightBg: "bg-orange-50",
    border: "border-orange-100 dark:border-orange-500/20",
    navigateLink: "/previous-exam" 
  },
  { 
    name: "Written Hub", 
    count: "লিখিত পরীক্ষার প্রস্তুতি", 
    icon: PenTool, 
    iconColor: "text-violet-500", 
    color: "from-violet-500 to-purple-500",
    lightBg: "bg-violet-50",
    border: "border-violet-100 dark:border-violet-500/20",
    navigateLink: "/written-hub" 
  }
];

// --- Main Feature Content ---
export const mainFeatures = [
  { 
    title: "Smart Analytics", 
    desc: "প্রতিটি টেস্টের পর আপনার শক্তির জায়গা এবং দুর্বলতা চিহ্নিত করুন AI এর মাধ্যমে।", 
    icon: BarChart3, 
    color: "bg-blue-500" 
  },
  { 
    title: "Real-time Ranking", 
    desc: "হাজারো পরীক্ষার্থীর মধ্যে আপনার সঠিক অবস্থান তাৎক্ষণিক জেনে নিন লাইভ লিডারবোর্ডে।", 
    icon: Users, 
    color: "bg-indigo-500" 
  },
  { 
    title: "Focus Mode", 
    desc: "বিক্ষিপ্ত চিন্তা ছাড়াই নিরবচ্ছিন্ন প্রস্তুতির জন্য রয়েছে আমাদের বিশেষ স্টাডি মুড।", 
    icon: Cpu, 
    color: "bg-pink-500" 
  },
  { 
    title: "Premium Content", 
    desc: "বিসিএস ক্যাডার এবং অভিজ্ঞ শিক্ষক দ্বারা সংগৃহীত বিশেষ নোট এবং লেকচার শিট।", 
    icon: Sparkles, 
    color: "bg-amber-500" 
  }
];