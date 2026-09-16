# Báo Cáo Kiểm Định Giao Diện & Rà Soát AI Slop: Workspace Calendar

* **Ngày kiểm định:** 2026-09-16
* **File mục tiêu:** `src/components/layout/AppLayout.tsx`, `src/components/layout/FlashSaleBanner.tsx`, `src/components/layout/TopHeader.tsx`, `src/components/calendar/CalendarControls.tsx`, `src/components/calendar/MonthGridView.tsx`, `src/components/calendar/ProductivityKPI.tsx`, `src/components/sidebar/RightSidebar.tsx`, `src/index.css`, `stitch_preview_unified.html`
* **Tiêu chuẩn áp dụng:** MengTo Anti-Slop & UI Quality Standards (Skill 1: `ui-audit-reporter`)

---

## 1. Tổng Quan Chẩn Đoán (Executive Summary)

* **Bản chất màn hình:** Ứng dụng Quản lý Lịch biểu và Công việc cá nhân (Workspace Calendar & Tasks). Đối tượng sử dụng là cá nhân/chuyên gia cần sự tập trung cao độ, tốc độ thao tác nhanh, mật độ thông tin tối ưu và khả năng bao quát toàn bộ lịch trình tháng/tuần trên một màn hình duy nhất.
* **Vấn đề cốt lõi lớn nhất:** 
  1. **Hội chứng AI Slop thương mại rẻ tiền (SaaS Upsell Clutter):** Giao diện bị nhồi nhét thô bạo banner Flash Sale đếm ngược, badge VIP/PRO khắp nơi, cảnh báo giới hạn quota và thẻ "Trợ lý AI" vô giá trị.
  2. **Xung đột & lãng phí không gian dọc (Vertical Stacking Conflict):** Xếp chồng 3 thanh bar ở đỉnh đầu chiếm tới 150px chiều cao chết.
  3. **Lệch pha mật độ hiển thị (Density & Rhythm Mismatch):** Ép widget thống kê KPI vào chân lưới lịch tháng và bọc trong container có cuộn dọc (`overflow-y-auto`), phá hủy hoàn toàn tỷ lệ chuẩn 100% viewport của một ứng dụng Calendar chuyên nghiệp.
  4. **Chắp vá mã nguồn & phong cách (Style Inconsistency):** Trộn lẫn Apple Glassmorphism và Google Material 3 Dark theme.

---

## 2. Bảng Thống Kê Điểm Bất Cập (Findings Summary)

| STT | Vị Trí (File/Line/Component) | Phân Loại | Mức Độ | Triệu Chứng Cụ Thể |
|---|---|---|---|---|
| 1 | `FlashSaleBanner.tsx:L38-86` | Slop Pattern | **Cực kỳ nghiêm trọng** | Nhồi nhét ribbon "Flash Sale 2026" đếm ngược, giảm giá 40%, nút dùng thử 7 ngày trong app Calendar |
| 2 | `AppLayout.tsx:L23-40` | Quality Defect | **Nghiêm trọng** | Chồng 3 tầng thanh điều hướng (Flash Sale + TopHeader + CalendarControls) ngốn 150px chiều dọc |
| 3 | `AppLayout.tsx:L42-46` & `ProductivityKPI.tsx:L25` | Quality Defect | **Nghiêm trọng** | Lưới lịch tháng bị bọc padding `p-4 sm:p-6` và bắt cuộn chuột (`overflow-y-auto`) do bị nhét KPI ở chân |
| 4 | `TopHeader.tsx:L108-112` vs `CalendarControls.tsx:L66-69` | Slop Pattern | **Trung bình** | Trùng lặp hiển thị tháng/năm ("Tháng 9, 2026") trên 2 thanh bar đặt sát nhau |
| 5 | `TopHeader.tsx:L74, L153, L161` & `RightSidebar.tsx:L132, L162` | Slop Pattern | **Cao** | Rải rác văn mẫu AI, huy hiệu VIP/PRO, icon vương miện và thông báo dọa hết quota gây ức chế |
| 6 | `ProductivityKPI.tsx:L40-85` | Slop Pattern | **Trung bình** | Lạm dụng Bento Box 3 cột, card lồng card gây vụn vặt và chiếm dụng diện tích làm việc chính |
| 7 | `RightSidebar.tsx:L64` + `RightSidebarDock.tsx:L15` | Quality Defect | **Cao** | Chiều rộng sidebar + dock phải (376px) cộng sidebar trái (256px) chiếm hơn 46% chiều ngang màn hình |
| 8 | `WeekTimelineView.tsx:L53` & `index.css:L140-148` | Slop Pattern | **Cao** | Chắp vá class Apple Glassmorphism (`apple-glass-card`, `rounded-3xl`) vào hệ thống Material Design |
| 9 | `DayInspectorDrawer.tsx:L77` | Hallucination Defect | **Thấp** | Dùng class Tailwind ảo giác không chuẩn (`backdrop-blur-xs`) |
| 10 | `stitch_preview_unified.html:L89-120` | Hallucination Defect | **Thấp** | Khai báo fontFamily trùng tên với fontSize dẫn đến lặp class máy móc (`text-headline-sm font-headline-sm`) |

