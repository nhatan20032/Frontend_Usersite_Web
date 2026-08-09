import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Sparkles, Crown, Check } from 'lucide-react';

export const FlashSaleBanner: React.FC = () => {
  const { currentRole, activateFreeTrial } = useAuth();
  const { openModal } = useApp();
  const { language, t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div id="flashSaleBanner" className="apple-glass-surface px-4 py-1.5 min-h-[38px] text-xs flex flex-wrap items-center justify-between gap-3 border-b app-border flex-shrink-0 z-30 relative">
      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
        <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
          Flash Sale 2026
        </span>
        <span className="app-text-secondary text-[11px] font-medium truncate">
          {language === 'vi' ? (
            <>Gói Premium 1 năm ưu đãi <b>40%</b> còn <span className="font-bold text-blue-600 dark:text-sky-400">179.000đ</span></>
          ) : (
            <>1-Year Premium offer <b>40% OFF</b> at <span className="font-bold text-blue-600 dark:text-sky-400">$19.99</span></>
          )}
        </span>
        <span className="app-text-muted hidden sm:inline flex-shrink-0">&bull;</span>
        <div className="hidden sm:flex items-center gap-1.5 font-medium text-[11px] app-text-secondary apple-glass-pill px-2.5 py-0.5 rounded-full flex-shrink-0">
          <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span>{language === 'vi' ? 'Còn lại:' : 'Ends in:'}</span>
          <span className="font-bold text-blue-600 dark:text-sky-400 font-mono">{format2(timeLeft.hours)}</span>h :
          <span className="font-bold text-blue-600 dark:text-sky-400 font-mono">{format2(timeLeft.minutes)}</span>m :
          <span className="font-bold text-blue-600 dark:text-sky-400 font-mono">{format2(timeLeft.seconds)}</span>s
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {currentRole === 'TRIAL' ? (
          <div className="apple-glass-pill text-emerald-700 dark:text-emerald-300 font-semibold px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>{language === 'vi' ? 'Đang dùng thử (7 ngày)' : 'Active Trial (7 Days)'}</span>
          </div>
        ) : (
          <button
            onClick={activateFreeTrial}
            className="apple-glass-pill hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold px-3 py-1 rounded-xl text-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>{language === 'vi' ? 'Dùng thử 7 ngày' : '7-Day Free Trial'}</span>
          </button>
        )}

        <button
          onClick={() => openModal('checkout')}
          className="apple-btn-primary font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{t('sidebar.upgradeBtn')}</span>
        </button>
      </div>
    </div>
  );
};
