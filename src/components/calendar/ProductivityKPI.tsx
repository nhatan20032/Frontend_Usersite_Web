import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Download, TrendingUp, Flame } from 'lucide-react';

export const ProductivityKPI: React.FC = () => {
  const { currentRole } = useAuth();
  const { triggerPremiumFeature, showToast } = useApp();

  const handleExport = () => {
    if (currentRole === 'FREE') {
      triggerPremiumFeature('Xuất báo cáo PDF / Excel');
      return;
    }
    showToast('Đang kết xuất báo cáo', 'Tệp thống kê năng suất 30 ngày đang được tải xuống...', 'success');
  };

  return (
    <div className="apple-glass-card rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between text-xs">
        <div>
          <h4 className="font-bold text-sm app-text-primary">Phân tích năng suất cá nhân</h4>
          <p className="text-[11px] app-text-muted">Tổng hợp tỷ lệ kỷ luật hoàn thành thói quen & công việc</p>
        </div>
        <button
          onClick={handleExport}
          className="apple-glass-pill hover:bg-black/5 dark:hover:bg-white/10 font-bold px-3.5 py-2 rounded-2xl text-xs text-blue-600 dark:text-sky-400 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="apple-glass-pill p-4 rounded-2xl space-y-1">
          <span className="app-text-muted font-medium">Tỷ lệ hoàn thành thói quen</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">87.5%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +5.2% so với tuần trước
          </span>
        </div>

        <div className="apple-glass-pill p-4 rounded-2xl space-y-1">
          <span className="app-text-muted font-medium">Chuỗi Streak dài nhất</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>21 Ngày</span>
          </div>
          <span className="text-[11px] app-text-secondary">Thiền định & Hít thở sâu</span>
        </div>

        <div className="apple-glass-pill p-4 rounded-2xl space-y-1">
          <span className="app-text-muted font-medium">Thời gian lưu trữ dữ liệu</span>
          <div className="text-xl font-bold text-blue-600 dark:text-sky-400">
            {currentRole === 'FREE' ? '7 Ngày Gần Nhất' : 'Toàn Thời Gian (VIP)'}
          </div>
          <span className="text-[11px] app-text-muted">
            {currentRole === 'FREE' ? 'Gói FREE giới hạn lưu 7 ngày' : 'Lưu trữ dữ liệu báo cáo trọn đời'}
          </span>
        </div>
      </div>
    </div>
  );
};
