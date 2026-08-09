import React from 'react';
import { AuthForm } from './AuthForm';
import { AuthCarousel } from './AuthCarousel';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-blue-600 selection:text-white relative bg-slate-100">
      {/* Ambient Iridescent Meshes */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Main Split-Screen Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-[32px] overflow-hidden liquid-portal-card min-h-[660px] relative z-10">
        <AuthForm />
        <AuthCarousel />
      </div>
    </div>
  );
};