---

## 3. Bằng Chứng Chi Tiết & Phân Tích (Detailed Evidence)

### Vấn đề 1: Nhồi nhét Banner Flash Sale & Văn mẫu Upsell rẻ tiền vào công cụ làm việc
* **Vị trí:** `src/components/layout/FlashSaleBanner.tsx:Line 38-86`
* **Đoạn code vi phạm:**
```tsx
<div id="flashSaleBanner" className="apple-glass-surface px-4 py-1.5 min-h-[38px] text-xs flex flex-wrap items-center justify-between gap-3 border-b app-border flex-shrink-0 z-30 relative">
  <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
    Flash Sale 2026
  </span>
  <span className="app-text-secondary text-[11px] font-medium truncate">
    Gói Premium 1 năm ưu đãi <b>40%</b> còn <span className="font-bold text-blue-600 dark:text-sky-400">179.000đ</span>
  </span>
  ...
  <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
  <span>Còn lại:</span>
  <span className="font-bold text-blue-600 dark:text-sky-400 font-mono">{format2(timeLeft.hours)}</span>h : ...
```
* **Phân tích:** Đây là triệu chứng **Slop Pattern: Văn mẫu AI & Upsell Clutter**. Một ứng dụng Workspace/Calendar chuyên nghiệp không bao giờ treo một cái banner giảm giá Flash Sale đếm ngược giây như website bán quần áo thương mại điện tử ngay trên đầu vùng làm việc hàng ngày của người dùng.
* **Ảnh hưởng:** Phá vỡ sự tập trung, tạo cảm giác rẻ tiền, chiếm mất 38px chiều dọc quý giá.

---

### Vấn đề 2: Chồng 3 tầng Header ngốn 150px chiều cao màn hình
* **Vị trí:** `src/components/layout/AppLayout.tsx:Line 22-40`
* **Đoạn code vi phạm:**
```tsx
{/* 1. TOP FLASH SALE FROSTED RIBBON */}
<FlashSaleBanner />   {/* Chiếm 38px */}

{/* 2. TOP APP BAR (GOOGLE CALENDAR DARK HEADER) */}
<TopHeader />          {/* Chiếm 64px (h-16) */}

{/* 3. MAIN WORKSPACE */}
...
{/* Calendar Header Controls */}
<CalendarControls />   {/* Chiếm 48px (h-12) */}
```
* **Phân tích:** Đây là lỗi **Quality Defect: Layout Stacking Conflict**. Tổng chiều cao của 3 thanh bar này là `38px + 64px + 48px = 150px`. Trên màn hình laptop 1366x768 (với taskbar và browser header chiếm ~120px), phần viewport khả dụng chỉ còn khoảng 648px. Việc mất 150px cho header đồng nghĩa với việc mất gần 25% chiều cao hữu dụng chỉ cho các thanh tiêu đề rườm rà.
* **Ảnh hưởng:** Không gian hiển thị lưới lịch bị co dúm, người dùng buộc phải cuộn chuột để xem hết các tuần.

---

### Vấn đề 3: Phá vỡ tỷ lệ 100% Viewport của Lịch tháng do nhét KPI vào chân trang
* **Vị trí:** `src/components/layout/AppLayout.tsx:Line 41-47` & `src/components/calendar/ProductivityKPI.tsx:Line 25-86`
* **Đoạn code vi phạm:**
```tsx
{/* Main Scrollable Content Area */}
<div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
  {calendarView === 'month' && <MonthGridView />}
  {calendarView === 'week' && <WeekTimelineView />}
  <ProductivityKPI />
</div>
```
* **Phân tích:** Đây là lỗi **Quality Defect: Density & Rhythm Mismatch**. Bất kỳ ứng dụng Calendar chuẩn mực nào (Google Calendar, Apple Calendar, Outlook) cũng bắt buộc phải thiết kế màn hình Month View ở dạng **Liquid Full-Height Grid** (chiếm trọn 100% chiều cao của main canvas, không cuộn dọc). Việc bọc `MonthGridView` vào một container có `p-4 sm:p-6`, `space-y-6` và nhét thêm `ProductivityKPI` (chiếm hơn 200px) bên dưới làm cho lưới lịch bị cắt cụt, người dùng muốn xem tuần 4 và tuần 5 bắt buộc phải cuộn chuột xuống.
* **Ảnh hưởng:** Trải nghiệm xem lịch bị đứt gãy hoàn toàn. Người dùng không thể bao quát toàn bộ tháng trong nháy mắt.

