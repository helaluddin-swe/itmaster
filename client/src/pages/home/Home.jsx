import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar';
import HeroSection from './HeroSection';
import CompanySection from './comapany/CompanySection.jsx';
import FeatureSection from './feature/FeatureSection.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Footer from '../../components/Footer.jsx';

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'} font-sans`}>
      <Helmet>
        <title>BackendMaster | HOME</title>
      </Helmet>

      <Navbar />
      <HeroSection />

      <main className="max-w-7xl mx-auto ">
        <CompanySection />
        <FeatureSection />
        <Footer/>
      </main>
    </div>
  );
};

export default Home;