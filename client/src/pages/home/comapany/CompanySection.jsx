import React from 'react';
import { useTheme } from "../../../context/ThemeContext";
import GovtLogosBanner from "./GovtLogoBanner";

const CompanySection = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`w-full py-12 pb-4 transition-colors duration-300 ${
      darkMode ? "bg-slate-950" : "bg-slate-50/50"
    }`}>
      {/* Section Heading with Dynamic Text Colors */}
      <h2 className={`text-sm md:text-2xl font-bold text-center px-4 mb-4 transition-colors duration-300 ${
        darkMode ? "text-slate-200" : "text-slate-700"
      }`}>
        Crack BCS, Bank & Top Bangladesh Govt Job Exams
      </h2>

      {/* Govt Logos Infinite Banner */}
      <GovtLogosBanner />
    </div>
  );
};

export default CompanySection;