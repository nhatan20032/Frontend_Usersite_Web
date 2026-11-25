import { API_BASE_URL } from '../config/apiConfig';

export async function downloadReceipt(code: string) {
  const response = await fetch(`${API_BASE_URL}/user/subscriptions/transactions/${encodeURIComponent(code)}/receipt`, { credentials: 'include' });
  if (!response.ok) throw new Error('Không tải được chứng từ thanh toán.');
  const url = URL.createObjectURL(await response.blob()); const a = document.createElement('a'); a.href = url; a.download = `receipt_${code}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
