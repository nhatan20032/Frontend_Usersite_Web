import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, Crown } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { setRole } = useAuth();
  const { activeModal, closeModal, showToast } = useApp();

  const [selectedPlanMonths, setSelectedPlanMonths] = useState<number>(12);
  const [selectedPlanBasePrice, setSelectedPlanBasePrice] = useState<number>(179000);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (activeModal !== 'checkout') return null;

  const selectPlan = (months: number, price: number) => {
    setSelectedPlanMonths(months);
    setSelectedPlanBasePrice(price);
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'TET2026' || code === 'VIP50' || code === 'PREMIUM50') {
      setCouponDiscount(30000);
      setCouponMessage({ text: `Áp dụng mã [${code}] thành công: Giảm thêm 30.000đ!`, success: true });
      showToast('Mã ưu đãi hợp lệ', 'Giảm thêm 30.000đ.', 'success');
    } else {
      setCouponDiscount(0);
      setCouponMessage({ text: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn!', success: false });
      showToast('Lỗi Coupon', 'Mã không hợp lệ.', 'error');
    }
  };

  const finalPrice = Math.max(0, selectedPlanBasePrice - couponDiscount);

  const handleConfirmUpgrade = () => {
    setRole('PREMIUM');
    closeModal();
    showToast('Nâng cấp thành công', 'Chúc mừng bạn đã sở hữu tài khoản RoutinePulse Premium VIP!', 'success', 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-md w-full rounded-[28px] p-6 sm:p-8 space-y-5 relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 app-text-muted hover:app-text-primary p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="apple-glass-pill text-amber-600 dark:text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 w-fit">
            <Crown className="w-3 h-3 text-amber-500" /> Nâng cấp dịch vụ
          </span>
          <h3 className="text-lg font-bold app-text-primary pt-1">RoutinePulse Premium VIP</h3>
          <p className="text-xs app-text-muted">
            Mở khóa đồng bộ không giới hạn thiết bị, bản đồ AI và toàn bộ Theme
          </p>
        </div>

        {/* Plan Selector Cards */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div
            onClick={() => selectPlan(1, 49000)}
            className={`p-3 rounded-2xl cursor-pointer transition-all ${
              selectedPlanMonths === 1
                ? 'bg-blue-500/15 border-2 border-blue-500'
                : 'apple-glass-pill hover:border-blue-500'
            }`}
          >
            <div className="font-bold app-text-primary">1 Tháng</div>
            <div className="text-blue-600 dark:text-sky-400 font-bold mt-1">49.000đ</div>
          </div>

          <div
            onClick={() => selectPlan(6, 199000)}
            className={`p-3 rounded-2xl cursor-pointer transition-all ${
              selectedPlanMonths === 6
                ? 'bg-blue-500/15 border-2 border-blue-500'
                : 'apple-glass-pill hover:border-blue-500'
            }`}
          >
            <div className="font-bold app-text-primary">6 Tháng</div>
            <div className="text-blue-600 dark:text-sky-400 font-bold mt-1">199.000đ</div>
          </div>

          <div
            onClick={() => selectPlan(12, 179000)}
            className={`p-3 rounded-2xl cursor-pointer transition-all relative ${
              selectedPlanMonths === 12
                ? 'bg-blue-500/15 border-2 border-blue-500'
                : 'apple-glass-pill hover:border-blue-500'
            }`}
          >
            <span className="absolute -top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 rounded-full uppercase">
              HOT -40%
            </span>
            <div className="font-bold text-blue-700 dark:text-sky-300">1 Năm</div>
            <div className="text-blue-600 dark:text-sky-400 font-bold mt-1">179.000đ</div>
          </div>
        </div>

        {/* Coupon Code Input */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold app-text-primary">Mã giảm giá (Coupon):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="TET2026 hoặc VIP50"
              className="apple-input px-3.5 py-2 text-xs uppercase font-mono tracking-wider flex-1 font-sans"
            />
            <button
              onClick={handleApplyCoupon}
              className="apple-glass-pill hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 rounded-2xl font-bold transition-all cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
          {couponMessage && (
            <div
              className={`text-[11px] font-bold ${
                couponMessage.success
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {couponMessage.text}
            </div>
          )}
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-1.5 text-xs app-text-secondary border-t app-border pt-3">
          <div className="flex justify-between">
            <span>Giá gốc gói cước:</span>
            <span>299.000đ</span>
          </div>
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Khuyến mãi Flash Sale:</span>
            <span>-120.000đ</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Khấu trừ Coupon:</span>
              <span>-{couponDiscount.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm app-text-primary pt-2 border-t app-border">
            <span>Tổng thanh toán:</span>
            <span className="text-blue-600 dark:text-sky-400 text-lg font-bold">
              {finalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirmUpgrade}
          className="w-full apple-btn-primary font-bold py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
};
