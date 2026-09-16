# Kế Hoạch Chỉnh Sửa Giao Diện: Workspace Calendar (Clean Anti-Slop Redesign)

* **Dựa trên báo cáo:** `docs/ui_audit_workspace_calendar.md`
* **Phương án thiết kế:** Clean Anti-Slop Architecture (MengTo & Google Material 3 Dark System)
* **Phiên bản:** 2.0 (Redesign Draft)
* **Trạng thái:** Chờ người dùng phê duyệt trước khi lập trình (Awaiting User Approval)

---

## 1. Mục Tiêu Cải Tiến Cốt Lõi (Core Objectives)

1. **Giải phóng 100% không gian dọc cho Lịch (Full-Height Liquid Grid):**
   - Triệt tiêu 150px chiều cao chết ở đỉnh đầu bằng cách xóa bỏ `FlashSaleBanner` (38px) và hợp nhất `CalendarControls` (48px) vào `TopHeader` (56px duy nhất).
   - Đưa `MonthGridView` về dạng Full-Height Layout không cuộn chuột: 7 cột thứ và 5 hàng tuần tự co giãn chiếm trọn vẹn 100% viewport, giúp người dùng nắm bắt toàn bộ tháng trong một khung hình duy nhất.
2. **Dọn sạch 100% rác AI thương mại & Upsell Clutter:**
   - Xóa sạch banner Flash Sale, đồng hồ đếm ngược, badge "VIP", "PRO", icon vương miện và thẻ "Trợ lý AI Gợi ý Task" giả tạo.
   - Mở khóa chế độ xem Tuần (`WeekTimelineView`) tự nhiên như một tính năng tiêu chuẩn, không paywall.
3. **Tái cấu trúc Widget KPI thành Bottom Collapsible Strip:**
   - Đưa cụm 3 Bento Box KPI ra khỏi luồng cuộn chính của lịch, chuyển thành dải trạng thái mỏng 32px ở cạnh đáy với cơ chế đóng/mở (Drawer) tiện lợi.
4. **Tối ưu hóa không gian ngang (Panel Width & Dock Harmony):**
   - Đồng bộ tương tác giữa `RightSidebar` (Tasks) và `RightSidebarDock` (Quick Tools) nhằm giải phóng không gian màn hình, tránh tình trạng chiếm dụng tới gần 50% chiều ngang màn hình.
5. **Thống nhất hệ thống Design System (Google Material 3 Dark):**
   - Xóa bỏ toàn bộ các class lai căng `apple-glass-*`, các bo góc ngoại cỡ `rounded-3xl` (24px) khỏi mã nguồn CSS và component, đưa về bảng mã màu chuẩn và bo góc tinh tế `rounded-lg` (8px) / `rounded-md` (6px).

---

## 2. So Sánh Kiến Trúc Bố Cục (Before vs. After)

| Khu Vực | Hiện Trạng (Dính Slop & Lỗi Thiết Kế) | Thiết Kế Mới Đề Xuất (Clean Anti-Slop) | Lợi Ích Mang Lại |
|---|---|---|---|
| **Top Ribbon** | Banner Flash Sale đếm ngược 40% ngốn 38px | **Xóa bỏ hoàn toàn** | Trả lại sự trang trọng, tập trung cho công cụ làm việc |
| **Top Header** | Chồng 2 thanh bar (`TopHeader` 64px + `CalendarControls` 48px) = 112px | **1 thanh `TopHeader` hợp nhất cao 56px (`h-14`)**, tích hợp chọn tháng/năm và điều hướng | Tiết kiệm ngay 56px chiều dọc, triệt tiêu thông tin tháng bị lặp |
| **Vùng Lịch Tháng** | Bị bọc padding `p-4 sm:p-6`, `space-y-6`, bắt cuộn dọc (`overflow-y-auto`) vì bị nhét KPI dưới đáy | **Full-Height Liquid Grid (`h-full flex-1 flex flex-col overflow-hidden`)** | Người dùng xem trọn vẹn 35 ngày của tháng mà không phải cuộn 1 pixel nào |
| **Widget KPI** | 3 khối Bento Box to tướng đặt cố định dưới chân lưới lịch tháng | **Collapsible Bottom Strip cao 32px** (1 dòng tóm tắt + nút mở rộng chi tiết drawer) | Trả lại 100% chiều cao cho lịch biểu, vẫn truy cập đủ số liệu khi cần |
| **Sidebar Phải (Tasks)** | Mở to 320px, nhồi nhét card "Trợ lý AI", thanh báo động đỏ hết quota | **Tinh gọn danh sách công việc**, bổ sung bộ lọc (Tất cả / Hôm nay / Quan trọng), liên kết mượt với Dock | Tăng tốc độ quét mắt, loại bỏ ức chế paywall |
| **Design Language** | Chắp vá macOS Glassmorphism (`apple-glass-card`, `rounded-3xl`) với Material 3 | **100% Chuẩn hóa Google Material 3 Dark System** (`#121314`, `#1F2021`, `#2A2B2D`) | Giao diện nhất quán, đẳng cấp, chuyên nghiệp |

