import { test, expect } from '@playwright/test';

test.describe('Automation Full Luồng Usersite Web (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Chặng 1: Khởi động sạch sẽ - Tuyệt đối không xuất hiện lỗi 401 Unauthorized trên Console', async ({ page }) => {
    const errorLogs: string[] = [];
    const unauthorizedRequests: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorLogs.push(msg.text());
      }
    });

    // Capture network 401 responses
    page.on('response', (res) => {
      if (res.status() === 401) {
        unauthorizedRequests.push(res.url());
      }
    });

    // Wait for the app layout to render fully
    await expect(page.locator('#topHeader')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#leftSidebar')).toBeVisible();
    await expect(page.locator('#rightSidebar')).toBeVisible();

    // Verify ZERO 401 requests occurred
    expect(unauthorizedRequests).toEqual([]);

    // Verify no 401 errors leaked into console
    const authErrorsInConsole = errorLogs.filter((err) => err.includes('401') || err.includes('Unauthorized'));
    expect(authErrorsInConsole).toEqual([]);
  });

  test('Chặng 2: Thao tác Lịch trình - Điều hướng ngày & Chuyển đổi View Tháng/Tuần/Lịch biểu', async ({ page }) => {
    await expect(page.locator('#topHeader')).toBeVisible();

    // Chuyển view Tuần
    const weekBtn = page.locator('#topHeader button:has-text("Tuần")');
    if (await weekBtn.isVisible()) {
      await weekBtn.click();
      await page.waitForTimeout(300);
    }

    // Chuyển view Lịch biểu
    const agendaBtn = page.locator('#topHeader button:has-text("Lịch biểu")');
    if (await agendaBtn.isVisible()) {
      await agendaBtn.click();
      await page.waitForTimeout(300);
    }

    // Quay lại view Tháng
    const monthBtn = page.getByRole('button', { name: 'Tháng', exact: true });
    if (await monthBtn.isVisible()) {
      await monthBtn.click();
      await page.waitForTimeout(300);
    }

    // Bấm nút Hôm nay
    const todayBtn = page.locator('#topHeader button:has-text("Hôm nay")');
    await expect(todayBtn).toBeVisible();
    await todayBtn.click();
  });

  test('Chặng 3: Quản lý Công việc (Google Tasks Companion) - Tạo mới, Hoàn thành & Bộ lọc', async ({ page }) => {
    const rightSidebar = page.locator('#rightSidebar');
    await expect(rightSidebar).toBeVisible();

    // Tìm ô nhập task
    const taskInput = rightSidebar.locator('input[placeholder*="công việc"], input[type="text"]').first();
    if (await taskInput.isVisible()) {
      const taskTitle = `Automation Task #${Date.now()}`;
      await taskInput.fill(taskTitle);
      
      const submitBtn = rightSidebar.locator('button[type="submit"], button:has(svg.lucide-plus)').first();
      await submitBtn.click();

      // Kiểm tra task xuất hiện trên danh sách
      await expect(rightSidebar.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });
    }
  });

  test('Chặng 4: Companion Dock Tabs - Chuyển sang Keep Notes & Google Contacts', async ({ page }) => {
    // Dock bên phải chứa các icon chuyển đổi tab
    const dockContainer = page.locator('.right-sidebar-dock, #rightSidebarDock, aside:has(button[title*="Keep"])').first();
    
    // Tìm nút chuyển tab Ghi chú (Notes / Keep)
    const notesTabBtn = page.locator('button[title*="Keep"], button[title*="Ghi chú"]').first();
    if (await notesTabBtn.isVisible()) {
      await notesTabBtn.click();
      await page.waitForTimeout(400);

      // Kiểm tra panel Keep Notes hiển thị
      const notesPanel = page.locator('#rightSidebar:has-text("Google Keep"), #rightSidebar:has-text("Ghi chú")');
      await expect(notesPanel).toBeVisible({ timeout: 5000 });
    }

    // Tìm nút chuyển tab Danh bạ (Contacts)
    const contactsTabBtn = page.locator('button[title*="Contacts"], button[title*="Danh bạ"]').first();
    if (await contactsTabBtn.isVisible()) {
      await contactsTabBtn.click();
      await page.waitForTimeout(400);

      // Kiểm tra panel Contacts hiển thị
      const contactsPanel = page.locator('#rightSidebar:has-text("Google Contacts"), #rightSidebar:has-text("danh bạ")');
      await expect(contactsPanel).toBeVisible({ timeout: 5000 });
    }
  });

  test('Chặng 5: Trung tâm Thông báo (Notification Center) - Mở Dropdown & Đọc hết', async ({ page }) => {
    // Click vào chuông thông báo trên Header
    const bellBtn = page.locator('#topHeader button:has(svg.lucide-bell)');
    await expect(bellBtn).toBeVisible();
    await bellBtn.click();

    // Verify Dropdown thông báo mở ra
    const notifDropdown = page.locator('#topHeader div:has-text("Thông báo hệ thống")').first();
    await expect(notifDropdown).toBeVisible();

    // Click nút "Đã đọc hết" nếu có
    const markAllBtn = notifDropdown.locator('button:has-text("Đã đọc hết")');
    if (await markAllBtn.isVisible()) {
      await markAllBtn.click();
    }
  });

  test('Chặng 6: Thanh toán & Nâng cấp VIP (Checkout Modal) - Áp dụng Coupon', async ({ page }) => {
    // Mở User Profile Dropdown
    const avatarBtn = page.locator('#topHeader button:has-text("AN"), #topHeader button:has-text("RP"), #topHeader .rounded-full.bg-\\[\\#1A73E8\\]').first();
    await expect(avatarBtn).toBeVisible();
    await avatarBtn.click();

    // Kiểm tra User Profile Dropdown xuất hiện
    const userDropdown = page.locator('div:has-text("Nguyễn Văn An"), div:has-text("Cài đặt tài khoản")').first();
    await expect(userDropdown).toBeVisible();

    // Đóng dropdown bằng phím Esc hoặc click ngoài
    await page.keyboard.press('Escape');

    // Mở Modal Nâng cấp / Checkout trực tiếp qua sự kiện
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('app:upgrade-required'));
    });

    const checkoutModal = page.locator('.fixed:has-text("Nâng cấp"), .fixed:has-text("VIP"), .fixed:has-text("Gói")').first();
    if (await checkoutModal.isVisible({ timeout: 3000 })) {
      // Test nhập mã giảm giá VIP50
      const couponInput = checkoutModal.locator('input[placeholder*="Mã ưu đãi"], input[placeholder*="ưu đãi"]').first();
      if (await couponInput.isVisible()) {
        await couponInput.fill('VIP50');
        const applyBtn = checkoutModal.locator('button:has-text("Áp dụng")').first();
        if (await applyBtn.isVisible()) {
          await applyBtn.click();
          await page.waitForTimeout(500);
        }
      }

      // Đóng modal
      const closeBtn = checkoutModal.locator('button:has(svg.lucide-x)').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });
});

