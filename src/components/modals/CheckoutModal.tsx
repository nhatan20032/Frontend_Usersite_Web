import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { subscriptionApi } from '../../api/subscriptionApi';
import type { SubscriptionPlanDto } from '../../types';
import { X, Copy } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { refreshProfile } = useAuth();
  const { activeModal, closeModal, showToast } = useApp();
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [planId, setPlanId] = useState('');
  const [coupon, setCoupon] = useState('');
  const [pending, setPending] = useState(false);
  const [order, setOrder] = useState<{ transactionCode: string; vietQrUrl: string; amount: number } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (activeModal !== 'checkout') return;
    let active = true; setOrder(null); setError('');
    subscriptionApi.getPlans().then(data => { if (active) { setPlans(data); setPlanId(data.find(p => p.originalPrice > 0)?.id || ''); } }).catch((e: Error) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [activeModal]);
  useEffect(() => {
    if (activeModal !== 'checkout') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'checkout') return null;
  const submit = async () => {
    if (pending || !planId) return;
    setPending(true); setError('');
    try { setOrder(await subscriptionApi.upgrade(planId, coupon || undefined, 3)); }
    catch (e) { setError((e as Error).message); }
    finally { setPending(false); }
  };
  const check = async () => {
    if (!order || pending) return;
    setPending(true);
    try {
      const result = await subscriptionApi.getTransactionStatus(order.transactionCode);
      if (result.isSuccess) { await refreshProfile(); showToast('Thanh toán thành công', result.planName || '', 'success'); closeModal(); }
      else setError(`Trạng thái thanh toán: ${result.status}`);
    } catch (e) { setError((e as Error).message); }
    finally { setPending(false); }
  };
  return <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
    <div role="dialog" aria-modal="true" aria-label="Thanh toán gói dịch vụ" className="bg-[var(--surface-container)] text-[var(--text-primary)] rounded-2xl p-6 max-w-md w-full space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Nâng cấp tài khoản</h2><button onClick={closeModal} aria-label="Đóng" className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"><X className="w-5 h-5" /></button></div>
      {error && <p role="alert" className="text-red-400">{error}</p>}
      {order ? (
        <div className="space-y-3.5 text-center">
          <div className="bg-white p-3 rounded-xl inline-block shadow-md">
            <img src={order.vietQrUrl} alt="Mã QR thanh toán VietQR" className="w-56 mx-auto" />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between bg-[var(--surface-container-high)] p-2 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Số tiền:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-[var(--google-blue)]">
                <span>{order.amount.toLocaleString('vi-VN')} đ</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(order.amount.toString());
                    showToast('Đã sao chép', 'Số tiền chuyển khoản', 'success');
                  }}
                  title="Sao chép số tiền"
                  aria-label="Sao chép số tiền"
                  className="p-1 hover:bg-[var(--surface-container)] rounded text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[var(--surface-container-high)] p-2 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Nội dung CK:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-[var(--text-primary)]">
                <span className="text-xs truncate max-w-[180px]">{order.transactionCode}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(order.transactionCode);
                    showToast('Đã sao chép', 'Mã giao dịch', 'success');
                  }}
                  title="Sao chép nội dung chuyển khoản"
                  aria-label="Sao chép nội dung chuyển khoản"
                  className="p-1 hover:bg-[var(--surface-container)] rounded text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Gói dịch vụ sẽ được kích hoạt tự động sau khi hệ thống nhận được giao dịch.
          </p>
          <button
            disabled={pending}
            onClick={check}
            className="bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-medium rounded-lg p-3 w-full text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {pending ? 'Đang kiểm tra giao dịch…' : 'Kiểm tra trạng thái thanh toán'}
          </button>
        </div>
      ) : <>
        <label className="block text-xs font-medium text-[var(--text-secondary)]">Gói dịch vụ
          <select value={planId} onChange={e => setPlanId(e.target.value)} className="w-full mt-1 bg-[var(--surface-container-high)] border border-[var(--border-subtle)] p-2 rounded text-sm text-[var(--text-primary)]">
            <option value="">Chọn gói</option>{plans.filter(p => p.originalPrice > 0).map(p => <option key={p.id} value={p.id}>{p.name} · {p.originalPrice.toLocaleString('vi-VN')} đ</option>)}
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--text-secondary)]">Mã giảm giá
          <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Nhập mã nếu có" className="w-full mt-1 bg-[var(--surface-container-high)] border border-[var(--border-subtle)] p-2 rounded text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]" />
        </label>
        {plans.length === 0 && <p className="text-xs text-[var(--text-muted)]">Chưa có gói dịch vụ được cấu hình.</p>}
        <button disabled={pending || !planId} onClick={submit} className="bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-medium rounded-lg p-3 w-full text-sm transition-colors cursor-pointer disabled:opacity-50">{pending ? 'Đang xử lý…' : 'Tạo mã thanh toán VietQR'}</button>
      </>}
    </div>
  </div>;
};
