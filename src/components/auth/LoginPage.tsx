import React from 'react';
import { AuthForm } from './AuthForm';
import { AuthCarousel } from './AuthCarousel';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#1A73E8] selection:text-white relative bg-[#0F1011] text-[#E3E2E3]">
      {/* Floating Language Switcher Pill */}
      <div className="absolute top-6 right-6 z-20 flex items-center bg-[#1F2021] p-1 rounded-xl text-xs border border-[#333538] shadow-md">
        <button
          onClick={() => setLanguage('vi')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            language === 'vi'
              ? 'text-white bg-[#28292A] font-bold shadow-xs border border-[#3A3B3D]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
          title="Tiếng Việt"
        >
          <span>🇻🇳</span>
          <span className="text-[11px] tracking-wide">VI</span>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            language === 'en'
              ? 'text-white bg-[#28292A] font-bold shadow-xs border border-[#3A3B3D]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
          title="English"
        >
          <span>🇬🇧</span>
          <span className="text-[11px] tracking-wide">EN</span>
        </button>
      </div>

      {/* Main Split-Screen Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-[#2A2B2D] bg-[#161718] shadow-2xl min-h-[640px] relative z-10 overflow-hidden">
        <AuthForm />
        <AuthCarousel />
      </div>
    </div>
  );
};
