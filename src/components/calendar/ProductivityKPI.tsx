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
    <div className="bg-[#1F2021] border border-[#2A2B2D] rounded-xl p-4 sm:p-5 space-y-4 select-none">
      <div className="flex items-center justify-between text-xs gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-[#E3E2E3] truncate">{t('kpi.title')}</h4>
          <p className="text-[11px] text-[#9AA0A6] truncate">{t('kpi.motivationTip')}</p>
        </div>
        <button
          onClick={handleExport}
          className="border border-[#333538] hover:border-[#8AB4F8] hover:bg-[#28292A] text-[#8AB4F8] font-medium px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="whitespace-nowrap">{language === 'vi' ? 'Xuất báo cáo (PDF)' : 'Export Report (PDF)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Metric 1: Completion rate */}
        <div className="bg-[#28292A] border border-[#333538] p-3.5 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[#9AA0A6] font-medium text-[11px]">{t('kpi.productivityRate')}</span>
          <div className="pt-2">
            <div className="text-2xl font-bold text-[#81C995] font-mono leading-none">87.5%</div>
            <span className="text-[10px] text-[#81C995] font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
              <span>{language === 'vi' ? '+5.2% so với tuần trước' : '+5.2% vs last week'}</span>
            </span>
          </div>
        </div>

        {/* Metric 2: Discipline streak */}
        <div className="bg-[#28292A] border border-[#333538] p-3.5 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[#9AA0A6] font-medium text-[11px]">{t('kpi.activeStreak')}</span>
          <div className="pt-2">
            <div className="text-2xl font-bold text-[#FDD663] flex items-center gap-1.5 font-mono leading-none">
              <Flame className="w-5 h-5 text-[#FDD663] flex-shrink-0" />
              <span>21 {t('common.days')}</span>
            </div>
            <span className="text-[10px] text-[#9AA0A6] truncate mt-1 block">
              {language === 'vi' ? 'Thiền định & Hít thở sâu' : 'Meditation & Deep Breath'}
            </span>
          </div>
        </div>

        {/* Metric 3: Retention quota */}
        <div className="bg-[#28292A] border border-[#333538] p-3.5 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[#9AA0A6] font-medium text-[11px]">
            {language === 'vi' ? 'Thời gian lưu trữ dữ liệu' : 'Data Retention'}
          </span>
          <div className="pt-2">
            <div className="text-lg font-bold text-[#8AB4F8] truncate leading-none">
              {currentRole === 'FREE'
                ? (language === 'vi' ? '7 Ngày Gần Nhất' : 'Last 7 Days')
                : (language === 'vi' ? 'Toàn Thời Gian (VIP)' : 'Lifetime Sync (VIP)')}
            </div>
            <span className="text-[10px] text-[#9AA0A6] truncate mt-1 block">
              {currentRole === 'FREE'
                ? (language === 'vi' ? 'Gói FREE giới hạn lưu 7 ngày' : 'Free tier limits to 7 days history')
                : (language === 'vi' ? 'Lưu trữ dữ liệu báo cáo trọn đời' : 'Lifetime storage for all data')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
