# Hồ Sơ Thiết Kế Giao Diện Mới: Hệ Thống Giao Diện Di Động RoutinePulse (Mobile App Suite)

* **Ngày thiết kế:** 2026-10-20
* **Archetype:** Focused Productivity Workspace / Mobile Calendar & Habit Suite
* **Thiết bị mục tiêu:** Mobile (390px - 412px, Tối ưu hóa chuẩn iOS/Android Ergonomics)
* **Công cụ thực hiện:** Stitch MCP + MengTo Anti-Slop Suite (Obsidian Swiss Precision)
* **Stitch Project ID:** `7957729313718763106` | **Screen IDs:**
  - Screen 1 (Calendar & Agenda Hub): `baad11b10eaa46cd87b56deed71a5754`
  - Screen 2 (Habit & Routine Tracker): `c03d0c5862c54679ab6d4434bae55601`
  - Screen 3 (Create Event/Routine Sheet): `75d37edaf1504ca4bcc8860791cd0167`
* **File Showcase Tương Tác 100% Tính Năng (Interactive Prototype):**
  - [mobile_suite_showcase.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_suite_showcase.html) *(Thao tác chuyển tab, đổi view lịch, tick hoàn thành việc/thói quen, mở modal, đổi theme, đăng xuất trực tiếp)*
* **Danh Mục 8 Màn Hình Mockup Độc Lập:**
  1. [mobile_calendar_hub_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_calendar_hub_mockup.html) (Hub Lịch Tháng, Tuần, Lịch biểu & Sticky Week Strip)
  2. [mobile_routine_tracker_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_routine_tracker_mockup.html) (Kỷ luật thói quen theo ca, Streak lửa 🔥 & Heatmap)
  3. [mobile_create_sheet_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_create_sheet_mockup.html) (Bottom Sheet tạo Sự kiện / Thói quen / Task)
  4. [mobile_tasks_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_tasks_mockup.html) (Quản lý việc cần làm, ưu tiên & Subtasks)
  5. [mobile_notes_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_notes_mockup.html) (Ghi chú Keep Notes thẻ màu, ghim & checklist)
  6. [mobile_appointment_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_appointment_mockup.html) (Lịch hẹn đặt trước Appointment Hub & link chia sẻ)
  7. [mobile_profile_settings_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_profile_settings_mockup.html) (Hồ sơ, Cài đặt theme, Gói cước & VietQR)
  8. [mobile_auth_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_auth_mockup.html) (Cổng Đăng nhập / Đăng ký di động)

---

## 1. Mục Tiêu Nghiệp Vụ & Kiến Trúc Trải Nghiệm (UX Architecture)

### 1.1. Bối cảnh & Thách thức di động
Bản Web hiện tại trên `Frontend_Usersite_Web` sử dụng kiến trúc **Liquid 3 cột**:
- Cột trái: Mini calendar, bộ lọc danh mục sự kiện, phím tắt đặt hẹn.
- Cột giữa: Lưới Lịch Tháng (Month), Tuần (Week), hoặc Lịch biểu (Agenda), kèm dải KPI năng suất.
- Cột phải: Companion Dock 3 tab gồm Tasks (Công việc), Keep Notes & Routines (Kỷ luật thói quen & ghi chú), Contacts (Danh bạ).
- Lớp trên: Các Modal lớn như `CreateEventModal`, `AppointmentScheduleModal`, `SettingsModal`, `CheckoutModal`.

Khi chuyển đổi sang **Mobile App (Màn hình 390px x 844px)**, việc nhồi nhét 3 cột vào một màn hình sẽ gây ra "thảm họa công thái học" (Card fatigue, chữ bé lí tí, cuộn ngang hỗn loạn). Do đó, giao diện Mobile phải tái cấu trúc theo **Mô hình 5 Tab Navigation Ergonomics** với **Action Sheet / Bottom Sheet động**, bảo toàn 100% tính năng nhưng thao tác trơn tru bằng ngón tay cái (Thumb-zone optimized).

### 1.2. Job-to-be-Done Cốt lõi (JTBD)
1. **Quản lý thời gian & Xem lịch trình 1-chạm (Calendar Hub):** Người dùng lướt nhanh lịch trình ngày/tuần/tháng, chuyển đổi chế độ xem mượt mà, nắm bắt ngay các cuộc họp Google Meet và các khung giờ bận/rảnh.
2. **Kỷ luật thói quen & Chuỗi Streak không độ trễ (Habit Check-in):** Điểm danh thói quen buổi sáng/trưa/tối trong tích tắc, quan sát streak lửa 🔥, tiến độ nhiệm vụ con (subroutines) và biểu đồ hiệu suất ngày.
3. **Thu nạp ý tưởng & Việc cần làm (Frictionless Capture):** Bấm FAB `+` để bật Bottom Sheet tạo nhanh Sự kiện, Thói quen, Công việc hoặc Ghi chú với đầy đủ tùy chọn lặp lại, nhắc nhở, địa điểm và thời gian di chuyển.
4. **Chia sẻ lịch hẹn & Đặt chỗ công khai (Appointment Booking):** Bật/tắt các thứ trong tuần, thiết lập các khoảng giờ rảnh và chia sẻ link đặt lịch cá nhân.

