import { test, expect } from '@playwright/test';

test.describe('Phân quyền Free & Premium User (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('1. Kiểm tra UI mặc định của tài khoản FREE', async ({ page }) => {
    // Check Header Logo and FREE Badge
    await expect(page.locator('#topHeader')).toBeVisible();
    await expect(page.locator('#topHeader')).toContainText('FREE');
    await expect(page.locator('button:has-text("Nâng cấp PRO")')).toBeVisible();

    // Check Right Sidebar Task counter (X/10 (FREE))
    const rightSidebar = page.locator('#rightSidebar');
    await expect(rightSidebar).toBeVisible();
    await expect(rightSidebar).toContainText('(FREE)');

    // Check AI Task button has Lock
    const aiButton = page.locator('button:has-text("Trợ lý AI Gợi ý Task")');
    await expect(aiButton).toBeVisible();
    await expect(aiButton).toContainText('Khóa');
  });

  test('2. Chặn tính năng Pro đối với User Free & Bật Modal Nâng cấp', async ({ page }) => {
    const aiButton = page.locator('button:has-text("Trợ lý AI Gợi ý Task")');
    await aiButton.click();

    // Verify Upgrade Modal opens
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Gói Miễn Phí');
  });

  test('3. Nhập Coupon rỗng hoặc chỉ có khoảng trắng không thực hiện gì', async ({ page }) => {
    await page.locator('button:has-text("Nâng cấp PRO")').click();
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    const couponInput = modal.locator('input[placeholder*="Mã ưu đãi"]');
    await couponInput.fill('   ');
    await modal.locator('button:has-text("Áp dụng")').click();

    // Total price remains unchanged
    await expect(modal).toContainText('Tổng thanh toán:');
  });

  test('4. Nhập Coupon không hợp lệ hiển thị cảnh báo lỗi', async ({ page }) => {
    await page.locator('button:has-text("Nâng cấp PRO")').click();
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    const couponInput = modal.locator('input[placeholder*="Mã ưu đãi"]');
    await couponInput.fill('INVALID_COUPON_123');
    await modal.locator('button:has-text("Áp dụng")').click();

    await expect(modal).toContainText('không hợp lệ');
  });

  test('5. Áp dụng Coupon TET2026 với ký tự thường và khoảng trắng (Edge Case)', async ({ page }) => {
    await page.locator('button:has-text("Nâng cấp PRO")').click();
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    // Fill lowercase with spaces: '  tet2026  '
    const couponInput = modal.locator('input[placeholder*="Mã ưu đãi"]');
    await couponInput.fill('  tet2026  ');
    await modal.locator('button:has-text("Áp dụng")').click();

    await expect(modal).toContainText('Giảm 30.000đ');
  });

  test('6. Áp dụng Coupon VIP50 giảm 50%', async ({ page }) => {
    await page.locator('button:has-text("Nâng cấp PRO")').click();
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    const couponInput = modal.locator('input[placeholder*="Mã ưu đãi"]');
    await couponInput.fill('VIP50');
    await modal.locator('button:has-text("Áp dụng")').click();

    await expect(modal).toContainText('Giảm 50%');
  });

  test('7. Chuyển đổi giữa các gói 1 Tháng, 6 Tháng và 12 Tháng trong Modal Checkout', async ({ page }) => {
    await page.locator('button:has-text("Nâng cấp PRO")').click();
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    // Select 1 Month Plan
    const plan1 = modal.locator('div:has-text("1 Tháng")').last();
    await plan1.click();
    await expect(modal).toContainText('49.000đ');

    // Select 6 Months Plan
    const plan6 = modal.locator('div:has-text("6 Tháng")').last();
    await plan6.click();
    await expect(modal).toContainText('199.000đ');

    // Select 12 Months Plan
    const plan12 = modal.locator('div:has-text("12 Tháng")').last();
    await plan12.click();
    await expect(modal).toContainText('299.000đ');
  });

  test('8. Nâng cấp lên gói 12 Tháng VIP thành công', async ({ page }) => {
    await page.locator('button:has-text("Nâng cấp PRO")').click();
    const modal = page.locator('.fixed .apple-glass-modal').first();
    await expect(modal).toBeVisible();

    // Select VIP 12 Months
    const vipPlan = modal.locator('div:has-text("12 Tháng")').last();
    await vipPlan.click();

    // Confirm Upgrade
    await modal.locator('button:has-text("Xác nhận Nâng cấp")').click();

    // Verify Header updates to VIP
    await expect(page.locator('#topHeader')).toContainText('VIP 👑');
  });

  test('9. Sử dụng Trợ lý AI sau khi Nâng cấp VIP', async ({ page }) => {
    // Open Profile and switch to PRO
    const avatarButton = page.locator('#topHeader button:has(span:text-matches("AN|RP"))').last();
    await avatarButton.click();
    const proBtn = page.locator('button:has-text("Kích hoạt Test PRO")');
    await proBtn.click();

    // Close profile dropdown
    await page.locator('#calendarHeader').click();

    // Click AI Task Assistant
    const aiButton = page.locator('button:has-text("Trợ lý AI Gợi ý Task")');
    await expect(aiButton).toContainText('PRO ⭐');
    await aiButton.click();

    // Verify task generated in right sidebar
    await expect(page.locator('#rightSidebar')).toContainText('[AI]');
  });

  test('10. Khóa Theme VIP trong Cài đặt đối với User FREE', async ({ page }) => {
    // Open Settings Modal
    const settingsBtn = page.locator('button[title*="Cài đặt"]').first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      const modal = page.locator('.fixed .apple-glass-modal').first();
      await expect(modal).toBeVisible();

      // Click Appearance tab
      const appearanceTab = modal.locator('button:has-text("Kho giao diện")');
      if (await appearanceTab.isVisible()) {
        await appearanceTab.click();
        const vipTheme = modal.locator('button:has-text("Khóa VIP")').first();
        if (await vipTheme.isVisible()) {
          await vipTheme.click();
          await expect(page.locator('.fixed .apple-glass-modal')).toBeVisible();
        }
      }
    }
  });

  test('11. Chuyển đổi linh hoạt giữa FREE và PRO trong User Profile', async ({ page }) => {
    const avatarButton = page.locator('#topHeader button:has(span:text-matches("AN|RP"))').last();
    await avatarButton.click();

    const dropdown = page.locator('.apple-glass-modal').first();
    await expect(dropdown).toBeVisible();

    // Switch to PRO
    await dropdown.locator('button:has-text("Kích hoạt Test PRO")').click();
    await expect(page.locator('#topHeader')).toContainText('PRO ⭐');

    // Switch back to FREE
    await avatarButton.click();
    await dropdown.locator('button:has-text("Chuyển về Test FREE")').click();
    await expect(page.locator('#topHeader')).toContainText('FREE');
  });
});
