export const Subjects_Based_MCQ = [
  {
    name: "All MCQ",
    mark: 100,
    icon: "🔥",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    isSpecial: true,
    tags: ["full test", "all subjects", "popular", "important"],
  },
  {
    name: "Structured Programming & C/C++",
    mark: 15,
    icon: "💻",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    tags: ["Pointers", "Memory Management", "C/C++", "Procedural Logic", "Functions"],
  },
  {
    name: "Object-Oriented Programming (Java/C#)",
    mark: 15,
    icon: "☕",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    tags: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction", "Design Patterns"],
  },
  {
    name: "Data Structures & Algorithms",
    mark: 20,
    icon: "⚡",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    tags: ["Trees", "Graphs", "Sorting", "Searching", "Time Complexity", "Arrays"],
  },
  {
    name: "Discrete Mathematics",
    mark: 10,
    icon: "📐",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    tags: ["Set Theory", "Propositional Logic", "Graph Theory", "Combinatorics"],
  },
  {
    name: "Digital Logic Design",
    mark: 10,
    icon: "🔌",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    tags: ["Boolean Algebra", "Logic Gates", "Combinational Circuits", "Sequential Circuits"],
  },
  {
    name: "Database Management Systems",
    mark: 15,
    icon: "🗄️",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    tags: ["SQL", "Relational Databases", "Normalization", "Indexing", "Transactions"],
  },
  {
    name: "Computer Architecture & Organization",
    mark: 10,
    icon: "⚙️",
    color: "bg-slate-50 text-slate-700 border-slate-100",
    tags: ["CPU Design", "Pipelining", "Memory Hierarchy", "ISA"],
  },
  {
    name: "Operating Systems",
    mark: 15,
    icon: "🖥️",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    tags: ["Process Scheduling", "Concurrency", "Memory Management", "Deadlocks"],
  },
  {
    name: "Computer Networks",
    mark: 15,
    icon: "🌐",
    color: "bg-sky-50 text-sky-600 border-sky-100",
    tags: ["OSI Model", "TCP/IP", "Routing", "Switching", "Protocols"],
  },
  {
    name: "Software & Web Engineering",
    mark: 15,
    icon: "🛠️",
    color: "bg-teal-50 text-teal-600 border-teal-100",
    tags: ["SDLC", "Web Frameworks", "System Modeling", "Agile", "Architecture"],
  },
  {
    name: "Cybersecurity & IT Service Management",
    mark: 10,
    icon: "🛡️",
    color: "bg-red-50 text-red-600 border-red-100",
    tags: ["Cryptography", "Network Security", "Threat Analysis", "ITIL"],
  },
  {
    name: "Artificial Intelligence & Neural Networks",
    mark: 10,
    icon: "🧠",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    tags: ["Machine Learning", "Deep Learning", "Search Algorithms", "Neural Networks"],
  },
];
export const examCategories = [
  {
    id: "cs-it-recruitment",
    name: "CS & IT Recruitment",
    mark: "100",
    icon: "💻",
    keywords: ["CS", "IT", "Assistant Programmer", "Software Engineer", "System Analyst"],
    note: "Public & Private Sector IT Officer Exams",
    exams: [
      "Assistant Programmer (Ministry/Govt)",
      "Assistant Network Engineer",
      "IT Officer (Public/Private Banks)",
      "System Analyst & Database Admin",
      "Lecturer (Computer Science)",
    ],
  },
  {
    id: "bcs-computer",
    name: "BCS & PSC Non-Cadre",
    mark: "200 / 100",
    icon: "🏛️",
    keywords: ["BCS", "PSC", "Non-Cadre", "Technical Cadre"],
    note: "BCS Professional & PSC Technical Exams",
    exams: [
      "BCS Technical / Professional Cadre",
      "PSC Non-Cadre IT Posts",
      "BPSC Senior Technical Officer",
      "46th BCS Computer & Tech Section",
      "45th BCS Computer & Tech Section",
    ],
  },
  {
    id: "psu-autonomous",
    name: "PSU & Autonomous Bodies",
    mark: "100",
    icon: "🏢",
    keywords: ["Autonomous", "BCC", "BTCL", "NSI", "ACC", "Power Sector"],
    note: "State Enterprises & Tech Organizations",
    exams: [
      "Bangladesh Computer Council (BCC)",
      "BTCL & Teletalk Executive Engineer",
      "Power Sector IT Officer (DESCO/DPDC)",
      "NSI & ACC Cyber Specialist",
      "BPC & Port Authority IT Posts",
    ],
  },
  {
    id: "bank-it",
    name: "Bank IT Specialists",
    mark: "100",
    icon: "🏦",
    keywords: ["Bank IT", "Bangladesh Bank AD", "Software Developer", "Security Officer"],
    note: "Central & Commercial Bank Technical Posts",
    exams: [
      "Bangladesh Bank AD (ICT)",
      "Combined Senior Officer (IT)",
      "Combined Officer (ICT / Hardware)",
      "Private Bank Software Engineer",
      "Cyber Security Specialist (Bank)",
    ],
  },
  {
    id: "software-engineering",
    name: "Software & Web Engineering",
    mark: "N/A",
    icon: "🛠️",
    keywords: ["Frontend", "Backend", "Full Stack", "Web Developer", "DevOps"],
    note: "Industry & Tech Assessment Tests",
    exams: [
      "Junior/Mid Software Engineer Test",
      "Frontend & UI Engineering Prep",
      "Backend & API Developer Test",
      "Full Stack Development Assessment",
      "DevOps & Cloud Engineer Screening",
    ],
  },
];

export const fetchMenuData = async () => {
  try {
    return examCategories.map((category) => {
      // Map the string array into the structure needed for your UI cards
      const examsList = category.exams.map((examName, index) => ({
        _id: `exam-${category.id}-${index}`,
        title: examName,
        specificExam: examName,
        examCategory: category.id,
        examYear: examName.match(/\d{4}/) ? examName.match(/\d{4}/)[0] : "Previous",
        views: Math.floor(Math.random() * 2000) + 100, // Dynamic placeholder
      }));

      return {
        ...category,
        label: category.name,
        articles: examsList, // Assign to articles so PreviousQuestionList can map over them
      };
    });
  } catch (error) {
    console.error("fetchMenuData Error:", error);
    return [];
  }
};