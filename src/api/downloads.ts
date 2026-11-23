import { getAuthToken } from './apiClient';
export async function downloadReceipt(code: string) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  const response = await fetch(`${base}/user/subscriptions/transactions/${encodeURIComponent(code)}/receipt`, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
  if (!response.ok) throw new Error('Không tải được chứng từ thanh toán.');
  const url = URL.createObjectURL(await response.blob()); const a = document.createElement('a'); a.href = url; a.download = `receipt_${code}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
