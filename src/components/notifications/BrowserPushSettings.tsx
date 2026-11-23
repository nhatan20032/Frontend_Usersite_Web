import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { enableBrowserPush, disableBrowserPush, detachBrowserPush } from '../../services/browserPush';
import { pushConfigured } from '../../services/firebaseConfig';
export function BrowserPushLifecycle() {
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser && 'Notification' in window && Notification.permission === 'granted' && localStorage.getItem('web_push_enabled') === 'true') void enableBrowserPush(false).catch(() => {});
    return detachBrowserPush;
  }, [currentUser?.id]);
  return null;
}
export function BrowserPushSettings() {
  const [status, setStatus] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { const listener = (e: Event) => setStatus((e as CustomEvent<string>).detail); window.addEventListener('push:status', listener); return () => window.removeEventListener('push:status', listener); }, []);
  return <div className="space-y-3"><h5>Thông báo khi website chạy nền</h5><p>Cấp quyền để nhận nhắc việc khi không mở tab. Trình duyệt và hệ điều hành cần cho phép chạy nền.</p>{!pushConfigured && <p>Firebase Web Push chưa được cấu hình trên môi trường này.</p>}<button disabled={busy || !pushConfigured} onClick={async () => { setBusy(true); try { await enableBrowserPush(); setStatus('Đã đăng ký. Đang đồng bộ thiết bị…'); } catch(e) { setStatus((e as Error).message); } finally { setBusy(false); } }}>Bật thông báo nền</button><button disabled={busy} onClick={async () => { setBusy(true); try { await disableBrowserPush(); setStatus('Đã tắt thông báo nền.'); } catch { setStatus('Chưa tắt được trên máy chủ. Thử lại khi có mạng.'); } finally { setBusy(false); } }}>Tắt</button><p role="status">{status}</p></div>;
}