---

### Vấn đề 4: Trùng lặp thông tin tháng/năm giữa 2 thanh điều khiển liền kề
* **Vị trí:** `src/components/layout/TopHeader.tsx:Line 108-112` và `src/components/calendar/CalendarControls.tsx:Line 66-69`
* **Đoạn code vi phạm:**
Trong `TopHeader.tsx`:
```tsx
<span className="text-sm sm:text-base font-medium text-[#E3E2E3] ml-1 whitespace-nowrap">
  {language === 'vi' ? `${monthNames[selectedMonth]}, ${selectedYear}` : ...}
</span>
```
Ngay phía dưới, trong `CalendarControls.tsx`:
```tsx
<div className="flex items-center gap-2">
  <span className="text-[#70757A] text-[11px] font-mono">
    {language === 'vi' ? `Tháng ${selectedMonth + 1}/${selectedYear}` : ...}
  </span>
</div>
```
* **Phân tích:** Đây là lỗi **Slop Pattern: Copy Clutter & Redundancy**. Hai dòng text cùng chỉ một thông tin ("Tháng 9, 2026" và "Tháng 9/2026") xuất hiện cách nhau chỉ 20px theo trục dọc.
* **Ảnh hưởng:** Thừa thãi, làm rối loạn tiêu điểm nhìn của người dùng.

---

### Vấn đề 5: Spam huy hiệu VIP/PRO, dọa khóa tính năng và thẻ "Trợ lý AI" giả tạo
* **Vị trí:** `src/components/layout/TopHeader.tsx:Line 153`, `src/components/sidebar/RightSidebar.tsx:Line 116-140, Line 162-166`
* **Đoạn code vi phạm:**
Trong `TopHeader.tsx` (Nút chuyển view Tuần bị gắn nhãn VIP):
```tsx
<button onClick={() => setCalendarView('week')}>
  <span>{language === 'vi' ? 'Tuần' : 'Week'}</span>
  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded-full">VIP</span>
</button>
```
Trong `RightSidebar.tsx` (Spam AI và cảnh báo chặn quota):
```tsx
<button type="button" onClick={handleAiSuggest} className="...">
  <Sparkles className="w-3.5 h-3.5" />
  <span>Trợ lý AI Gợi ý Task</span>
  <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
    <Lock className="w-2.5 h-2.5" /> Khóa
  </span>
</button>
...
{!isPremium && pendingTaskCount >= 8 && (
  <p className="text-[10px] text-[#FDD663] font-normal">
    ⚠️ Sắp chạm giới hạn 10 task. Hãy hoàn thành hoặc nâng cấp Pro!
  </p>
)}
```
* **Phân tích:** Khóa cả tính năng cơ bản như xem lịch theo tuần (`calendarView === 'week'`) sau một paywall giả định "VIP" là phản công thái học. Nút "Trợ lý AI Gợi ý Task" chỉ đơn giản là `addTask` 2 chuỗi text hardcode vào state (`RightSidebar.tsx:L56-57`) nhưng lại trang trí lộng lẫy bằng icon `Sparkles`, huy hiệu `PRO ⭐` và `Khóa`.
* **Ảnh hưởng:** Làm giao diện tràn ngập "noise" quảng cáo tiêu cực, gây cảm giác ức chế và thiếu tin cậy.

---

### Vấn đề 6: Chiếm dụng chiều ngang màn hình (Panel Width Overload)
* **Vị trí:** `src/components/sidebar/LeftSidebar.tsx:Line 42` (`w-64` = 256px), `src/components/sidebar/RightSidebar.tsx:Line 64` (`w-80` = 320px), `src/components/sidebar/RightSidebarDock.tsx:Line 15` (`w-14` = 56px)
* **Phân tích:** Khi mở đồng thời cả hai sidebar, chiều rộng cố định bị chiếm là: `256px + 320px = 576px`. Nếu tính cả dock hoặc trường hợp hiển thị trên màn hình 1366px, vùng làm việc chính của Lịch chỉ còn lại chưa đầy 790px chia cho 7 cột thứ (mỗi ô ngày chỉ còn khoảng 110px). Trong khi đó, RightSidebar lại chứa quá nhiều khoảng trắng chết và các card quota không cần thiết.
* **Ảnh hưởng:** Lưới lịch bị ép bẹp theo chiều ngang, tên các sự kiện bị cắt ngắn (`truncate`) không đọc được chữ nào.

