# Kế Hoạch Chỉnh Sửa & Tái Thiết Kế Giao Diện Toàn Diện (Full-System UI Redesign Plan)

* **Dựa trên báo cáo kiểm định:** `docs/ui-audits/ui_audit_full_system.md`
* **Tiêu chuẩn thiết kế:** Clean Anti-Slop System (MengTo Principles + Google Material 3 Dark Architecture)
* **Phân hệ thực hiện:** Toàn bộ Frontend người dùng (`Frontend_Usersite_Web`)
* **Trạng thái:** Chờ phê duyệt (Pending User Approval) - **Tuyệt đối không sửa code trước khi được cho phép**

---

## 1. Mục Tiêu Cải Tiến Cốt Lõi (Core Objectives)

1. **Thống nhất ngôn ngữ thiết kế toàn hệ thống (Unified Dark Material 3 System):**
   - Loại bỏ triệt để hiện tượng "đa nhân cách thiết kế": chấm dứt tình trạng Auth và Modal mang vỏ bọc Apple Glass bóng bẩy (`rounded-[32px]`, `backdrop-blur-xl`, gradient xanh tím), trong khi Dashboard lại là Google Calendar Dark.
   - Chuẩn hóa toàn bộ: Background `#121314`, Surface `#1F2021`, High Surface `#28292A`, Viền mảnh `#2A2B2D` / `#333538`, Bo góc có kỷ luật (`rounded-lg` 8px, `rounded-xl` 12px, `rounded-2xl` 16px).
