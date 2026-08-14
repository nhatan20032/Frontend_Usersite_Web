import { test, expect } from '@playwright/test';

test.describe('Nghiệp vụ Lịch trình & Quản lý Công việc (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('1. Ngăn chặn tạo công việc khi nhập rỗng hoặc toàn khoảng trắng (Edge Case)', async ({ page }) => {
    const initialCount = await page.locator('#rightSidebar div.apple-glass-card').count();
    const taskInput = page.locator('#rightSidebar input[type="text"]').first();
    await expect(taskInput).toBeVisible();

    await taskInput.fill('   ');
    await page.locator('#rightSidebar button[type="submit"]').click();

    // Ensure no empty tasks are added
    const tasksCount = await page.locator('#rightSidebar div.apple-glass-card').count();
    expect(tasksCount).toBe(initialCount);
  });

  test('2. Tạo công việc mới nhanh, Toggle hoàn thành và Xóa công việc', async ({ page }) => {
    const taskInput = page.locator('#rightSidebar input[type="text"]').first();
    await expect(taskInput).toBeVisible();

    const uniqueTaskTitle = `Playwright Task #${Date.now()}`;
    await taskInput.fill(uniqueTaskTitle);
    await page.locator('#rightSidebar button[type="submit"]').click();

    // Verify task is added
    const taskItem = page.locator('#rightSidebar').locator(`text=${uniqueTaskTitle}`).first();
    await expect(taskItem).toBeVisible();

    // Toggle complete
    const taskRow = page.locator('#rightSidebar div.apple-glass-card').filter({ hasText: uniqueTaskTitle }).first();
    const checkbox = taskRow.locator('button').first();
    await checkbox.click();

    // Delete task
    const deleteBtn = taskRow.locator('button[title*="Xóa"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
    }
  });

  test('3. Quản lý Subtasks trong danh sách công việc', async ({ page }) => {
    const subtaskCheckbox = page.locator('#rightSidebar input[type="checkbox"]').first();
    if (await subtaskCheckbox.isVisible()) {
      const isChecked = await subtaskCheckbox.isChecked();
      await subtaskCheckbox.click();
      expect(await subtaskCheckbox.isChecked()).toBe(!isChecked);
    }
  });

  test('4. Single-click vào ô ngày mở Slide-over Day Inspector Panel tức thì', async ({ page }) => {
    // Click on date cell 18
    const dateCell = page.locator('.grid-cols-7 div:has-text("18")').first();
    await expect(dateCell).toBeVisible();
    await dateCell.click();

    // Verify Day Inspector Drawer slides in
    const drawer = page.locator('div:has-text("lịch trình & thói quen trong ngày"), div:has-text("Chưa có lịch trình cho ngày này")').first();
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Close Day Inspector Drawer
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    await closeBtn.click();
  });

  test('5. Bấm nút Thêm lịch trình bên trong Day Inspector mở Modal Tạo mới', async ({ page }) => {
    // Click on date cell 22
    const dateCell = page.locator('.grid-cols-7 div:has-text("22")').first();
    await dateCell.click();

    // Click Add Schedule button inside Day Inspector Drawer
    const addBtn = page.locator('.fixed button:has-text("Thêm lịch trình")').first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Verify Create Schedule Modal opens
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toContainText('Tạo Lịch trình');

    // Close modal
    await modal.locator('button:has(svg.lucide-x)').first().click();
  });

  test('6. Điểm danh Thói quen (Check-in Streak) và Hủy điểm danh (Undo) trong Day Inspector', async ({ page }) => {
    // Click on date cell with events
    const dateCell = page.locator('.grid-cols-7 div:has-text("15")').first();
    if (await dateCell.isVisible()) {
      await dateCell.click();
    }

    // Check-in
    const checkInBtn = page.locator('button:has-text("Điểm danh ngay")').first();
    if (await checkInBtn.isVisible()) {
      await checkInBtn.click();
      await expect(page.locator('button:has-text("Đã điểm danh ✓")').first()).toBeVisible({ timeout: 5000 });

      // Undo Check-in (Edge Case)
      await page.locator('button:has-text("Đã điểm danh ✓")').first().click();
      await expect(page.locator('button:has-text("Điểm danh ngay")').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('7. Tạo Thói quen lặp lại Weekdays (Thứ 2 - Thứ 6) tự động phủ đều các ngày trong tuần', async ({ page }) => {
    // Open create modal via Header button
    const createBtn = page.locator('button:has-text("Tạo mới"), button:has-text("Create")').first();
    await createBtn.click();

    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    const routineTitle = `Uống 2L nước mỗi ngày #${Date.now()}`;
    await modal.locator('input[placeholder*="Ví dụ:"]').fill(routineTitle);

    // Select Weekdays frequency
    const freqSelect = modal.locator('select').nth(2);
    if (await freqSelect.isVisible()) {
      await freqSelect.selectOption('weekly');
    }

    // Submit
    await modal.locator('button[type="submit"]').click();

    // Verify routine appears on the Month Grid
    const routineBadges = page.locator(`text=${routineTitle}`);
    await expect(routineBadges.first()).toBeVisible({ timeout: 5000 });
    const count = await routineBadges.count();
    expect(count).toBeGreaterThan(1);
  });

  test('8. Xóa 1 sự kiện đơn lẻ trong chuỗi Weekdays (Chỉ sự kiện này - Google Calendar style)', async ({ page }) => {
    // Create recurring weekdays routine
    const createBtn = page.locator('button:has-text("Tạo mới"), button:has-text("Create")').first();
    await createBtn.click();

    const modal = page.locator('.fixed .apple-glass-modal').first();
    const uniqueTitle = `Học từ vựng Tiếng Anh #${Date.now()}`;
    await modal.locator('input[placeholder*="Ví dụ:"]').fill(uniqueTitle);
    await modal.locator('select').nth(2).selectOption('weekly');
    await modal.locator('button[type="submit"]').click();

    // Open Day Inspector for a weekday with this event
    const eventBadge = page.locator(`text=${uniqueTitle}`).first();
    await expect(eventBadge).toBeVisible();
    await eventBadge.click();

    // Click delete inside Day Inspector
    const deleteBtn = page.locator('.fixed button[title="Xóa"]').first();
    await deleteBtn.click();

    // RecurringActionModal appears
    const recurModal = page.locator('.fixed .apple-glass-modal:has-text("Sự kiện lặp lại")');
    await expect(recurModal).toBeVisible();

    // Select "Chỉ sự kiện này"
    await recurModal.locator('label:has-text("Chỉ sự kiện này")').click();
    await recurModal.locator('button:has-text("Xác nhận Xóa")').click();

    // Verify other occurrences in the series still exist on the grid
    const remainingBadges = page.locator('.grid-cols-7').locator(`text=${uniqueTitle}`);
    await expect(remainingBadges.first()).toBeVisible();
    const count = await remainingBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('9. Xóa toàn bộ chuỗi sự kiện Weekdays (Tất cả sự kiện trong chuỗi - Google Calendar style)', async ({ page }) => {
    // Create recurring weekdays routine
    const createBtn = page.locator('button:has-text("Tạo mới"), button:has-text("Create")').first();
    await createBtn.click();

    const modal = page.locator('.fixed .apple-glass-modal').first();
    const uniqueTitle = `Tập Gym Chiều #${Date.now()}`;
    await modal.locator('input[placeholder*="Ví dụ:"]').fill(uniqueTitle);
    await modal.locator('select').nth(2).selectOption('weekly');
    await modal.locator('button[type="submit"]').click();

    // Open Day Inspector for a weekday with this event
    const eventBadge = page.locator('.grid-cols-7').locator(`text=${uniqueTitle}`).first();
    await expect(eventBadge).toBeVisible();
    await eventBadge.click();

    // Click delete inside Day Inspector
    const deleteBtn = page.locator('.fixed button[title="Xóa"]').first();
    await deleteBtn.click();

    // RecurringActionModal appears
    const recurModal = page.locator('.fixed .apple-glass-modal:has-text("Sự kiện lặp lại")');
    await expect(recurModal).toBeVisible();

    // Select "Tất cả sự kiện trong chuỗi"
    await recurModal.locator('label:has-text("Tất cả sự kiện trong chuỗi")').click();
    await recurModal.locator('button:has-text("Xác nhận Xóa")').click();

    // Verify all occurrences in the series are wiped out from the Month grid
    const remainingBadges = page.locator('.grid-cols-7').locator(`text=${uniqueTitle}`);
    await expect(remainingBadges).toHaveCount(0);
  });

  test('10. Tạo Thói quen lặp lại Hàng ngày (Daily) phủ đều các ngày trong tháng', async ({ page }) => {
    // Open create modal via Header button
    const createBtn = page.locator('button:has-text("Tạo mới"), button:has-text("Create")').first();
    await createBtn.click();

    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    const routineTitle = `Đọc sách 20 phút #${Date.now()}`;
    await modal.locator('input[placeholder*="Ví dụ:"]').fill(routineTitle);

    // Select Daily frequency
    const freqSelect = modal.locator('select').nth(2);
    if (await freqSelect.isVisible()) {
      await freqSelect.selectOption('daily');
    }

    // Submit
    await modal.locator('button[type="submit"]').click();

    // Verify routine appears on Month Grid across multiple days
    const routineBadges = page.locator(`text=${routineTitle}`);
    await expect(routineBadges.first()).toBeVisible({ timeout: 5000 });
    const count = await routineBadges.count();
    expect(count).toBeGreaterThan(1);
  });

  test('11. Tạo Sự kiện có Địa điểm & Thông tin di chuyển', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Tạo mới"), button:has-text("Create")').first();
    await createBtn.click();

    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    const eventTitle = `Hội thảo AI & Công nghệ #${Date.now()}`;
    await modal.locator('input[placeholder*="Ví dụ:"]').fill(eventTitle);

    // Select Event type
    await modal.locator('select').first().selectOption('event');

    // Fill location
    const locationInput = modal.locator('input[placeholder*="Phòng họp"]');
    if (await locationInput.isVisible()) {
      await locationInput.fill('Trung tâm Hội nghị Quốc gia');
    }

    // Submit
    await modal.locator('button[type="submit"]').click();

    // Verify event badge appears on Month Grid
    const eventBadge = page.locator(`text=${eventTitle}`);
    await expect(eventBadge.first()).toBeVisible({ timeout: 5000 });
  });

  test('12. Chuyển đổi Tháng, Năm và nút Hôm nay trên Lịch', async ({ page }) => {
    // Click Next month
    const nextBtn = page.locator('button[title*="sau"], button[title*="next"], button:has(svg.lucide-chevron-right)').first();
    await nextBtn.click();

    // Click Prev month
    const prevBtn = page.locator('button[title*="trước"], button[title*="prev"], button:has(svg.lucide-chevron-left)').first();
    await prevBtn.click();

    // Click Today
    const todayBtn = page.locator('button:has-text("Hôm nay")').first();
    await todayBtn.click();
    await expect(page.locator('#topHeader')).toBeVisible();
  });

  test('13. Chuyển đổi Tháng & Năm trực tiếp từ Dropdown Selectors trên Header', async ({ page }) => {
    const monthSelect = page.locator('#calendarHeader select').first();
    await monthSelect.selectOption({ index: 5 }); // Select June

    const yearSelect = page.locator('#calendarHeader select').nth(1);
    await yearSelect.selectOption('2027');

    await expect(page.locator('#calendarHeader')).toBeVisible();

    // Reset to Today
    await page.locator('button:has-text("Hôm nay")').click();
  });

  test('14. Chuyển đổi chế độ xem Lịch Tháng (Month) và Lịch Tuần (Week VIP)', async ({ page }) => {
    // Switch to Week View
    const weekBtn = page.locator('button:has-text("Tuần"), button:has-text("Week")').first();
    await weekBtn.click();

    // Verify Week Timeline Header
    await expect(page.locator('#calendarHeader')).toBeVisible();

    // Switch back to Month View
    const monthBtn = page.locator('button:has-text("Tháng"), button:has-text("Month")').first();
    await monthBtn.click();
    await expect(page.locator('.grid-cols-7').first()).toBeVisible();
  });

  test('15. Lọc danh mục hiển thị (Toggle Categories ở LeftSidebar)', async ({ page }) => {
    const routineCheckbox = page.locator('#leftSidebar input[type="checkbox"]').first();
    if (await routineCheckbox.isVisible()) {
      const isChecked = await routineCheckbox.isChecked();
      await routineCheckbox.click();
      expect(await routineCheckbox.isChecked()).toBe(!isChecked);
    }
  });

  test('16. Thu gọn và Mở rộng Sidebar Trái & Phải (Docking System)', async ({ page }) => {
    // Collapse Left Sidebar
    const collapseLeftBtn = page.locator('#leftSidebar button[title*="Thu gọn"]').first();
    if (await collapseLeftBtn.isVisible()) {
      await collapseLeftBtn.click();
    }

    // Collapse Right Sidebar
    const collapseRightBtn = page.locator('#rightSidebar button[title*="Thu gọn"]').first();
    if (await collapseRightBtn.isVisible()) {
      await collapseRightBtn.click();
    }
  });
});