---

## 2. Bố Cục Không Gian (Spatial Layout & Wireframe)

### 2.1. Phân Vùng Công Thái Học (Mobile Ergonomic Zones)
* **Vùng Quét Mắt (Top Safe Zone - 0 to 120px):**
  - **Top App Bar (56px):** Tiêu đề tháng/năm, công tắc chuyển đổi chế độ xem dạng Segmented Pill `[Tháng | Tuần | Biểu]`, nút tìm kiếm và Avatar người dùng.
  - Áp dụng kỹ thuật **Progressive Blur** (`backdrop-blur-md bg-[#121314]/90`) giúp nội dung bên dưới khi cuộn không bị che khuất thô bạo.
* **Vùng Tương Tác Cốt Lõi (Middle Viewport - 120px to 680px):**
  - **Dải Tuần Mini (Sticky Week Strip):** Hiển thị 7 ngày trong tuần với số ngày và các chấm màu chỉ báo trạng thái (Amber cho Routine, Blue cho Event, Green cho Task).
  - **Dải Đo Lường Năng Suất (Habit & KPI Strip):** Thanh đo hiệu suất ngày (VD: `85%`) kèm chuỗi streak lửa và thanh tiến độ gradient mảnh 4px.
  - **Dòng Sự Kiện / Thói Quen (Chronological Feed):** Các thẻ sự kiện một tầng (Single-tier Cards), không lồng thẻ, có phân màu theo danh mục và chỉ báo trạng thái rõ ràng.
* **Vùng Ngón Cái Thao Tác (Bottom Thumb Zone - 680px to 844px):**
  - **Floating Action Button (FAB - 56px):** Nút tròn màu Google Blue `#8AB4F8` nổi bật bên góc phải dưới, cách thanh tab 16px, kích hoạt nhanh Bottom Sheet tạo mới.
  - **Thanh Điều Hướng Đáy (Bottom Navigation Bar - 64px):** 5 tab điều hướng chính có nhãn tiếng Việt và icon trực quan:
    1. `Lịch` (Calendar)
    2. `Kỷ luật` (Routines)
    3. `Việc làm` (Tasks)
    4. `Ghi chú` (Notes)
    5. `Cá nhân` (Profile, Settings, Booking & Subscription)

---

## 3. Hệ Thống Token Thiết Kế (Design System Tokens - Obsidian Swiss Precision)

### 3.1. Surface & Layering Architecture
* `surface-base` (Canvas nền tảng): `#121314` (Neutral dark sâu thẳm, chống mỏi mắt và tiết kiệm pin OLED).
* `surface-container` (Khối thẻ & danh sách): `#1F2021` (Tách lớp tự nhiên bằng độ sáng).
* `surface-container-high` (Khối active, dropdown, popover): `#28292A` / `#292A2B`.
* `surface-container-highest` (Hover, badge container): `#343536`.
* `border-subtle` (Viền cấu trúc phân định): `#2A2B2D` (Khắc kỷ 1px hairline, cấm viền đậm).
* `border-interactive` (Trạng thái focus/active): `#8AB4F8` hoặc `#81C995`.

### 3.2. Color Palette & Functional Accents
* **Google Blue (`#8AB4F8`):** Màu thương hiệu cốt lõi, Sự kiện lịch, Active tab, Nút CTA chính.
* **Habit Amber (`#FDD663`):** Kỷ luật thói quen, Chuỗi ngày Streak 🔥, Cảnh báo thời gian.
* **Task Green (`#81C995`):** Công việc việc cần làm, Checkbox hoàn thành, Hiệu suất tích cực.
* **Danger / Priority Coral (`#F28B82`):** Mức độ ưu tiên cao, Hủy / Xóa, Quá hạn.
* **Note Purple (`#C58AF9`):** Ghi chú cá nhân, Thẻ ý tưởng đặc biệt.

### 3.3. Typography Hierarchy
* **Font Family:** `Inter` (Nội dung văn bản, tiêu đề) phối hợp `Roboto Flex` (Chữ số tabular, đồng hồ đếm, nhãn hệ thống).
* **Quy chuẩn kích thước:**
  - `headline-sm` / `title-md`: 16px - 20px (font-semibold, letter-spacing -0.01em)
  - `body-md`: 14px (font-normal, line-height 20px)
  - `label-sm`: 11px - 12px (font-medium, uppercase có chọn lọc)
  - `data-metric`: Chữ số tabular (`font-variant-numeric: tabular-nums`) cho thời gian và tỷ lệ phần trăm streak.

