import { initializeApp, getApps } from '@firebase/app';
import { getMessaging, isSupported, register, unregister, onRegistered, type Messaging } from '@firebase/messaging';
import workerUrl from '../firebase-messaging-sw?worker&url';
import { apiClient } from '../api/apiClient';
import { firebaseConfig, pushConfigured } from './firebaseConfig';
let messaging: Messaging | undefined;
let detach: (() => void) | undefined;
let generation = 0;
export async function enableBrowserPush(requestPermission = true) {
  if (!pushConfigured) throw new Error('Chưa cấu hình Firebase Web và VAPID key.');
  if (!window.isSecureContext || !await isSupported()) throw new Error('Trình duyệt cần HTTPS và hỗ trợ Web Push.');
  const permission = requestPermission ? await Notification.requestPermission() : Notification.permission;
  if (permission !== 'granted') throw new Error('Chưa được cấp quyền thông báo.');
  const deviceId = localStorage.getItem('web_device_id');
  if (!deviceId) throw new Error('Đăng nhập lại để tạo phiên thiết bị web.');
  const current = ++generation;
  const app = getApps().find(a => a.name === 'routinepulse-web') || initializeApp(firebaseConfig, 'routinepulse-web');
  messaging = getMessaging(app); detach?.();
  detach = onRegistered(messaging, fid => {
    if (current !== generation) return;
    void apiClient.put('/user/push/token', { deviceId, installationId: fid }).then(() => {
      if (current === generation) { localStorage.setItem('web_push_enabled', 'true'); window.dispatchEvent(new CustomEvent('push:status', { detail: 'Đã bật thông báo nền.' })); }
    }).catch(() => window.dispatchEvent(new CustomEvent('push:status', { detail: 'Chưa đồng bộ được thiết bị. Hãy thử bật lại.' })));
  });
  const sw = await navigator.serviceWorker.register(workerUrl);
  await register(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, serviceWorkerRegistration: sw });
}
export async function disableBrowserPush() {
  ++generation; detach?.(); detach = undefined;
  const deviceId = localStorage.getItem('web_device_id');
  if (deviceId) await apiClient.put('/user/push/token', { deviceId, installationId: null });
  if (messaging) await unregister(messaging);
  localStorage.setItem('web_push_enabled', 'false');
}
export function detachBrowserPush() { ++generation; detach?.(); detach = undefined; }