2. **Khắc phục lỗi logic phá hủy trải nghiệm Calendar:**
   - Mở rộng mảng giờ hiển thị của [WeekTimelineView.tsx](file:///e:/SideProject/Frontend_Usersite_Web/src/components/calendar/WeekTimelineView.tsx) thành đầy đủ 24 giờ / dải giờ liên tục từ 06:00 đến 23:00 (cả giờ chẵn và giờ lẻ).
   - Đổi logic lấy sự kiện từ `.find()` sang `.filter()` để hiển thị nhiều sự kiện trùng khung giờ, giải phóng layout khỏi Bento Box co cụm.
   - Hồi sinh [AgendaListView.tsx](file:///e:/SideProject/Frontend_Usersite_Web/src/components/calendar/AgendaListView.tsx): tích hợp nút "Lịch biểu" vào TopHeader thành 3 chế độ xem hoàn chỉnh (`Tháng` | `Tuần` | `Lịch biểu`).
3. **Triệt tiêu toàn bộ mã nguồn ảo giác, tính năng bù nhìn và dữ liệu giả mạo:**
   - Xóa sạch class ảo giác: `ambient-glow-1`, `ambient-glow-2`, `liquid-portal-card`, `liquid-glass-card`, `liquid-glass-pill`.
   - Hiện thực hóa Theme Engine: Định nghĩa biến CSS thực tế trong `index.css` cho các chủ đề để đổi màu giao diện thật 100%, hoặc tinh gọn về bộ theme thực thụ.
   - Xóa bỏ dữ liệu hardcode giả mạo trong [EventDetailModal.tsx](file:///e:/SideProject/Frontend_Usersite_Web/src/components/modals/EventDetailModal.tsx) ("8.4 km / 25 phút / 13:35 PM") và kết nối dữ liệu động của sự kiện.
   - Kết nối "Màn hình ma" [DayInspectorDrawer.tsx](file:///e:/SideProject/Frontend_Usersite_Web/src/components/calendar/DayInspectorDrawer.tsx) thông qua thao tác double click hoặc phím tắt trên lưới lịch.
   - Dọn dẹp dứt điểm các file mồ côi: `FlashSaleBanner.tsx`, `CalendarControls.tsx`.

---

## 2. So Sánh Kiến Trúc Bố Cục (Before vs. After)

| Thành Phần / Màn Hình | Hiện Trạng (Dính AI Slop & Lỗi) | Thiết Kế Mới Đề Xuất (Clean Anti-Slop) | Lợi Ích Trải Nghiệm Mang Lại |
|---|---|---|---|
| **Cổng Xác Thực (Auth Portal)** | Nền sáng `bg-slate-100`, card khổng lồ `rounded-[32px]`, div ảo giác `ambient-glow`, văn mẫu sáo rỗng "Apple Liquid Glass" | Giao diện tối sang trọng (Dark Slate `#121314`), card viền mỏng tinh tế, typo tinh gọn, thông điệp tập trung vào năng suất | Đồng bộ thị giác 100% với không gian làm việc sau khi đăng nhập, loại bỏ rác DOM |
| **Lịch Tuần (Week Timeline View)** | Chỉ có giờ chẵn (cách nhau 2 tiếng), sự kiện giờ lẻ biến mất; dùng `.find()` làm mất sự kiện trùng giờ; bọc vào Bento Box cuộn ngang | Dải giờ liên tục 06:00 – 23:00; hiển thị đa sự kiện cùng giờ (`.filter`); bố cục Liquid tràn viền chia 7 cột mượt mà | Không còn sót lịch trình của người dùng, tận dụng tối đa không gian màn hình |
| **Lịch Biểu (Agenda View)** | Bị bỏ xó trong mã nguồn (mồ côi), không có cách nào bật lên; style Apple Glass cũ kỹ | Thêm lựa chọn "Lịch biểu" vào View Switcher ở Top Header; chuyển đổi theme sang Google Dark Mode sạch sẽ | Khôi phục tính năng xem danh sách lịch trình theo dòng thời gian chuẩn Google Workspace |
| **Chi Tiết Ngày (Day Inspector Drawer)** | 246 dòng mã bị "bỏ quên", không có bất kỳ nút nào mở được; class style lai tạp | Kích hoạt khi double-click vào ô ngày trên Month Grid; trượt vào bằng hiệu ứng slide mượt mà, style Dark Slate | Bổ sung thao tác soi nhanh lịch trình trong ngày mà không cần mở modal toàn màn hình |
| **Modal Chi Tiết Sự Kiện (Event Detail)** | Lộ trình bị fix cứng "8.4 km / 25 phút / 13:35 PM" cho mọi sự kiện; style Apple Glass mờ | Chỉ hiển thị thông tin lộ trình và nhắc nhở khi sự kiện có `location` / `travelTime`; chuyển sang Dark Material Modal | Dữ liệu chính xác, trung thực, loại bỏ cảm giác giả mạo |
| **Hệ Thống Theme (Settings Modal)** | 5 theme quảng cáo nhưng CSS không có code, chọn theme màn hình không đổi | Định nghĩa bộ biến CSS thực tế (`--accent-color`, `--surface-tint`) trong `index.css` cho các chủ đề hoạt động thật | Tính năng có giá trị sử dụng thật, không còn là "bánh vẽ" AI |
| **Thanh Điều Hướng & Profile Dropdown** | Nút Profile, Giao diện, Thiết bị bấm vào đều mở tab mặc định; Banner Flash Sale rác | Truyền đúng tham số `tab` vào modal Settings; xóa bỏ hoàn toàn mã `FlashSaleBanner.tsx` | Điều hướng chuẩn xác 1-chạm, giao diện chuyên nghiệp không mùi e-commerce |
| **Lịch Hẹn Booking (Appointment Modal)** | Hardcode dải ngày "13–19 Sep 2026", lưu cứng ngày 15; nút "Tùy chọn khác" từ Create Modal trỏ nhầm sang đây | Dải ngày động theo tuần hiện tại của tháng được chọn; lưu đúng ngày; sửa nút "Tùy chọn khác" thành mở rộng form sự kiện | Trở thành module cấu hình khung giờ làm việc thực chất và logic |

---

## 3. Hệ Thống Design Tokens & Quy Chuẩn Thẩm Mỹ Mới (Anti-Slop Specs)

### 3.1. Bảng Màu Chuẩn (Material 3 Dark Workspace Palette)
* **Nền tảng (Canvas Base):** `#121314` (Neutral dark tuyệt đối, chống mỏi mắt)
* **Bề mặt hộp chứa (Surface Container):** `#1F2021` (Container chính), `#1B1C1D` (Container thấp), `#28292A` (Hover & Container cao)
* **Hệ thống viền (Borders):** `#2A2B2D` (Lưới lịch & phân cách chính), `#333538` (Viền nút & input tương tác)
* **Văn bản (Typography Contrast - WCAG AAA):**
  - Chữ chính (High Emphasis): `#E3E2E3` (Tương phản cao)
  - Chữ phụ (Medium Emphasis): `#9AA0A6` (Thông tin bổ trợ, nhãn mô tả)
  - Chữ mờ (Muted / Disabled): `#70757A` (Placeholder, watermark)
* **Màu ngữ nghĩa chức năng (Semantic Accents):**
  - Google Blue: `#8AB4F8` (Sự kiện, active tab, focus ring)
  - Google Green: `#81C995` (Công việc Tasks, trạng thái hoàn thành)
  - Google Amber: `#FDD663` (Thói quen Routine, chuỗi Streak)
  - Google Coral/Rose: `#F28B82` (Mức độ ưu tiên cao, nút xóa)

### 3.2. Quy Chuẩn Bo Góc & Đổ Bóng (Radii & Shadows)
* **Nút bấm & Chip:** `rounded-full` cho chip hành động (Tạo, Hôm nay), `rounded-lg` (8px) cho input và dropdown menu.
* **Modal & Dialog:** `rounded-2xl` (16px), loại bỏ hoàn toàn `rounded-[32px]` hay `rounded-[28px]` quá khổ.
* **Shadow:** `shadow-xl shadow-black/50` cho modal và dropdown, không dùng shadow màu lòe loẹt (`shadow-blue-500/25`).

---

## 4. Kế Hoạch Thay Đổi Từng File Mã Nguồn (Code Impact Plan)

### Giai Đoạn 1: Dọn Dẹp Mã Nguồn Rác & Chuẩn Hóa Design System CSS
1. **Xóa file rác/mồ côi:**
   - Xóa `src/components/layout/FlashSaleBanner.tsx`.
   - Xóa `src/components/calendar/CalendarControls.tsx`.
2. **Cập nhật `src/index.css`:**
   - Xóa bỏ các class alias lỗi thời kiểu Apple Glass (`.apple-glass-*`).
   - Bổ sung biến CSS và bộ theme hoạt động thực tế:
     - `.theme-dark` (Dark Obsidian OLED: nền `#080808`, surface `#141414`).
     - `.theme-tet` (Sắc Tết: accent `#E53935`, highlight vàng óng `#FFD54F`).
     - `.theme-christmas` (Giáng Sinh: accent `#2E7D32`, highlight tuyết bạc `#B2DFDB`).
     - `.theme-sakura` (Hoa Anh Đào: accent `#EC407A`, highlight hồng phấn `#F8BBD0`).

### Giai Đoạn 2: Tái Thiết Kế Cổng Xác Thực (Auth Portal)
3. **Cập nhật `src/components/auth/LoginPage.tsx`:**
   - Đổi nền sang Dark Slate `#0F1011` đồng bộ với ứng dụng.
   - Xóa bỏ các thẻ rỗng `ambient-glow-1`, `ambient-glow-2` và class ảo giác `liquid-portal-card`.
   - Định hình container form với viền mỏng `#2A2B2D`, bo góc `rounded-2xl`.
4. **Cập nhật `src/components/auth/AuthCarousel.tsx`:**
   - Xóa bỏ văn mẫu sáo rỗng "Apple Liquid Glass UI", "Đỉnh cao thẩm mỹ".
   - Tinh chỉnh các slide giới thiệu thành các tính năng thực tế: Lịch đồng bộ, Quản lý Thói quen theo chuỗi Streak, Danh sách Việc cần làm với Subtasks, Báo cáo hiệu suất.
   - Đồng bộ màu sắc bề mặt thẻ slide theo Material Dark.
5. **Cập nhật `src/components/auth/AuthForm.tsx`:**
   - Xóa bỏ dòng chữ giả mạo "Bảo mật 2 lớp SSL 256-bit".
   - Chuyển toàn bộ input, nút bấm sang chuẩn dark tokens (`bg-[#1F2021]`, `border-[#333538]`, text trắng sáng).

### Giai Đoạn 3: Sửa Chữa Trọng Tâm Màn Hình Lịch (Calendar Core)
6. **Cập nhật `src/components/calendar/WeekTimelineView.tsx`:**
   - Mở rộng mảng `hours` đầy đủ các mốc giờ từ 06:00 AM đến 23:00 PM (18 khung giờ liên tục).
   - Đổi hàm tìm sự kiện từ `.find()` sang `.filter()`: Render toàn bộ danh sách sự kiện trong khung giờ dưới dạng các chip nhỏ xếp chồng hoặc cạnh nhau, có title và click mở chi tiết.
   - Loại bỏ Bento Card bao quanh (`rounded-xl p-4`) và thanh cuộn ngang `min-w-[580px]`; chuyển thành lưới 7 cột tràn màn hình (liquid layout) với header thứ/ngày sticky phía trên.
7. **Cập nhật `src/components/layout/TopHeader.tsx` & `AppLayout.tsx`:**
   - Thêm nút "Lịch biểu" (Agenda) vào bộ chọn View Switcher: `[Tháng | Tuần | Lịch biểu]`.
   - Kết nối `calendarView === 'agenda'` để render component `AgendaListView`.
8. **Cập nhật `src/components/calendar/AgendaListView.tsx`:**
   - Xóa sạch các class cũ `apple-glass-card`, `apple-glass-pill`, `apple-btn-primary`.
   - Chuẩn hóa layout theo danh sách thời gian phẳng (Timeline Stream) đồng bộ Material 3 Dark.
9. **Kích hoạt `src/components/calendar/DayInspectorDrawer.tsx`:**
   - Trong `MonthGridView.tsx`: Thêm sự kiện double click vào ô ngày `onDoubleClick={() => openDayInspector(d)}`.
   - Đồng bộ giao diện `DayInspectorDrawer.tsx` sang dark theme `#1F2021`, loại bỏ các class `apple-glass-*`.

### Giai Đoạn 4: Chuẩn Hóa Hệ Thống Modal & Sửa Lỗi Logic Dữ Liệu
10. **Cập nhật `src/components/modals/EventDetailModal.tsx`:**
    - Xóa bỏ dải dữ liệu hardcode "8.4 km / 25 phút / 13:35 PM".
    - Chỉ render thông tin di chuyển khi `event.location` hoặc `event.travelTime` có dữ liệu thực tế từ mock/người dùng nhập.
    - Chuyển cấu trúc modal sang Material 3 Dark Modal chuẩn (`bg-[#1F2021]`, viền `#333538`, bo góc 16px).
11. **Cập nhật `src/components/modals/CreateEventModal.tsx`:**
    - Sửa nút "Tùy chọn khác": Thay vì mở `appointment-schedule`, đổi thành toggle mở rộng/thu gọn các thiết lập nâng cao (Mô tả chi tiết, Độ bận/rảnh, Tần suất lặp lại nâng cao).
12. **Cập nhật `src/components/modals/SettingsModal.tsx`:**
    - Thêm prop hoặc nhận `initialTab` từ context để mở đúng tab được yêu cầu từ `UserProfileDropdown`.
    - Kết nối bộ chọn theme với CSS Variables đã tạo ở Giai đoạn 1 để giao diện đổi màu thật khi chuyển theme.
13. **Cập nhật `src/components/modals/AppointmentScheduleModal.tsx`:**
    - Thay thế dải ngày hardcode "13-19 Sep 2026" bằng tính toán ngày thực tế theo tuần của `selectedDay`, `selectedMonth`, `selectedYear`.
    - Lưu sự kiện vào đúng ngày người dùng đang chọn thay vì gán cứng ngày 15.
14. **Cập nhật `src/components/modals/CheckoutModal.tsx`, `LimitModal.tsx`, `RecurringActionModal.tsx`:**
    - Chuyển toàn bộ khung viền, typography và nút bấm từ phong cách Apple Glass sang Google Workspace Dark Theme.
15. **Cập nhật `src/components/sidebar/LeftSidebar.tsx` & `RightSidebar.tsx`:**
    - Loại bỏ input "Tìm người..." vô dụng hoặc gắn state lọc danh bạ.
    - Xóa bỏ đèn chớp giả tạo `animate-pulse` "Đã đồng bộ".
    - Tinh gọn tab danh bạ ở Right Sidebar.

---

## 5. Phương Án Xác Minh Sau Chỉnh Sửa (Verification Plan)

Sau khi hoàn tất việc chỉnh sửa mã nguồn, các bước kiểm thử sau đây sẽ được thực hiện để đảm bảo hệ thống không bị lỗi hồi quy (regression):

1. **Kiểm tra Lịch Tuần (Week Timeline):**
   - Tạo sự kiện lúc `07:30 AM` (giờ lẻ) và kiểm tra sự kiện hiển thị chuẩn xác trên lưới tuần.
   - Tạo 2 sự kiện cùng lúc `09:00 AM` và xác nhận cả 2 đều hiển thị, không bị nuốt mất sự kiện nào.
2. **Kiểm tra Chuyển Đổi Chế Độ Xem (View Switching):**
   - Chuyển qua lại mượt mà giữa 3 chế độ: `Tháng` -> `Tuần` -> `Lịch biểu` (Agenda).
3. **Kiểm tra Drawer Chi Tiết Ngày:**
   - Double-click vào một ngày bất kỳ trên lưới tháng: Drawer `DayInspectorDrawer` phải trượt ra từ bên phải, hiển thị đúng các sự kiện của ngày đó.
4. **Kiểm tra Theme Engine:**
   - Vào Settings -> Giao diện -> Chuyển sang theme Tết 2026 hoặc Dark Obsidian: Toàn bộ thanh viền, màu nhấn accent của ứng dụng phải đổi màu thật.
5. **Kiểm tra Tính Đồng Nhất Giao Diện:**
   - Kiểm tra màn hình đăng nhập, modal tạo sự kiện, modal chi tiết và modal thanh toán: Đảm bảo cùng chung một hệ thống thiết kế Dark Workspace, không còn vết tích của Apple Glass sáng chói hay class ảo giác rác.
6. **Kiểm tra Bảo Toàn Logic:**
   - Thao tác thêm/sửa/xóa Task, Subtask, Routine, Check-in, Đổi ngôn ngữ VI/EN vẫn hoạt động trơn tru 100% không bị ảnh hưởng.

---

*Kế hoạch được lập tự động bởi Skill 2: `ui-redesign-planner`.*
