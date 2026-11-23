/// <reference lib="webworker" />
import { initializeApp } from '@firebase/app';
import { getMessaging, onBackgroundMessage } from '@firebase/messaging/sw';
import { firebaseConfig } from './services/firebaseConfig';
const worker = self as unknown as ServiceWorkerGlobalScope;
// Handle clicks before Firebase installs its default click handler.
worker.addEventListener('notificationclick', event => {
  event.stopImmediatePropagation(); event.notification.close();
  const payload = event.notification.data?.FCM_MSG?.data ?? event.notification.data;
  let target = new URL('/', worker.location.origin);
  try { const url = new URL(payload?.actionUrl || '/', worker.location.origin); if (url.origin === worker.location.origin) target = url; } catch { /* Use the app home. */ }
  event.waitUntil((async () => {
    const clients = await worker.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = clients.find(c => new URL(c.url).origin === target.origin) as WindowClient | undefined;
    if (client) { await client.navigate(target.href); await client.focus(); } else await worker.clients.openWindow(target.href);
  })());
});
const messaging = getMessaging(initializeApp(firebaseConfig, 'routinepulse-web'));
onBackgroundMessage(messaging, payload => {
  // FCM automatically displays notification payloads; only display data-only messages here.
  if (!payload.notification && payload.data?.title) return worker.registration.showNotification(payload.data.title, { body: payload.data.body, data: payload.data });
});
