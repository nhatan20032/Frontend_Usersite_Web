# Hồ Sơ Thiết Kế Giao Diện: Companion Panel "Ghi Chú & Routine" (Keep Notes & Routine Sidebar)

* **Ngày thiết kế:** 2026-09-16 (Đã cập nhật theo yêu cầu thực tế)
* **Phân loại kiến trúc:** **Right Companion Sidebar Panel** (Thanh chức năng bên phải, độ rộng 360px docked cạnh Lịch)
* **Cơ chế kích hoạt:** Bấm vào biểu tượng **Bóng đèn (Google Keep & Routine)** trên thanh Dock công cụ bên phải (56px)
* **Công cụ thực hiện:** Stitch MCP + MengTo Anti-Slop Suite
* **Stitch Project ID:** `14319920441420585833` | **Screen ID:** `889fa8405f204da297f6e3c7e3e4cb71`
* **File Mockup Preview:** [notes_and_routines_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/notes_and_routines_mockup.html)
* **Ảnh Chụp Render Thực Tế:** [notes_and_routines_mockup.png](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/notes_and_routines_mockup.png)

---

## 1. Bản Chất Nghiệp Vụ & Bối Cảnh Sử Dụng (Context & JTBD)

### A. Vị trí chính xác trong ứng dụng:
- Đây **không phải là trang web toàn màn hình (full-page)**, mà là một **Thanh bảng điều khiển đồng hành (Right Companion Sidebar Panel)** tương tự như Google Keep / Google Tasks nằm gọn bên phải màn hình Lịch làm việc (`Calendar Workspace`).
- Kích thước: Cố định rộng **360px** (`w-[360px]` hoặc `w-80`/`w-90`), cao 100% viewport (`h-full`), nằm liền kề thanh Dock công cụ 56px (`RightSidebarDock`).

### B. Nhiệm vụ cốt lõi (Job-to-be-Done):
1. **Điểm danh kỷ luật nhanh (1-Click Habit Routine Check-in):** Khi người dùng đang nhìn lịch trình ngày/tháng, chỉ cần liếc sang phải là có thể tick điểm danh các thói quen lặp lại (*Chạy bộ, Đọc sách, Uống nước, Thiền định*), xem streak ngày và tỷ lệ hoàn thành mà không phải rời màn hình làm việc.
2. **Ghi chú nhanh không độ trễ (Frictionless Keep Notes):** Nhập ngay ý tưởng, checklist phát sinh hay ghi chép cuộc họp vào ô Quick Add, ghim ghi chú quan trọng lên đầu.
3. **Chuyển đổi mượt mà giữa các tiện ích:** Cùng nằm chung trong hệ thống Sidebar phải với `Google Tasks` (tab việc cần làm) và `Danh bạ`.

---

## 2. Bố Cục Chi Tiết Thành Phần (Component Architecture)

Bố cục panel từ trên xuống dưới gồm 5 phân khu chức năng:

```
+-------------------------------------------------------------+
| 1. PANEL HEADER (48px)                                      |
|    [Icon Bóng đèn Amber] Ghi chú & Routine     [+]  [× Đóng] |
|    Subtitle: Kỷ luật & Ghi chép nhanh                       |
+-------------------------------------------------------------+
| 2. QUICK COMPOSER BAR (36px)                                |
|    [ Thêm ghi chú hoặc thói quen...               (•) [Thêm] |
+-------------------------------------------------------------+
| 3. KỶ LUẬT HÔM NAY (ROUTINES)                               |
|    [Badge: 3/4 Hoàn tất] [Badge: 14 ngày streak 🔥]         |
|    - [✓] Chạy bộ 30 phút buổi sáng    (06:00)   [18 ngày]   |
|    - [✓] Đọc sách chuyên môn 20 trang (07:00)   [14 ngày]   |
|    - [✓] Deep Work: Kiến trúc hệ thống (08:30)  [9 ngày]    |
|    - [○] Uống 2L nước & giãn cơ       (Cả ngày) [Chờ xong]  |
+-------------------------------------------------------------+
| 4. BỘ LỌC SUB-TABS:  [Tất cả]  [Đã ghim]  [Ghi chú]          |
+-------------------------------------------------------------+
| 5. DANH SÁCH GHI CHÚ (KEEP NOTES - Cuộn dọc mượt mà)        |
|    +-- Card Ghim Ưu Tiên (Viền Amber Soft 1px) ------------+ |
|    | [Pin] Kỷ luật & Thói quen cốt lõi                     | |
|    | • Ngủ trước 23:00, không màn hình xanh sau 22:30       | |
|    | • Review tiến độ qua checklist mỗi 17:30              | |
|    | #KỷLuật  #Mindset                                     | |
|    +-------------------------------------------------------+ |
|    +-- Card Ghi Chú Dự Án (Container Level 2) -------------+ |
|    | Kế hoạch Release v2.4 RoutinePulse         10:30 Hôm nay| |
|    | Tích hợp companion dock vào core-engine...             | |
|    | #DựÁnQ3                                               | |
|    +-------------------------------------------------------+ |
|    +-- Card Trích Dẫn Suy Ngẫm ----------------------------+ |
|    | Trích dẫn: Atomic Habits                              | |
|    | "Bạn không vươn lên tới tầm của mục tiêu..."           | |
|    | #Reading                                              | |
|    +-------------------------------------------------------+ |
+-------------------------------------------------------------+
| 6. PANEL FOOTER (28px)                                      |
|    (• Đã lưu tự động)               4 thói quen, 6 ghi chú |
+-------------------------------------------------------------+
```

