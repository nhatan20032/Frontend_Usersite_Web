import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
export function ReferralPanel() {
  const [data, setData] = useState<{code:string;invited:number;qualified:number;earnedDays:number;pendingDays:number;daysPerReferral:number;minimumInvites:number;enabled:boolean} | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; apiClient.get<NonNullable<typeof data>>('/user/referrals').then(d => { if (active) setData(d); }).catch(() => { if (active) setError('Không tải được thông tin giới thiệu.'); }); return () => { active = false; }; }, []);
  if (error) return <p role="alert">{error}</p>;
  return <section className="border rounded-xl p-3 space-y-2"><h5>Giới thiệu bạn bè</h5>{data && <><p>{data.enabled ? `Nhận ${data.daysPerReferral} ngày PRO sau thanh toán đầu tiên; ngưỡng ${data.minimumInvites} lượt hợp lệ.` : 'Chương trình đang tạm dừng.'}</p><label>Link giới thiệu<input readOnly className="w-full border rounded p-2" value={`${window.location.origin}/?ref=${data.code}`} onFocus={e => e.target.select()} /></label><p>Đã mời: {data.invited} · Đã thanh toán: {data.qualified} · Đã nhận: {data.earnedDays} ngày · Chờ cấp: {data.pendingDays} ngày</p></>}</section>;
}