---

### Vấn đề 7: Chắp vá phong cách thiết kế (Apple Glassmorphism lai Material Design)
* **Vị trí:** `src/components/calendar/WeekTimelineView.tsx:Line 53` và `src/index.css:Line 135-148`
* **Đoạn code vi phạm:**
```tsx
<div className="apple-glass-card rounded-3xl p-5 space-y-3">
```
Trong `index.css`:
```css
/* Backward-compatible aliases for existing components & modals */
.apple-glass-surface { background-color: #121314; border-color: #2a2b2d; }
.apple-glass-card { background-color: #1f2021; border-color: #2a2b2d; }
.apple-glass-pill { background-color: #28292a; border-color: #333538; color: #e3e2e3; }
.apple-btn-primary { background-color: #1a73e8; color: #ffffff; font-weight: 600; }
```
* **Phân tích:** Dự án đang chuyển dịch sang Material 3 Dark theme (sử dụng palette màu Google `#121314`, `#1F2021`, `#8AB4F8`, `#1A73E8`, bo góc tiêu chuẩn `rounded-lg`, `rounded-md`). Nhưng trong code vẫn tồn tại các class lai căng `apple-glass-*` với bo góc ngoại cỡ `rounded-3xl` (24px) hoàn toàn lệch tông với phần còn lại của ứng dụng.
* **Ảnh hưởng:** Mất đồng nhất về mặt thẩm mỹ, mã nguồn CSS bị ô nhiễm bởi các class thừa.

---

## 4. Danh Sách Cắt Bỏ Đề Xuất (Subtract Before Replacing)

Tuân thủ nguyên tắc cốt lõi **"Loại bỏ trước khi thay thế" (Subtract Before Replacing)**:

### 1. Cần XÓA BỎ ngay (Eliminate Completely):
- [ ] **Xóa bỏ hoàn toàn `FlashSaleBanner.tsx`**: Loại bỏ banner đếm ngược giảm giá 40% khỏi đỉnh ứng dụng Calendar.
- [ ] **Xóa bỏ thanh `CalendarControls.tsx` độc lập**: Gộp các dropdown chuyển nhanh tháng/năm vào thanh `TopHeader.tsx` duy nhất để triệt tiêu việc chồng 2 thanh header.
- [ ] **Xóa bỏ các huy hiệu "VIP / PRO" và dọa khóa tính năng**: Bỏ nhãn "VIP" ở nút xem Tuần (`TopHeader.tsx:L153`), bỏ cảnh báo đỏ "Sắp chạm giới hạn 10 task" (`RightSidebar.tsx:L163`), bỏ hộp tính năng AI giả định (`RightSidebar.tsx:L116`).
- [ ] **Xóa bỏ container padding và scroll dọc ở vùng lịch**: Bỏ `p-4 sm:p-6`, `space-y-6`, `overflow-y-auto` tại `AppLayout.tsx:L42`.
- [ ] **Xóa bỏ toàn bộ các class lai tạp `apple-glass-*` trong `index.css`**: Chuẩn hóa 100% về token hệ thống Material 3 Dark theme.

### 2. Cần TINH CHỈNH gọn lại (Refactor & Streamline):
- [ ] **Đưa `MonthGridView` về dạng Full-Height Fluid Layout (100% Viewport)**: Lưới lịch tháng phải chiếm toàn bộ chiều cao còn lại của màn hình (`flex-1 flex flex-col h-full overflow-hidden`), các ô chia đều 5-6 hàng tuần không cần cuộn chuột.
- [ ] **Tái cấu trúc `ProductivityKPI` thành dải Bottom KPI Strip mỏng hoặc Drawer ẩn hiện**: Không để component này nằm thô thiển dưới chân lưới lịch tháng. Đưa về dạng một thanh status mỏng (cao ~32px) có thể mở rộng (Collapsible Drawer) như trong file mockup `stitch_preview_unified.html`.
- [ ] **Hợp nhất và tối ưu chiều rộng Sidebar phải**: Tinh gọn `RightSidebar` (thu từ `w-80` xuống `w-72` hoặc tích hợp mượt với dock), ưu tiên không gian hiển thị danh sách task thực tế thay vì các card quota bento box.
- [ ] **Đồng bộ hóa nhãn thời gian**: Chỉ giữ lại một cụm hiển thị và điều hướng thời gian duy nhất trên `TopHeader`.

---

*Báo cáo được khởi tạo tự động bởi skill `ui-audit-reporter`.*
