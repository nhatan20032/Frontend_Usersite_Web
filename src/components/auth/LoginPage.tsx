import React from 'react';
import { AuthForm } from './AuthForm';
import { AuthCarousel } from './AuthCarousel';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-blue-600 selection:text-white relative bg-slate-100">
      {/* Ambient Iridescent Meshes */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Floating Language Switcher Pill */}
      <div className="absolute top-6 right-6 z-20 flex items-center apple-glass-pill p-1 rounded-2xl text-xs border border-slate-300/80 shadow-md">
        <button
          onClick={() => setLanguage('vi')}
          className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            language === 'vi'
              ? 'text-slate-950 bg-white font-extrabold shadow-sm border border-black/10'
              : 'text-slate-700 hover:text-slate-950 font-bold'
          }`}
          title="Tiếng Việt"
        >
          <span>🇻🇳</span>
          <span className="text-[11px] tracking-wide">VI</span>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            language === 'en'
              ? 'text-slate-950 bg-white font-extrabold shadow-sm border border-black/10'
              : 'text-slate-700 hover:text-slate-950 font-bold'
          }`}
          title="English"
        >
          <span>🇬🇧</span>
          <span className="text-[11px] tracking-wide">EN</span>
        </button>
      </div>

      {/* Main Split-Screen Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-[32px] overflow-hidden liquid-portal-card min-h-[660px] relative z-10">
        <AuthForm />
        <AuthCarousel />
      </div>
    </div>
  );
};