---

## 3. Hệ Thống Token Thiết Kế Áp Dụng (Design System Tokens)

Theo đúng quy chuẩn Material 3 Dark theme của dự án `Frontend_Usersite_Web`:

* **Nền Panel (Surface Base):** `#121314`
* **Nền Card Ghi chú & Routine (Surface Container):** `#1F2021` (Viền hairline `1px solid #2A2B2D`, bo góc `rounded-lg` 8px)
* **Nền Thẻ Hover / Active (Surface High):** `#28292A`
* **Nền Ô nhập Quick Add (Surface Highest):** `#333538`
* **Màu Ngữ Nghĩa Đồng Bộ:**
  - **Thói quen & Ghim (Amber):** Icon & chữ `#FDD663`, nền mờ `rgba(227, 116, 0, 0.15)`, viền mờ `rgba(227, 116, 0, 0.35)`.
  - **Điểm danh Hoàn thành (Green):** Icon & chữ `#81C995`, nền mờ `rgba(30, 142, 62, 0.15)`.
  - **Tương tác Phụ (Blue):** `#8AB4F8`.
* **Trạng thái Active trên Dock 56px:**
  - Nút bóng đèn có background tròn `bg-[#FDD663]/15`, icon `text-[#FDD663]`, viền trái `border-l-2 border-[#FDD663]` báo hiệu panel đang mở.

---

## 4. Bảng Kiểm Định Lâm Sàng Anti-Slop (Quality Gate Passed)

- [x] **Đúng bản chất UX:** Được thiết kế chuẩn xác là 1 **Companion Sidebar Panel** (360px), không làm biến dạng hay nuốt chửng toàn bộ màn hình Lịch.
- [x] **Tận dụng không gian đa nhiệm:** Người dùng vẫn theo dõi được lưới Lịch tháng/tuần bên trái trong khi tương tác với Routine & Ghi chú bên phải.
- [x] **0% Rác AI Slop:** Không có banner quảng cáo, không văn mẫu VIP/PRO, không emoji đa sắc của hệ điều hành.
- [x] **Mật độ thông tin tối ưu:** Phông chữ `12-13px`, padding `p-3.5`, các mục thói quen và ghi chú vừa vặn trong tầm mắt, cuộn dọc êm ái.

---

## 5. Kế Hoạch Chuyển Giao Cho `ui-clean-coder`

Khi người dùng phê duyệt:
1. **Cập nhật `RightSidebarDock.tsx`:** Cho phép chọn giữa các tab:
   - `tasks` (Google Tasks - CheckSquare)
   - `notes-routine` (Ghi chú & Routine - Lightbulb)
   - `contacts` (Danh bạ - Users)
2. **Cập nhật `RightSidebar.tsx`:** Chuyển đổi linh hoạt nội dung hiển thị:
   - Nếu `activeTab === 'tasks'`: Hiển thị danh sách Google Tasks như hiện tại.
   - Nếu `activeTab === 'notes-routine'`: Hiển thị giao diện Companion Panel **Ghi chú & Routine** theo đúng bản thiết kế này!
3. **Bổ sung component con:** `RoutineChecklistSection.tsx`, `NotesListSection.tsx`, `QuickComposerBar.tsx`.
