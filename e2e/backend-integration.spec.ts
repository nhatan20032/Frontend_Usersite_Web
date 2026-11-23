import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // API integration tests do not depend on remote font downloads.
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, route => route.abort());
});

const user = { id: 'user-uuid', fullName: 'Integration User', email: 'integration@example.com', role: 'FREE_USER', subscriptionTier: 'FREE', isPremium: false, features: [] };

test('a stale local profile cannot bypass login', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rp_user_session', JSON.stringify({ isLoggedIn: true, name: 'Fake User', subscriptionTier: 'VIP' })));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
  await expect(page.locator('#topHeader')).toHaveCount(0);
});

test('a rejected login cannot create a local authenticated session', async ({ page }) => {
  await page.route('**/api/v1/user/auth/login', route => route.fulfill({ status: 401, json: { message: 'Invalid credentials' } }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByLabel('Mật khẩu', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByText('Không thể xác thực', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
  await expect(page.locator('#topHeader')).toHaveCount(0);
});

test('server tasks use their UUID for writes and empty server data stays empty', async ({ page }) => {
  const id = 'b4f19608-b92f-4417-85a9-10dbe286d7d9';
  let completed = false;
  const writes: string[] = [];
  await page.addInitScript(() => { localStorage.setItem('access_token', 'test-access'); });
  await page.route('**/hubs/**', route => route.fulfill({ status: 503, body: '' }));
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/settings')) return route.fulfill({ json: { currentTheme: 'default', language: 'vi', enableSound: true, availableThemes: [] } });
    if (path.endsWith('/auth/me')) return route.fulfill({ json: user });
    if (path.endsWith(`/tasks/${id}/toggle`)) { writes.push(path); completed = true; return route.fulfill({ json: { id, status: 'COMPLETED' } }); }
    if (path.endsWith('/tasks')) return route.fulfill({ json: [{ id, title: 'Task from server', priority: 0, status: completed ? 1 : 0, subTasks: [] }] });
    if (path.endsWith('/notifications')) return route.fulfill({ json: { data: [], totalCount: 0, unreadCount: 0, page: 1, pageSize: 20 } });
    return route.fulfill({ json: [] });
  });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#topHeader')).toBeVisible();
  const sidebar = page.locator('#rightSidebar');
  await expect(sidebar.getByText('Task from server', { exact: true })).toBeVisible();
  await sidebar.locator('input[type="checkbox"]').first().click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0]).toBe(`/api/v1/user/tasks/${id}/toggle`);
  await expect(sidebar.locator('input[type="checkbox"]').first()).toBeChecked();
  await expect(page.getByText('Hội thảo Công Nghệ & AI Summit', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});


test('public booking works without an authenticated session', async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await page.route('**/api/v1/user/appointments/public/host**', route => {
    if (route.request().method() === 'POST') { payload = route.request().postDataJSON(); return route.fulfill({ json: { bookingId: 'booking-from-server' } }); }
    return route.fulfill({ json: { hostName: 'Host', timezone: 'GMT+07:00', durationMinutes: 60, availableSlots: [{ dayName: 'Thứ Hai', startTime: '09:00 AM', endTime: '05:00 PM' }] } });
  });
  await page.goto('/book/host', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Họ tên', { exact: true }).fill('Guest');
  await page.getByLabel('Email', { exact: true }).fill('guest@example.com');
  await page.locator('input[type="datetime-local"]').fill('2027-01-04T10:00');
  await page.getByRole('button', { name: 'Đặt lịch hẹn', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('booking-from-server');
  expect(payload?.clientEmail).toBe('guest@example.com');
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
});


test('account preferences persist and apply the dynamic theme palette', async ({ page }) => {
  let settings = { currentTheme: 'OCEAN', language: 'vi', enableSound: true, availableThemes: [{ id: 'theme-id', code: 'OCEAN', name: 'Ocean', primaryColor: '#123456', backgroundColor: '#102030', isLocked: false, palette: { textColor: '#ffffff', surfaceColor: '#203040' } }] };
  const patches: unknown[] = [];
  await page.addInitScript(() => localStorage.setItem('access_token', 'test-access'));
  await page.route('**/hubs/**', route => route.fulfill({ status: 503, body: '' }));
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: user });
    if (path.endsWith('/settings')) {
      if (route.request().method() === 'PUT') { const patch = route.request().postDataJSON(); patches.push(patch); settings = { ...settings, ...patch, currentTheme: patch.themeCode ?? settings.currentTheme }; }
      return route.fulfill({ json: settings });
    }
    if (path.endsWith('/notifications')) return route.fulfill({ json: { data: [], unreadCount: 0 } });
    return route.fulfill({ json: [] });
  });
  await page.goto('/');
  await expect(page.locator('#topHeader')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--google-blue'))).toBe('#123456');
  await page.locator('#topHeader button').filter({ has: page.locator('svg.lucide-settings') }).click();
  await page.getByRole('button', { name: 'Thông báo & Nhắc', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Âm thanh thông báo' }).click();
  await expect(page.getByRole('checkbox', { name: 'Âm thanh thông báo' })).not.toBeChecked();
  await expect.poll(() => patches.length).toBe(1);
  expect(patches[0]).toEqual({ enableSound: false });
  await page.reload();
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--google-blue'))).toBe('#123456');
  await page.locator('#topHeader button').filter({ has: page.locator('svg.lucide-settings') }).click();
  await page.getByRole('button', { name: 'Thông báo & Nhắc', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Âm thanh thông báo' })).not.toBeChecked();
});
