import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Download, TrendingUp, Flame } from 'lucide-react';

export const ProductivityKPI: React.FC = () => {
  const { currentRole } = useAuth();
  const { triggerPremiumFeature, showToast } = useApp();
  const { language, t } = useLanguage();

  const handleExport = () => {
    if (currentRole === 'FREE') {
      triggerPremiumFeature(language === 'vi' ? 'Xuất báo cáo PDF / Excel' : 'Export PDF / Excel Report');
      return;
    }
    showToast(
      language === 'vi' ? 'Đang kết xuất báo cáo' : 'Generating Report',
      language === 'vi' ? 'Tệp thống kê năng suất 30 ngày đang được tải xuống...' : '30-day productivity statistics file downloading...',
      'success'
    );
  };

  return (
    <div className="apple-glass-card rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between text-xs">
        <div>
          <h4 className="font-bold text-sm app-text-primary">{t('kpi.title')}</h4>
          <p className="text-[11px] app-text-muted">{t('kpi.motivationTip')}</p>
        </div>
        <button
          onClick={handleExport}
          className="apple-glass-pill hover:bg-blue-500/15 font-bold px-3.5 py-2 rounded-2xl text-xs text-blue-600 dark:text-sky-400 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'vi' ? 'Xuất báo cáo (PDF)' : 'Export Report (PDF)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="apple-glass-pill p-4 rounded-2xl space-y-1">
          <span className="app-text-muted font-medium">{t('kpi.productivityRate')}</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">87.5%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {language === 'vi' ? '+5.2% so với tuần trước' : '+5.2% vs last week'}
          </span>
        </div>

        <div className="apple-glass-pill p-4 rounded-2xl space-y-1">
          <span className="app-text-muted font-medium">{t('kpi.activeStreak')}</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>21 {t('common.days')}</span>
          </div>
          <span className="text-[11px] app-text-secondary">{language === 'vi' ? 'Thiền định & Hít thở sâu' : 'Meditation & Deep Breath'}</span>
        </div>

        <div className="apple-glass-pill p-4 rounded-2xl space-y-1">
          <span className="app-text-muted font-medium">{language === 'vi' ? 'Thời gian lưu trữ dữ liệu' : 'Data Retention'}</span>
          <div className="text-xl font-bold text-blue-600 dark:text-sky-400">
            {currentRole === 'FREE'
              ? (language === 'vi' ? '7 Ngày Gần Nhất' : 'Last 7 Days')
              : (language === 'vi' ? 'Toàn Thời Gian (VIP)' : 'Lifetime Sync (VIP)')}
          </div>
          <span className="text-[11px] app-text-muted">
            {currentRole === 'FREE'
              ? (language === 'vi' ? 'Gói FREE giới hạn lưu 7 ngày' : 'Free tier limits to 7 days history')
              : (language === 'vi' ? 'Lưu trữ dữ liệu báo cáo trọn đời' : 'Lifetime storage for all data')}
          </span>
        </div>
      </div>
    </div>
  );
};
