import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { subscriptionApi } from '../../api/subscriptionApi';
import type { SubscriptionPlanDto } from '../../types';

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
      <div className="flex justify-between"><h2>Nâng cấp tài khoản</h2><button onClick={closeModal} aria-label="Đóng">×</button></div>
      {error && <p role="alert" className="text-red-400">{error}</p>}
      {order ? <>
        <img src={order.vietQrUrl} alt="Mã QR thanh toán từ máy chủ" className="w-60 mx-auto" />
        <p>{order.amount.toLocaleString('vi-VN')} đ · {order.transactionCode}</p>
        <p>Gói chỉ được kích hoạt sau khi ngân hàng xác nhận giao dịch.</p>
        <button disabled={pending} onClick={check} className="bg-[var(--google-blue-primary)] rounded-lg p-3 w-full">Kiểm tra thanh toán</button>
      </> : <>
        <label className="block">Gói dịch vụ<select value={planId} onChange={e => setPlanId(e.target.value)} className="w-full bg-[var(--surface-container-high)] p-2 rounded">
          <option value="">Chọn gói</option>{plans.filter(p => p.originalPrice > 0).map(p => <option key={p.id} value={p.id}>{p.name} · {p.originalPrice.toLocaleString('vi-VN')} đ</option>)}
        </select></label>
        <label className="block">Mã giảm giá<input value={coupon} onChange={e => setCoupon(e.target.value)} className="w-full bg-[var(--surface-container-high)] p-2 rounded" /></label>
        {plans.length === 0 && <p>Chưa có gói dịch vụ được cấu hình.</p>}
        <button disabled={pending || !planId} onClick={submit} className="bg-[var(--google-blue-primary)] rounded-lg p-3 w-full disabled:opacity-50">{pending ? 'Đang xử lý…' : 'Tạo mã thanh toán VietQR'}</button>
      </>}
    </div>
  </div>;
};