---

## 3. Hệ Thống Design Tokens & Style Guide Chuẩn

### Bảng màu (Color Palette - Material 3 Dark):
- **Nền cốt lõi (Base Canvas):** `#121314`
- **Bề mặt Container (Surface Container):** `#1F2021`
- **Bề mặt Nổi bật (Surface Container High):** `#28292A`
- **Đường viền ngăn cách (Borders & Dividers):** `#2A2B2D` (viền mỏng 1px)
- **Văn bản chính (On-Surface Primary):** `#E3E2E3` (độ tương phản cao)
- **Văn bản phụ (On-Surface Variant):** `#9AA0A6`
- **Văn bản thứ cấp (Muted):** `#70757A`
- **Màu nhấn thương hiệu (Google Blue Accent):** `#1A73E8` (nút chính), `#8AB4F8` (text/link nhấn)
- **Màu trạng thái thành công (Success Green):** `#81C995` / `#1E8E3E`
- **Màu cảnh báo (Warning Amber):** `#FDD663`

### Bo góc & Khoảng cách (Shape & Spacing):
- Bo góc nút bấm & input: `rounded-md` (6px) hoặc `rounded-full` cho các chip điều hướng.
- Bo góc thẻ & hộp nổi: `rounded-lg` (8px). **Tuyệt đối không dùng `rounded-3xl`**.
- Đổ bóng (Shadow): Chỉ sử dụng bóng mỏng nhẹ `shadow-xs` hoặc `shadow-sm` khi hover; không dùng shadow khổng lồ.

---

## 4. Kế Hoạch Thay Đổi Chi Tiết Từng File Mã Nguồn (Code Impact Plan)

### File 1: `src/components/layout/AppLayout.tsx`
- **Hành động:** Tái cấu trúc layout chính.
- **Chi tiết:**
  - Xóa bỏ import và thẻ `<FlashSaleBanner />`.
  - Xóa bỏ thẻ `<CalendarControls />` độc lập.
  - Sửa container bọc Main Canvas từ `div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6"` thành:
    ```tsx
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#121314]">
      {calendarView === 'month' && <MonthGridView />}
      {calendarView === 'week' && <WeekTimelineView />}
      <ProductivityKPI />
    </main>
    ```
  - Đảm bảo toàn bộ chiều cao của layout là `h-screen overflow-hidden flex flex-col`.

### File 2: `src/components/layout/TopHeader.tsx`
- **Hành động:** Hợp nhất chức năng điều hướng thời gian và tinh giản giao diện.
- **Chi tiết:**
  - Giảm chiều cao từ `h-16` (64px) xuống `h-14` (56px) tinh gọn.
  - Tích hợp cụm dropdown chọn tháng & năm trực tiếp cạnh nhãn tháng (chuyển từ `CalendarControls` sang).
  - Xóa bỏ toàn bộ huy hiệu `VIP`, `PRO` và icon vương miện (`Crown`).
  - Xóa bỏ nhãn `VIP` trên nút chuyển chế độ xem `Tuần`.
  - Xóa bỏ nút "Nâng cấp" (`Upgrade`) to bản.
  - Giữ lại ô tìm kiếm trung tâm và dropdown avatar hồ sơ người dùng.

### File 3: `src/components/calendar/CalendarControls.tsx`
- **Hành động:** Xóa bỏ hoặc tinh giản.
- **Chi tiết:** Toàn bộ logic dropdown chọn tháng/năm đã được đưa vào `TopHeader.tsx`. Loại bỏ file này khỏi `AppLayout` để triệt tiêu việc chồng thanh bar.

