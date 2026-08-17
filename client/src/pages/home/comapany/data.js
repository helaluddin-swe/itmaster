import { imgData } from "../../../assets/image";


export const CATEGORY_TYPES = {
  GENERAL_CADRE: "general_cadre",
  TECHNICAL_CADRE: "technical_cadre",
  BANK: "bank",
  OTHER_GOVT: "other_govt",
  NON_GOVT: "non_govt",
};

export const govtLogos = [
  // ==========================================
  // 1. BCS GENERAL CADRES
  // ==========================================
  {
    name: "BCS (Administration)",
    bengaliName: "বিসিএস (প্রশাসন)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Foreign Affairs)",
    bengaliName: "বিসিএস (পররাষ্ট্র)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Police)",
    bengaliName: "বিসিএস (পুলিশ)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Taxation)",
    bengaliName: "বিসিএস (কর)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Customs & Excise)",
    bengaliName: "বিসিএস (শুল্ক ও আবগারি)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Audit & Accounts)",
    bengaliName: "বিসিএস (নিরীক্ষা ও হিসাব)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Ansar)",
    bengaliName: "বিসিএস (আনসার)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Postal)",
    bengaliName: "বিসিএস (ডাক)",
    category: "General Cadre",
    mainCategory: CATEGORY_TYPES.GENERAL_CADRE,
    logo: imgData.bdLogo,
  },

  // ==========================================
  // 2. BCS TECHNICAL & PROFESSIONAL CADRES
  // ==========================================
  {
    name: "BCS (General Education)",
    bengaliName: "বিসিএস (সাধারণ শিক্ষা)",
    category: "Professional Cadre",
    mainCategory: CATEGORY_TYPES.TECHNICAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Health)",
    bengaliName: "বিসিএস (স্বাস্থ্য)",
    category: "Professional Cadre",
    mainCategory: CATEGORY_TYPES.TECHNICAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Agriculture)",
    bengaliName: "বিসিএস (কৃষি)",
    category: "Professional Cadre",
    mainCategory: CATEGORY_TYPES.TECHNICAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Public Works)",
    bengaliName: "বিসিএস (গণপূর্ত)",
    category: "Technical Cadre",
    mainCategory: CATEGORY_TYPES.TECHNICAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Roads & Highways)",
    bengaliName: "বিসিএস (সড়ক ও জনপথ)",
    category: "Technical Cadre",
    mainCategory: CATEGORY_TYPES.TECHNICAL_CADRE,
    logo: imgData.bdLogo,
  },
  {
    name: "BCS (Telecommunication)",
    bengaliName: "বিসিএস (টেলিকমিউনিকেশন)",
    category: "Technical Cadre",
    mainCategory: CATEGORY_TYPES.TECHNICAL_CADRE,
    logo: imgData.bdLogo,
  },

  // ==========================================
  // 3. BANK & FINANCIAL INSTITUTIONS
  // ==========================================
  {
    name: "Bangladesh Bank",
    bengaliName: "বাংলাদেশ ব্যাংক",
    category: "Central Bank",
    mainCategory: CATEGORY_TYPES.BANK,
    logo: imgData?.bdBank,
  },
  {
    name: "Sonali Bank PLC",
    bengaliName: "সোনালী ব্যাংক পিএলসি",
    category: "Govt Commercial Bank",
    mainCategory: CATEGORY_TYPES.BANK,
    logo: imgData.bdLogo,
  },
  {
    name: "Janata Bank PLC",
    bengaliName: "জনতা ব্যাংক পিএলসি",
    category: "Govt Commercial Bank",
    mainCategory: CATEGORY_TYPES.BANK,
    logo: imgData.bdLogo,
  },
  {
    name: "Agrani Bank PLC",
    bengaliName: "অগ্রণী ব্যাংক পিএলসি",
    category: "Govt Commercial Bank",
    mainCategory: CATEGORY_TYPES.BANK,
    logo: imgData.bdLogo,
  },
  {
    name: "Islami Bank PLC",
    bengaliName: "ইসলামী ব্যাংক বাংলাদেশ পিএলসি",
    category: "Private Bank",
    mainCategory: CATEGORY_TYPES.BANK,
    logo: imgData?.islamiBank,
  },
  {
    name: "bKash Limited",
    bengaliName: "বিকাশ লিমিটেড",
    category: "Fintech / MFS",
    mainCategory: CATEGORY_TYPES.BANK,
    logo: imgData.bdLogo,
  },

  // ==========================================
  // 4. OTHER GOVT JOBS & COMMISSIONS
  // ==========================================
  {
    name: "BPSC",
    bengaliName: "বাংলাদেশ সরকারি কর্ম কমিশন",
    category: "Commission",
    mainCategory: CATEGORY_TYPES.OTHER_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "Directorate of Primary Education (DPE)",
    bengaliName: "প্রাথমিক শিক্ষা অধিদপ্তর",
    category: "Primary Education",
    mainCategory: CATEGORY_TYPES.OTHER_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "NTRCA",
    bengaliName: "বেসরকারি শিক্ষক নিবন্ধন",
    category: "Teacher Certification",
    mainCategory: CATEGORY_TYPES.OTHER_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "BJSC",
    bengaliName: "বাংলাদেশ জুডিশিয়াল সার্ভিস",
    category: "Judicial Service",
    mainCategory: CATEGORY_TYPES.OTHER_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "National Board of Revenue (NBR)",
    bengaliName: "জাতীয় রাজস্ব বোর্ড",
    category: "Revenue & Tax",
    mainCategory: CATEGORY_TYPES.OTHER_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "Bangladesh Railway",
    bengaliName: "বাংলাদেশ রেলওয়ে",
    category: "Railway",
    mainCategory: CATEGORY_TYPES.OTHER_GOVT,
    logo: imgData.bdLogo,
  },

  // ==========================================
  // 5. NON-GOVT & CORPORATE SECTOR
  // ==========================================
  {
    name: "Grameenphone",
    bengaliName: "গ্রামীনফোন",
    category: "Telecom",
    mainCategory: CATEGORY_TYPES.NON_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "Robi Axiata Limited",
    bengaliName: "রবি আজিয়াটা লিমিটেড",
    category: "Telecom",
    mainCategory: CATEGORY_TYPES.NON_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "BRAC Bangladesh",
    bengaliName: "ব্র্যাক বাংলাদেশ",
    category: "NGO / Development",
    mainCategory: CATEGORY_TYPES.NON_GOVT,
    logo: imgData.bdLogo,
  },
  {
    name: "Square Pharmaceuticals PLC",
    bengaliName: "স্কয়ার ফার্মাসিউটিক্যালস",
    category: "Corporate / Pharma",
    mainCategory: CATEGORY_TYPES.NON_GOVT,
    logo: imgData.bdLogo,
  },
];
export const generalCadres = govtLogos.filter(item => item.mainCategory === CATEGORY_TYPES.GENERAL_CADRE);

export const technicalCadres = govtLogos.filter(item => item.mainCategory === CATEGORY_TYPES.TECHNICAL_CADRE);
export const bankJobs = govtLogos.filter(item => item.mainCategory === CATEGORY_TYPES.BANK);
export const otherGovtJobs = govtLogos.filter(item => item.mainCategory === CATEGORY_TYPES.OTHER_GOVT);
export const nonGovtJobs = govtLogos.filter(item => item.mainCategory === CATEGORY_TYPES.NON_GOVT);