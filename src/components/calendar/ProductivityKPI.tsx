import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Download, TrendingUp, Flame, ChevronUp, ChevronDown } from 'lucide-react';

export const ProductivityKPI: React.FC = () => {
  const { currentRole } = useAuth();
  const { triggerPremiumFeature, showToast } = useApp();
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
    <div className="border-t border-[#2A2B2D] bg-[#161718] shrink-0 flex flex-col z-20 select-none transition-all duration-200">
      {/* 1. Minimalist Summary Header Strip (Always visible, exactly 32px height) */}
      <div className="h-8 px-3 sm:px-4 flex items-center justify-between hover:bg-[#1C1D1F] transition-colors">
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer min-w-0"
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#81C995] shrink-0" />
          <span className="text-xs font-medium text-[#E3E2E3] truncate">
            {language === 'vi' ? 'Hiệu suất tuần:' : 'Weekly Performance:'}{' '}
            <strong className="text-[#81C995] font-semibold">87.5% {language === 'vi' ? 'Hoàn thành' : 'Done'}</strong>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#9AA0A6] ml-2">
            <Flame className="w-3 h-3 text-[#FDD663]" />
            <span>21 {t('common.days')}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#333538] hover:border-[#8AB4F8] hover:bg-[#28292A] text-[#8AB4F8] text-[11px] font-medium transition-colors cursor-pointer"
            title={language === 'vi' ? 'Xuất báo cáo PDF' : 'Export PDF'}
          >
            <Download className="w-3 h-3 shrink-0" />
            <span className="hidden xs:inline">{language === 'vi' ? 'Xuất PDF' : 'Export'}</span>
          </button>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] transition-colors cursor-pointer"
            title={isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng chi tiết' : 'Expand')}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Detailed KPI Drawer (Collapsible) */}
      {isExpanded && (
        <div className="p-3 sm:p-4 border-t border-[#2A2B2D] bg-[#1A1B1D] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in slide-in-from-bottom duration-200">
          {/* Metric 1: Completion rate */}
          <div className="bg-[#242527] border border-[#333538] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#9AA0A6] font-medium text-[11px]">{t('kpi.productivityRate')}</span>
            <div className="pt-1.5">
              <div className="text-xl font-bold text-[#81C995] font-mono leading-none">87.5%</div>
              <span className="text-[10px] text-[#81C995] font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 flex-shrink-0" />
                <span>{language === 'vi' ? '+5.2% so với tuần trước' : '+5.2% vs last week'}</span>
              </span>
            </div>
          </div>

          {/* Metric 2: Discipline streak */}
          <div className="bg-[#242527] border border-[#333538] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#9AA0A6] font-medium text-[11px]">{t('kpi.activeStreak')}</span>
            <div className="pt-1.5">
              <div className="text-xl font-bold text-[#FDD663] flex items-center gap-1.5 font-mono leading-none">
                <Flame className="w-4 h-4 text-[#FDD663] flex-shrink-0" />
                <span>21 {t('common.days')}</span>
              </div>
              <span className="text-[10px] text-[#9AA0A6] truncate mt-1 block">
                {language === 'vi' ? 'Kỷ luật & Tập trung sâu' : 'Discipline & Deep Work'}
              </span>
            </div>
          </div>

          {/* Metric 3: Retention quota */}
          <div className="bg-[#242527] border border-[#333538] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#9AA0A6] font-medium text-[11px]">
              {language === 'vi' ? 'Thời gian lưu trữ dữ liệu' : 'Data Retention'}
            </span>
            <div className="pt-1.5">
              <div className="text-sm font-bold text-[#8AB4F8] truncate leading-none">
                {currentRole === 'FREE'
                  ? (language === 'vi' ? '7 Ngày Gần Nhất' : 'Last 7 Days')
                  : (language === 'vi' ? 'Toàn Thời Gian' : 'Lifetime Sync')}
              </div>
              <span className="text-[10px] text-[#9AA0A6] truncate mt-1 block">
                {language === 'vi' ? 'Đồng bộ hóa đám mây an toàn' : 'Secure Cloud Synchronization'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