### File 4: `src/components/calendar/MonthGridView.tsx`
- **Hành động:** Chuyển đổi thành Liquid Full-Height Layout (100% Viewport Grid).
- **Chi tiết:**
  - Xóa bỏ wrapper `rounded-xl shadow-md border` tạo cảm giác card lơ lửng.
  - Đưa về cấu trúc chuẩn của ứng dụng Lịch:
    1. Hàng thứ trong tuần (Weekday Row): Cao 32px, `grid grid-cols-7 border-b border-[#2A2B2D] bg-[#121314] text-center text-xs font-medium text-[#9AA0A6]`.
    2. Lưới 35-42 ô ngày (Month Grid): `grid grid-cols-7 grid-rows-5 flex-1 w-full h-full divide-x divide-y divide-[#2A2B2D] bg-[#121314] overflow-hidden`.
    3. Mỗi ô ngày: `flex flex-col justify-between p-1.5 overflow-hidden transition-colors hover:bg-[#1C1D1F]`.
    4. Ô ngày hôm nay (Today): Đánh dấu bằng hình tròn màu xanh Google `#1A73E8` nổi bật, không làm méo lưới.

### File 5: `src/components/calendar/WeekTimelineView.tsx`
- **Hành động:** Chuẩn hóa Design System và tương thích Full-Height.
- **Chi tiết:**
  - Xóa class `apple-glass-card rounded-3xl` tại dòng 53. Thay bằng container Material 3 chuẩn `bg-[#1F2021] border border-[#2A2B2D] rounded-xl`.
  - Đảm bảo cuộn mượt nội bộ cho timeline mà không ảnh hưởng tới layout tổng thể.

### File 6: `src/components/calendar/ProductivityKPI.tsx`
- **Hành động:** Tái cấu trúc thành Collapsible Bottom Strip (Dải trạng thái chân trang có thể mở rộng).
- **Chi tiết:**
  - Thiết kế dải mỏng 32px ở cạnh đáy canvas:
    - Bên trái: Icon năng suất + Text tóm tắt (`Hiệu suất tuần: 87.5% Hoàn thành • Chuỗi 21 ngày`).
    - Bên phải: Nút "Xuất PDF" mỏng nhẹ + Nút mũi tên mở rộng/thu gọn drawer.
  - Bổ sung state `isKpiExpanded` (mặc định là `false` để ưu tiên diện tích cho Lịch).
  - Khi mở rộng: Hiển thị 3 card chi tiết phía trên thanh strip bằng animation trượt êm ái.

### File 7: `src/components/sidebar/RightSidebar.tsx`
- **Hành động:** Loại bỏ các thành phần rác thương mại AI và tối ưu danh sách việc cần làm.
- **Chi tiết:**
  - Xóa bỏ thẻ "Trợ lý AI Gợi ý Task" kèm icon khóa (L116-140).
  - Xóa bỏ thông báo đỏ dọa hết quota 10 task (L162-166).
  - Thay thế bằng thanh Filter Tabs công việc thực tế: `Tất cả` | `Hôm nay` | `Quan trọng`.
  - Tối ưu hóa form thêm nhanh việc cần làm và danh sách subtask phẳng, rõ nét.

### File 8: `src/index.css`
- **Hành động:** Dọn dẹp rác CSS và chuẩn hóa token.
- **Chi tiết:**
  - Xóa sạch các class alias `apple-glass-*`, `apple-btn-primary`, `apple-input`.
  - Giữ lại các class tiện ích chuẩn và đảm bảo thanh cuộn mỏng tối giản.

---

## 5. Phương Án Xác Minh & Đảm Bảo An Toàn (Verification & Preservation)

1. **Bảo toàn dữ liệu & Logic cũ:**
   - Tuyệt đối giữ nguyên toàn bộ State trong `AppContext` (`eventsData`, `tasksData`, `selectedDay`, `selectedMonth`, `selectedYear`, các hàm thêm/xóa/sửa event và task).
   - Giữ nguyên cơ chế mở Modal tạo lịch trình, Drawer chi tiết ngày `DayInspectorDrawer` và hệ thống thông báo `Toast`.
2. **Kiểm thử hiển thị trên các độ phân giải màn hình:**
   - Màn hình laptop tiêu chuẩn (1366 x 768): Lưới lịch tháng hiển thị đầy đủ cả 5 hàng tuần mà không xuất hiện thanh cuộn dọc ngoài.
   - Màn hình desktop lớn (1920 x 1080): Lưới lịch tự co giãn cân đối (Fluid Liquid Grid).
3. **Kiểm thử tương tác:**
   - Click chuyển tháng/năm trên TopHeader cập nhật ngay lập tức dữ liệu của `MonthGridView`.
   - Click vào ô ngày mở đúng modal tạo/sửa sự kiện.
   - Nút thu gọn/mở rộng Bottom KPI Strip hoạt động trơn tru.

---

*Kế hoạch được khởi tạo tự động bởi skill `ui-redesign-planner`.*