### 3.4. MengTo Craft Touches
* **Progressive Blur:** Áp dụng cho Top Header (`backdrop-blur-md bg-[#121314]/90`) và viền trượt của Bottom Sheet (`rgba(0,0,0,0.75)`).
* **Tonal Bordering:** Thay thế bóng đổ nặng nề bằng viền mảnh 1px `#2A2B2D`, chỉ kích hoạt sáng viền `#8AB4F8` khi chạm hoặc kích hoạt.
* **Micro-interactions:** Hiệu ứng co dãn nhẹ khi ấn (`active:scale-95`), thời lượng chuyển cảnh Bottom Sheet trượt lên trong 250ms với easing `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 4. Danh Mục Thành Phần Giao Diện (Component Specifications)

| Thành phần | Phân loại | Dữ liệu hiển thị | Hành vi tương tác |
|---|---|---|---|
| **Top App Bar** | Sticky Header (56px) | Tháng/Năm, View Switcher [Tháng/Tuần/Biểu], Icon tìm kiếm, Avatar | Chạm vào Tháng mở Date Picker; Chuyển đổi tab xem mượt mà |
| **Sticky Week Strip** | Horizontal Strip | 7 ngày trong tuần, số ngày, chấm sự kiện | Chạm ngày để chuyển tiêu điểm; Ngày hôm nay được bọc pill `#8AB4F8` |
| **Habit Telemetry Strip** | Metric Widget | Tỷ lệ hoàn thành hôm nay (85%), Chuỗi 14 ngày 🔥, Progress bar | Chạm để chuyển nhanh sang tab Kỷ luật |
| **Agenda Feed** | Chronological List | Giờ, Loại thẻ (Thói quen / Sự kiện / Nhiệm vụ), Tiêu đề, Badge Meet/Vị trí | Chạm vào thẻ mở Chi tiết; Chạm checkbox thói quen để điểm danh ngay |
| **Habit Section List** | Grouped Cards | Ca sáng/chiều/tối, Tên thói quen, Streak ngày, Danh sách việc con | Checkbox 1-chạm hoàn tất; Mở rộng xem Subroutines |
| **Create Bottom Sheet** | Modal Sheet (92% H) | Switcher [Sự kiện/Thói quen/Việc làm], Tiêu đề, Giờ, Meet, Địa điểm, Màu, Ưu tiên | Trượt từ đáy màn hình; Hủy hoặc Lưu dữ liệu vào hệ thống |
| **Bottom Navigation** | Fixed Dock (64px) | 5 tab: Lịch, Kỷ luật, Việc làm, Ghi chú, Cá nhân | Phân chia ngón tay cái tối ưu; Chỉ báo tab active rõ ràng |

---

## 5. Danh Mục Đã Kiểm Định Anti-Slop (Quality Gate Passed)

- [x] **Không nhồi nhét hiệu ứng trang trí thừa (No decorative stacking):** Không dùng bóng đổ mờ mịt khổng lồ, không xếp lớp neon glow hay hiệu ứng kính mờ ảo giác.
- [x] **Không bọc Card lồng Card (No container fatigue):** Mỗi sự kiện là một thẻ phẳng đơn tầng độc lập, cấu trúc padding gọn gàng 12px - 14px.
- [x] **Không câu chữ AI sáo rỗng (Clean concise copy):** Toàn bộ nhãn bằng tiếng Việt chuẩn xác (*"Kỷ luật & Thói quen"*, *"Lịch biểu hôm nay"*, *"Họp Google Meet"*), không thêm các nhãn "PRO AI", "VIP" thừa thãi.
- [x] **Công thái học ngón tay cái (Ergonomics):** Tất cả nút bấm, checkbox, trường nhập liệu đều đạt chuẩn chiều cao tối thiểu 44px - 48px.
- [x] **Độ tương phản màu sắc đạt chuẩn WCAG AAA:** Chữ trắng sáng `#E3E2E3` trên nền tối `#121314` đạt tỷ lệ tương phản > 12:1.

---

## 6. Liên Kết Preview & Chuyển Giao Lập Trình

* **Showcase Trực Quan Tổng Hợp:** [mobile_suite_showcase.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/mobile_suite_showcase.html)
* **Kế Hoạch Triển Khai Chi Tiết:** [mobile_app_ui_design_plan.md](file:///e:/SideProject/Frontend_Usersite_Web/docs/mobile_app_ui_design_plan.md)
* **Sẵn sàng chuyển giao:** Khi người dùng phê duyệt phương án thiết kế, kích hoạt `ui-clean-coder` để lập trình cấu trúc giao diện và component vào mã nguồn.
