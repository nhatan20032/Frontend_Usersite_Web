import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Crown } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { setRole } = useAuth();
  const { activeModal, closeModal, showToast } = useApp();
  const { language, t } = useLanguage();

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
      setCouponMessage({
        text: language === 'vi' ? `Áp dụng mã [${code}] thành công: Giảm thêm 30.000đ!` : `Coupon [${code}] applied: Extra $3.00 off!`,
        success: true,
      });
      showToast(language === 'vi' ? 'Mã ưu đãi hợp lệ' : 'Coupon Valid', language === 'vi' ? 'Giảm thêm 30.000đ.' : 'Extra discount applied.', 'success');
    } else {
      setCouponDiscount(0);
      setCouponMessage({
        text: language === 'vi' ? 'Mã ưu đãi không hợp lệ hoặc đã hết hạn!' : 'Coupon invalid or expired!',
        success: false,
      });
      showToast(language === 'vi' ? 'Lỗi Coupon' : 'Coupon Error', language === 'vi' ? 'Mã không hợp lệ.' : 'Invalid coupon code.', 'error');
    }
  };

  const finalPrice = Math.max(0, selectedPlanBasePrice - couponDiscount);

  const handleConfirmUpgrade = () => {
    setRole('PREMIUM');
    closeModal();
    showToast(
      language === 'vi' ? 'Nâng cấp thành công' : 'Upgrade Successful',
      language === 'vi' ? 'Chúc mừng bạn đã sở hữu tài khoản RoutinePulse Premium VIP!' : 'Congratulations! You unlocked RoutinePulse VIP Pro!',
      'success',
      4000
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-md w-full rounded-[28px] p-6 sm:p-8 space-y-5 relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-500/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="apple-glass-pill text-amber-600 dark:text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 w-fit">
            <Crown className="w-3 h-3 text-amber-500" /> {language === 'vi' ? 'Nâng cấp dịch vụ' : 'VIP Upgrade'}
          </span>
          <h3 className="text-lg font-bold app-text-primary pt-1">RoutinePulse Premium VIP</h3>
          <p className="text-xs app-text-muted">
            {t('modals.checkout.subtitle')}
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
            <div className="font-bold app-text-primary">{language === 'vi' ? '1 Tháng' : '1 Month'}</div>
            <div className="text-blue-600 dark:text-sky-400 font-bold mt-1 font-mono">
              {language === 'vi' ? '49.000đ' : '$1.99'}
            </div>
          </div>

          <div
            onClick={() => selectPlan(6, 199000)}
            className={`p-3 rounded-2xl cursor-pointer transition-all ${
              selectedPlanMonths === 6
                ? 'bg-blue-500/15 border-2 border-blue-500'
                : 'apple-glass-pill hover:border-blue-500'
            }`}
          >
            <div className="font-bold app-text-primary">{language === 'vi' ? '6 Tháng' : '6 Months'}</div>
            <div className="text-blue-600 dark:text-sky-400 font-bold mt-1 font-mono">
              {language === 'vi' ? '199.000đ' : '$9.99'}
            </div>
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
            <div className="font-bold text-blue-700 dark:text-sky-300">{language === 'vi' ? '1 Năm' : '1 Year'}</div>
            <div className="text-blue-600 dark:text-sky-400 font-bold mt-1 font-mono">
              {language === 'vi' ? '179.000đ' : '$19.99'}
            </div>
          </div>
        </div>

        {/* Coupon Code Input */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold app-text-primary">{language === 'vi' ? 'Mã giảm giá (Coupon):' : 'Coupon Code:'}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="TET2026 / VIP50"
              className="apple-input px-3.5 py-2 text-xs uppercase font-mono tracking-wider flex-1 font-sans"
            />
            <button
              onClick={handleApplyCoupon}
              className="apple-glass-pill hover:bg-slate-200/80 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white px-4 py-2 rounded-2xl font-bold transition-all cursor-pointer"
            >
              {language === 'vi' ? 'Áp dụng' : 'Apply'}
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
            <span>{language === 'vi' ? 'Giá gốc gói cước:' : 'Original Price:'}</span>
            <span className="font-mono">{language === 'vi' ? '299.000đ' : '$35.99'}</span>
          </div>
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>{language === 'vi' ? 'Khuyến mãi Flash Sale:' : 'Flash Sale Discount:'}</span>
            <span className="font-mono">{language === 'vi' ? '-120.000đ' : '-$15.00'}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>{language === 'vi' ? 'Khấu trừ Coupon:' : 'Coupon Discount:'}</span>
              <span className="font-mono">{language === 'vi' ? `-${couponDiscount.toLocaleString('vi-VN')}đ` : '-$3.00'}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm app-text-primary pt-2 border-t app-border">
            <span>{language === 'vi' ? 'Tổng thanh toán:' : 'Total Due:'}</span>
            <span className="text-blue-600 dark:text-sky-400 text-lg font-bold font-mono">
              {language === 'vi' ? `${finalPrice.toLocaleString('vi-VN')}đ` : `$${(finalPrice / 25000).toFixed(2)}`}
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirmUpgrade}
          className="w-full apple-btn-primary font-bold py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          {t('modals.checkout.checkoutBtn')}
        </button>
      </div>
    </div>
  );
};
