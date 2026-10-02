import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { subscriptionApi } from '../../api/subscriptionApi';
import { X, Crown, Sparkles, Check, Tag } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { upgradeToTier, setRole } = useAuth();
  const { activeModal, closeModal, showToast } = useApp();
  const { language, t } = useLanguage();

  const [selectedPlanMonths, setSelectedPlanMonths] = useState<number>(12);
  const [selectedPlanBasePrice, setSelectedPlanBasePrice] = useState<number>(179000);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('Gói Trọn Đời VIP (1 Năm)');
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (activeModal !== 'checkout') return null;

  const selectPlan = (months: number, price: number, name: string) => {
    setSelectedPlanMonths(months);
    setSelectedPlanBasePrice(price);
    setSelectedPlanName(name);
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await subscriptionApi.applyCoupon(code, selectedPlanBasePrice);
      setCouponDiscount(res.discountValue);
      setCouponMessage({
        text: res.message || (language === 'vi' ? `Áp dụng mã [${code}] thành công!` : `Coupon [${code}] applied!`),
        success: true,
      });
      showToast('Mã ưu đãi hợp lệ', `Giảm ${res.discountValue.toLocaleString()}đ`, 'success');
    } catch {
      // Fallback local logic for demo/offline
      if (code === 'VIP50' || code === 'PREMIUM50') {
        const discount = Math.round(selectedPlanBasePrice * 0.5);
        setCouponDiscount(discount);
        setCouponMessage({
          text: language === 'vi' ? `Áp dụng mã [${code}] thành công: Giảm 50%!` : `Coupon [${code}] applied: 50% off!`,
          success: true,
        });
        showToast('Mã ưu đãi hợp lệ', 'Giảm 50% trực tiếp vào đơn hàng.', 'success');
      } else if (code === 'TET2026' || code === 'PRO2026') {
        const discount = 30000;
        setCouponDiscount(discount);
        setCouponMessage({
          text: language === 'vi' ? `Áp dụng mã [${code}] thành công: Giảm 30.000đ!` : `Coupon [${code}] applied: $3.00 off!`,
          success: true,
        });
        showToast('Mã ưu đãi hợp lệ', 'Giảm 30.000đ trực tiếp vào đơn hàng.', 'success');
      } else {
        setCouponDiscount(0);
        setCouponMessage({
          text: language === 'vi' ? 'Mã ưu đãi không hợp lệ hoặc đã hết lượt!' : 'Coupon invalid or expired!',
          success: false,
        });
        showToast('Lỗi Coupon', 'Mã không hợp lệ.', 'error');
      }
    }
  };

  const finalPrice = Math.max(0, selectedPlanBasePrice - couponDiscount);

  const handleConfirmUpgrade = async () => {
    setIsProcessing(true);
    const targetTier = selectedPlanMonths >= 12 ? 'VIP' : 'PRO';

    try {
      // Try calling backend upgrade endpoint
      await subscriptionApi.upgrade('00000000-0000-0000-0000-000000000001', couponCode || undefined);
    } catch {
      // Continue client state update
    }

    setRole('PREMIUM_USER');
    upgradeToTier(targetTier, selectedPlanName);
    setIsProcessing(false);
    closeModal();

    showToast(
      language === 'vi' ? 'Nâng cấp thành công 🎉' : 'Upgrade Successful 🎉',
      language === 'vi'
        ? `Chúc mừng bạn đã sở hữu tài khoản RoutinePulse ${targetTier}!`
        : `Congratulations! You unlocked RoutinePulse ${targetTier}!`,
      'success',
      4000
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#1E1F20] border border-[#333538] max-w-md w-full rounded-2xl p-6 space-y-5 relative shadow-2xl text-[#E3E2E3]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#9AA0A6] hover:text-[#E3E2E3] p-1.5 rounded-full hover:bg-[#28292A] transition-colors cursor-pointer"
          title={language === 'vi' ? 'Đóng' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="bg-[#242527] border border-[#333538] text-[#FDD663] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1.5 w-fit">
            <Crown className="w-3 h-3 text-[#F9AB00]" /> {language === 'vi' ? 'Nâng cấp đặc quyền' : 'VIP Upgrade'}
          </span>
          <h3 className="text-base font-semibold text-[#E3E2E3] pt-1">RoutinePulse Premium PRO & VIP</h3>
          <p className="text-xs text-[#9AA0A6]">
            {t('modals.checkout.subtitle')}
          </p>
        </div>

        {/* Plan Selector Cards */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div
            onClick={() => selectPlan(1, 49000, 'Gói Pro 1 Tháng')}
            className={`p-3 rounded-xl cursor-pointer transition-all min-h-[92px] flex flex-col justify-between border ${
              selectedPlanMonths === 1
                ? 'bg-[#242527] border-2 border-[#1A73E8] shadow-sm'
                : 'bg-[#121314] border-[#2A2B2D] hover:border-[#3C4043]'
            }`}
          >
            <div className="font-semibold text-[#E3E2E3] truncate">{language === 'vi' ? '1 Tháng' : '1 Month'}</div>
            <div className="text-[#8AB4F8] font-bold mt-1 font-mono">
              {language === 'vi' ? '49.000đ' : '$1.99'}
            </div>
            <span className="text-[10px] text-[#9AA0A6]">Gói Pro</span>
          </div>

          <div
            onClick={() => selectPlan(6, 199000, 'Gói Pro 6 Tháng')}
            className={`p-3 rounded-xl cursor-pointer transition-all min-h-[92px] flex flex-col justify-between border ${
              selectedPlanMonths === 6
                ? 'bg-[#242527] border-2 border-[#1A73E8] shadow-sm'
                : 'bg-[#121314] border-[#2A2B2D] hover:border-[#3C4043]'
            }`}
          >
            <div className="font-semibold text-[#E3E2E3] truncate">{language === 'vi' ? '6 Tháng' : '6 Months'}</div>
            <div className="text-[#8AB4F8] font-bold mt-1 font-mono">
              {language === 'vi' ? '199.000đ' : '$7.99'}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Tiết kiệm 30%</span>
          </div>

          <div
            onClick={() => selectPlan(12, 299000, 'Gói Trọn Đời VIP (1 Năm)')}
            className={`p-3 rounded-xl cursor-pointer transition-all min-h-[92px] flex flex-col justify-between relative overflow-hidden border ${
              selectedPlanMonths === 12
                ? 'bg-[#242527] border-2 border-[#F9AB00] shadow-sm'
                : 'bg-[#121314] border-[#2A2B2D] hover:border-[#3C4043]'
            }`}
          >
            <div className="absolute top-0 right-0 bg-[#F9AB00] text-[#121314] text-[8px] font-black px-1.5 py-0.5 rounded-bl">
              HOT
            </div>
            <div className="font-semibold text-[#E3E2E3] truncate">{language === 'vi' ? '12 Tháng' : '1 Year'}</div>
            <div className="text-[#FDD663] font-bold mt-1 font-mono">
              {language === 'vi' ? '299.000đ' : '$11.99'}
            </div>
            <span className="text-[10px] text-[#FDD663] font-medium">VIP Crown</span>
          </div>
        </div>

        {/* Feature Matrix Box */}
        <div className="bg-[#121314] border border-[#2A2B2D] p-3.5 rounded-xl text-xs space-y-2">
          <div className="font-semibold text-[#E3E2E3] flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#F9AB00]" />
            <span>{language === 'vi' ? 'Đặc quyền được mở khóa ngay:' : 'Instant unlocked features:'}</span>
          </div>
          <ul className="text-[11px] text-[#9AA0A6] space-y-1.5">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Không giới hạn công việc & Thói quen chu kỳ nâng cao</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Trợ lý AI phân rã & Lập kế hoạch thông minh</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cảnh báo thời gian di chuyển (Travel Time Alert)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Mở khóa toàn bộ Theme VIP (Tết, Sakura, Cyberpunk)</span>
            </li>
          </ul>
        </div>

        {/* Coupon Input Area */}
        <div className="space-y-1.5 text-xs">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-[#70757A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Mã ưu đãi (vd: TET2026, VIP50)"
                className="w-full bg-[#121314] border border-[#333538] rounded-lg pl-9 pr-3 py-2 text-xs font-mono font-medium text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-[#28292A] hover:bg-[#333538] text-[#8AB4F8] font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer text-xs"
            >
              Áp dụng
            </button>
          </div>
          {couponMessage && (
            <p className={`text-[11px] font-medium ${couponMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
              {couponMessage.text}
            </p>
          )}
        </div>

        {/* Total & Checkout Action */}
        <div className="pt-3 border-t border-[#2A2B2D] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#9AA0A6]">{language === 'vi' ? 'Tổng thanh toán:' : 'Total Amount:'}</span>
            <div className="text-base font-bold text-[#8AB4F8] font-mono">
              {finalPrice.toLocaleString()}đ
            </div>
          </div>
          <button
            onClick={handleConfirmUpgrade}
            disabled={isProcessing}
            className="bg-[#8AB4F8] hover:bg-[#A8C8FF] text-[#121314] font-semibold py-2.5 px-5 rounded-full text-xs shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Crown className="w-4 h-4 text-[#121314] fill-[#121314]" />
            <span>{isProcessing ? 'Đang xử lý...' : (language === 'vi' ? 'Xác nhận Nâng cấp' : 'Confirm Upgrade')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
