# Báo Cáo Kiểm Định Giao Diện & Rà Soát Toàn Diện AI Slop (Full-System UI Audit)

* **Ngày kiểm định:** 2026-10-02
* **Phân hệ mục tiêu:** Toàn bộ Frontend người dùng (`Frontend_Usersite_Web`)
* **Các file được rà soát:**
  - **Auth & Onboarding:** `src/components/auth/LoginPage.tsx`, `AuthCarousel.tsx`, `AuthForm.tsx`
  - **Layout & Shell:** `src/components/layout/AppLayout.tsx`, `TopHeader.tsx`, `FlashSaleBanner.tsx`, `UserProfileDropdown.tsx`, `src/components/sidebar/LeftSidebar.tsx`, `LeftSidebarDock.tsx`, `RightSidebarDock.tsx`
  - **Calendar Core:** `src/components/calendar/MonthGridView.tsx`, `WeekTimelineView.tsx`, `AgendaListView.tsx`, `CalendarControls.tsx`, `ProductivityKPI.tsx`, `DayInspectorDrawer.tsx`
  - **Tasks & Notes:** `src/components/sidebar/RightSidebar.tsx`, `src/components/task/TaskItem.tsx`, `SubtaskList.tsx`, `src/components/notes-routine/NotesRoutineSidebarPanel.tsx`
  - **Modals & Overlays:** `src/components/modals/CreateEventModal.tsx`, `EventDetailModal.tsx`, `AppointmentScheduleModal.tsx`, `SettingsModal.tsx`, `CheckoutModal.tsx`, `LimitModal.tsx`, `RecurringActionModal.tsx`
  - **Styling & System:** `src/index.css`, `src/context/AppContext.tsx`, `src/types/index.ts`
* **Tiêu chuẩn áp dụng:** MengTo Anti-Slop & UI Quality Standards (Skill: `ui-audit-reporter`)

---

## 1. Tổng Quan Chẩn Đoán (Executive Summary)

Dự án `Frontend_Usersite_Web` là một ứng dụng Web quản lý lịch biểu cá nhân, thói quen và công việc, hướng tới trải nghiệm Google Calendar / Google Workspace. Tuy nhiên, qua quá trình rà soát lâm sàng trên **toàn bộ 100% các màn hình và modal**, hệ thống đang bộc lộ những biểu hiện AI Slop rất nặng:

1. **Hội chứng "Đa nhân cách thiết kế" (Design Language Schizophrenia):**
   - Màn hình Auth (`LoginPage.tsx`) sử dụng phong cách **Apple Glass sáng bóng** (`bg-slate-100`, card trắng viền mờ `rounded-[32px]`, gradient xanh - tím, pill button bo tròn tối đa).
   - Ngay khi đăng nhập, toàn bộ màn hình chính lại đột ngột biến thành **Google Calendar Material 3 Dark Mode** tông xám than - đen mờ (`#121314`, `#1F2021`, `#28292A`).
   - Nhưng khi mở bất kỳ modal nào (`SettingsModal`, `EventDetailModal`, `CheckoutModal`, `LimitModal`), giao diện lại giật ngược về phong cách Apple Glass (`apple-glass-modal`, `rounded-[28px]`, `backdrop-blur-xl`). Không hề có tính nhất quán về mặt thị giác.

2. **Hội chứng "Tính năng ảo giác & Dữ liệu bù nhìn" (Phantom Features & Fake Mock Artifacts):**
   - **Theme Engine bịp bợm:** Trong `SettingsModal.tsx`, hệ thống quảng bá 5 giao diện cao cấp (Default Studio, Dark Obsidian OLED, Tết Cổ Truyền 2026, Giáng Sinh Tuyết, Anime Sakura). Nhưng trong thực tế, không có bất kỳ dòng CSS nào định nghĩa các theme này! Chọn theme chỉ gán một class vô nghĩa vào `<body>`.
   - **Dữ liệu định tuyến giả mạo:** `EventDetailModal.tsx` luôn luôn hiển thị cứng *"Lộ trình: 8.4 km - 25 phút - Khuyến nghị xuất phát lúc 13:35 PM"* cho mọi sự kiện, bất kể sự kiện đó diễn ra lúc nào hay có địa điểm hay không.
   - **Màn hình lịch hẹn giả lập cứng:** `AppointmentScheduleModal.tsx` fix cứng dải ngày *"13 – 19 Tháng 9, 2026"* và lưu cứng `day: 15`.

3. **Màn hình ma & Mã nguồn mồ côi (Dead Code & Ghost Screens):**
   - `DayInspectorDrawer.tsx` (246 dòng) chứa toàn bộ drawer xem chi tiết ngày nhưng **không hề có bất kỳ nút nào trong toàn bộ ứng dụng gọi hàm mở nó** (`openDayInspector`).
   - `AgendaListView.tsx` (212 dòng) bị bỏ xó hoàn toàn, không được import hay render ở bất cứ đâu.
   - `CalendarControls.tsx` (73 dòng) và `FlashSaleBanner.tsx` (87 dòng) là tàn dư rác không còn được sử dụng nhưng chưa được dọn dẹp.

4. **Lỗi logic hiển thị nghiêm trọng phá hủy trải nghiệm cốt lõi:**
   - Tại `WeekTimelineView.tsx`, mảng giờ chỉ có các mốc giờ chẵn (06:00, 08:00, 10:00,...). Toàn bộ sự kiện vào khung giờ lẻ (07:00, 09:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00) **bị biến mất hoàn toàn khỏi lịch tuần**. Ngoài ra, việc dùng hàm `.find()` khiến các khung giờ có từ 2 sự kiện trở lên chỉ hiển thị duy nhất 1 mục.

---

## 2. Bảng Thống Kê Điểm Bất Cập Toàn Hệ Thống (Findings Summary)

| STT | Vị Trí (File & Dòng) | Phân Loại | Mức Độ | Triệu Chứng Cụ Thể |
|---|---|---|---|---|
| 1 | `WeekTimelineView.tsx:L5-14`, `L93-100` | **Quality Defect** | **Cực kỳ nghiêm trọng** | Mảng giờ chỉ có giờ chẵn; sự kiện giờ lẻ biến mất; dùng `.find()` làm nuốt chửng các sự kiện trùng giờ |
| 2 | `DayInspectorDrawer.tsx:L1-246` & `AppContext.tsx:L75` | **Slop Pattern** | **Nghiêm trọng** | Màn hình ma (Ghost Screen): Drawer 246 dòng tồn tại nhưng không có bất kỳ nút nào trên UI gọi mở |
| 3 | `SettingsModal.tsx:L39-45` & `AppContext.tsx:L388` | **Hallucination Defect** | **Nghiêm trọng** | Theme Engine giả: Quảng bá 5 theme (Tết, Giáng Sinh, Sakura, Obsidian) nhưng CSS không hề có code định nghĩa |
| 4 | `EventDetailModal.tsx:L97-107` | **Slop Pattern** | **Nghiêm trọng** | Dữ liệu giả mạo (Fake Mock Data): Mọi sự kiện đều hiển thị cố định "8.4 km, 25 phút, xuất phát 13:35 PM" |
| 5 | `LoginPage.tsx:L10-48` vs `AppLayout.tsx:L19` | **Style Inconsistency** | **Nghiêm trọng** | Xung đột hệ thống thiết kế: Auth dùng Apple Glass sáng chói, Dashboard dùng Google Dark Mode, Modal lại quay về Apple Glass |
| 6 | `LoginPage.tsx:L12-13`, `L44` & `AuthCarousel.tsx:L39` | **Hallucination Defect** | **Trung bình** | Class CSS ảo giác: `ambient-glow-1`, `ambient-glow-2`, `liquid-portal-card`, `liquid-glass-pill` không tồn tại trong CSS |
| 7 | `AuthCarousel.tsx:L41-155` & `AuthForm.tsx:L295` | **Copywriting Slop** | **Trung bình** | Văn mẫu AI sáo rỗng: "Apple Liquid Glass UI", "Đỉnh cao thẩm mỹ", "RoutinePulse Edition 2026", badge bảo mật SSL bịp bợm |
| 8 | `AppointmentScheduleModal.tsx:L111-120`, `L98` | **Slop Pattern** | **Cao** | Lịch hẹn giả: Fix cứng dải ngày "13-19 Sep 2026", fix cứng lưu ngày `15`, không gắn với ngày được chọn trên lịch |
| 9 | `CreateEventModal.tsx:L614` | **Quality Defect** | **Trung bình** | Nút bấm điều hướng sai ngữ cảnh: Nút "Tùy chọn khác" lại nhảy sang mở popup Lịch hẹn (`appointment-schedule`) |
| 10 | `AgendaListView.tsx:L1-212` & `CalendarControls.tsx:L1-73` | **Dead Code** | **Trung bình** | File mã nguồn mồ côi: 285 dòng code không hề được import hay gắn vào bất kỳ vị trí nào trên AppLayout |
| 11 | `FlashSaleBanner.tsx:L1-87` | **Slop Pattern** | **Trung bình** | Tàn dư bán hàng (E-commerce residue): Banner flash sale countdown giảm 40% trong ứng dụng Calendar cá nhân |
| 12 | `LeftSidebar.tsx:L110-115` | **Slop Pattern** | **Thấp** | Input bù nhìn (Decorative Input): Ô "Tìm người..." không có `onChange`, không có `value`, hoàn toàn vô chức năng |
| 13 | `UserProfileDropdown.tsx:L90-120` | **Quality Defect** | **Thấp** | Nút bấm lười biếng: Bấm "Hồ sơ", "Giao diện", "Thiết bị" đều chỉ mở modal Settings ở tab mặc định không đổi tab |
| 14 | `RightSidebar.tsx:L56-78` | **Slop Pattern** | **Thấp** | Tab thi công dở dang (Under Construction Stub): Tab danh bạ hiển thị thông báo giả lập "đang chuẩn bị kết nối" |
| 15 | `LeftSidebar.tsx:L193` | **Slop Pattern** | **Thấp** | Đèn tín hiệu giả: Dấu chấm xanh nhấp nháy `animate-pulse` "Đã đồng bộ" không gắn liền với trạng thái mạng thực tế |
| 16 | `WeekTimelineView.tsx:L52` | **Container Fatigue** | **Trung bình** | Nhồi nhét Bento Box: Ép bảng timeline vào thẻ lồng thẻ có thanh cuộn ngang `min-w-[580px]` thay vì full-width |

---

## 3. Bằng Chứng Chi Tiết & Phân Tích Lâm Sàng Từng Màn Hình

### Phân Hệ 1: Cổng Xác Thực (Login / Register / OTP)
* **File:** `src/components/auth/LoginPage.tsx`, `AuthCarousel.tsx`, `AuthForm.tsx`

#### Vấn đề 1.1: Mã nguồn ảo giác (CSS Hallucination) & Thẻ rỗng vô nghĩa
* **Vị trí:** `LoginPage.tsx:Line 11-13, 44` và `AuthCarousel.tsx:Line 39, 54`
* **Đoạn code vi phạm:**
```tsx
{/* LoginPage.tsx */}
<div className="ambient-glow-1" />
<div className="ambient-glow-2" />
...
<div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-[32px] overflow-hidden liquid-portal-card min-h-[660px] relative z-10">

{/* AuthCarousel.tsx */}
<div className="inline-flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-semibold">
<div className="liquid-glass-card rounded-3xl p-6 space-y-3">
```
* **Phân tích:** Các class `ambient-glow-1`, `ambient-glow-2`, `liquid-portal-card`, `liquid-glass-pill`, `liquid-glass-card` không hề được định nghĩa trong bất kỳ file CSS nào của dự án (kiểm tra `src/index.css`). Đây là tàn dư của việc sinh mã AI: tự nghĩ ra class nghe có vẻ thời thượng nhưng không có style thực tế, tạo ra các thẻ `div` rác trong DOM.
* **Hậu quả:** Giao diện không có hiệu ứng phát sáng như AI dự kiến, mã nguồn bị rác và khó bảo trì.

#### Vấn đề 1.2: Văn mẫu AI sáo rỗng & Marketing Slop
* **Vị trí:** `AuthCarousel.tsx:Line 43-44, 154-158` và `AuthForm.tsx:Line 293-297`
* **Đoạn code vi phạm:**
```tsx
<span className="text-[11px] text-blue-200/80 font-medium">Apple Liquid Glass UI</span>
...
<h3 className="text-xl font-extrabold tracking-tight leading-snug">
  Đỉnh cao Thẩm mỹ Apple Liquid Glass
</h3>
<p className="text-xs text-blue-100/80 leading-relaxed">
  Kho 5 giao diện thích ứng: Default Studio, Dark Obsidian OLED, Tết 2026, Giáng Sinh Tuyết & Anime Sakura.
</p>
...
<div className="text-center text-[11px] text-slate-400">
  Bảo mật 2 lớp SSL 256-bit • Mã hóa dữ liệu End-to-End RoutinePulse
</div>
```
* **Phân tích:** Sự kết hợp lố bịch giữa các từ ngữ quảng cáo tự phong: *"Đỉnh cao Thẩm mỹ Apple Liquid Glass"*, *"Kho 5 giao diện thích ứng"* (thực chất theme bị lỗi rỗng), và dòng chữ bảo mật *"SSL 256-bit"* trong một ứng dụng frontend chạy local. Đây là triệu chứng kinh điển của AI Slop: nhồi nhét văn bản quảng cáo vô căn cứ.

---

### Phân Hệ 2: Màn Hình Lịch Biểu Chính (Calendar Core Views)
* **File:** `src/components/calendar/WeekTimelineView.tsx`, `MonthGridView.tsx`, `AgendaListView.tsx`, `ProductivityKPI.tsx`

#### Vấn đề 2.1: Mảng giờ khuyết tật và lỗi logic nuốt chửng sự kiện lịch tuần
* **Vị trí:** `src/components/calendar/WeekTimelineView.tsx:Line 5-14` & `Line 93-100`
* **Đoạn code vi phạm:**
```tsx
const hours = [
  '06:00 AM',
  '08:00 AM',
  '10:00 AM',
  '12:00 PM',
  '14:00 PM',
  '16:00 PM',
  '18:00 PM',
  '20:00 PM',
];
...
const ev = eventsData.find(
  (e) =>
    e.year === wd.year &&
    e.month === wd.month &&
    e.day === wd.day &&
    e.time.includes(h.substring(0, 2))
);
```
* **Phân tích:** 
  1. Mảng `hours` chỉ định nghĩa **các giờ chẵn** cách nhau 2 tiếng. Bất kỳ sự kiện nào diễn ra vào các giờ lẻ (`07:00 AM`, `09:00 AM`, `11:00 AM`, `13:00 PM`, `15:00 PM`, `17:00 PM`, `19:00 PM`, `21:00 PM`) **hoàn toàn không bao giờ xuất hiện** trên màn hình tuần.
  2. Đoạn mã dùng `.find(...)` để lấy sự kiện. Nếu trong cùng một khung giờ người dùng có 2 cuộc họp hoặc 1 cuộc họp + 1 thói quen, hàm `.find()` chỉ trả về phần tử đầu tiên và **bỏ rơi hoàn toàn** phần tử thứ hai mà không có bất kỳ dấu hiệu cảnh báo `+1 mục khác`.
* **Hậu quả:** Người dùng bị sót lịch trình quan trọng, gây sai lệch thông tin nghiêm trọng trong một ứng dụng Calendar.

#### Vấn đề 2.2: Bệnh Bento Box / Thẻ lồng thẻ và cuộn ngang không cần thiết
* **Vị trí:** `src/components/calendar/WeekTimelineView.tsx:Line 51-52, 87`
* **Đoạn code vi phạm:**
```tsx
<div className="w-full h-full p-3 sm:p-4 overflow-y-auto bg-[#121314] select-none">
  <div className="bg-[#1F2021] border border-[#2A2B2D] rounded-xl p-4 space-y-3">
    ...
    <div className="space-y-1.5 overflow-x-auto min-w-[580px]">
```
* **Phân tích:** Thay vì tận dụng toàn bộ diện tích không gian làm việc (Liquid Full-Height Canvas) như `MonthGridView`, `WeekTimelineView` lại bọc toàn bộ khung lịch tuần vào trong một thẻ card `rounded-xl p-4` lọt thỏm ở giữa màn hình. Bên trong lại ép `min-w-[580px]` gây ra thanh cuộn ngang con. Đây là biểu hiện của **Container Fatigue**: tư duy đóng hộp mọi thứ vào Bento Card của AI.

#### Vấn đề 2.3: Component mồ côi bị bỏ xó hoàn toàn (`AgendaListView.tsx`)
* **Vị trí:** `src/components/calendar/AgendaListView.tsx:Line 1-212`
* **Phân tích:** File `AgendaListView.tsx` dài hơn 200 dòng, chứa logic hiển thị danh sách lịch trình theo ngày, nút điểm danh và thẻ sự kiện AI. Tuy nhiên, trong `AppLayout.tsx` và `TopHeader.tsx`, view switcher chỉ hỗ trợ 2 mode:
```tsx
{calendarView === 'month' && <MonthGridView />}
{calendarView === 'week' && <WeekTimelineView />}
```
Không hề có bất kỳ nhánh nào gọi `AgendaListView`. Toàn bộ file này là mã chết nằm phơi trong dự án.

---

### Phân Hệ 3: Hệ Thống Dialog & Cửa Sổ Bật Lên (Modals & Drawers)
* **File:** `DayInspectorDrawer.tsx`, `SettingsModal.tsx`, `EventDetailModal.tsx`, `AppointmentScheduleModal.tsx`, `CreateEventModal.tsx`

#### Vấn đề 3.1: "Màn hình ma" hoàn toàn không thể chạm tới (`DayInspectorDrawer.tsx`)
* **Vị trí:** `src/components/calendar/DayInspectorDrawer.tsx:Line 1-246`
* **Bằng chứng kiểm tra trong mã nguồn:**
  - `AppContext.tsx:L75` khai báo: `openDayInspector: (day?: number) => void;`
  - Quét toàn bộ thư mục `src/`: **Không có bất kỳ component, nút bấm, sự kiện click hoặc icon nào gọi hàm `openDayInspector`**.
  - `MonthGridView.tsx` chỉ gọi `closeDayInspector()` khi click vào ô ngày.
* **Phân tích:** Drawer này được thiết kế rất công phu với nút thêm lịch, danh sách sự kiện, nút xóa, nút điểm danh. Nhưng không có cách nào trên UI để người dùng mở được nó! Đây là sản phẩm của việc AI code dở dang rồi quên liên kết vào giao diện chính.

#### Vấn đề 3.2: Theme Engine giả mạo (Fake Theme System)
* **Vị trí:** `src/components/modals/SettingsModal.tsx:Line 39-45` & `src/context/AppContext.tsx:Line 388-390`
* **Đoạn code vi phạm:**
```tsx
/* SettingsModal.tsx */
const themes: { id: ThemeName; name: string; desc: string; previewClass: string }[] = [
  { id: 'default', name: 'Default Light', desc: 'Apple Studio Canvas + Frosted Crystal', previewClass: 'from-slate-100 to-slate-200 border-slate-300' },
  { id: 'dark', name: 'Dark Obsidian', desc: 'Deep OLED + Frosted Smoky Glass (VIP)', previewClass: 'from-slate-900 to-black border-slate-700' },
  { id: 'tet', name: 'Tết Cổ Truyền 2026', desc: 'Đỏ son ấm áp & May mắn thịnh vượng (VIP)', previewClass: 'from-red-50 to-red-100 border-red-300' },
  { id: 'christmas', name: 'Giáng Sinh Tuyết', desc: 'Xanh thông tuyết phủ & Bình an (VIP)', previewClass: 'from-emerald-50 to-emerald-100 border-emerald-300' },
  { id: 'sakura', name: 'Anime Sakura', desc: 'Hồng hoa anh đào rực rỡ & Tươi mới (VIP)', previewClass: 'from-pink-50 to-pink-100 border-pink-300' },
];

/* AppContext.tsx */
body.className = body.className.replace(/theme-\w+/g, '').trim();
if (currentTheme !== 'default') {
  body.classList.add(`theme-${currentTheme}`);
}
```
* **Phân tích:** Khi người dùng chọn bất kỳ theme nào (kể cả theme VIP Tết, Giáng Sinh, Sakura), `AppContext` chỉ gắn class `theme-tet`, `theme-christmas`,... vào thẻ `<body>`. Nhưng khi quét toàn bộ `index.css` và toàn bộ codebase: **Không có một selector CSS nào như `.theme-tet`, `.theme-christmas`, hay `.theme-sakura`**. Giao diện hoàn toàn giữ nguyên 100%, không đổi màu dù chỉ một pixel!
* **Hậu quả:** Tính năng "lừa" người dùng, tạo cảm giác giao diện bị lỗi hoặc chưa hoàn thiện.

#### Vấn đề 3.3: Dữ liệu ảo giác gán cứng trong Modal Chi Tiết Sự Kiện
* **Vị trí:** `src/components/modals/EventDetailModal.tsx:Line 97-107`
* **Đoạn code vi phạm:**
```tsx
<div className="apple-glass-pill p-3.5 rounded-2xl space-y-1.5">
  <div className="flex items-center justify-between text-[11px]">
    <span className="flex items-center gap-1">
      <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
      <span>{language === 'vi' ? 'Lộ trình: 8.4 km' : 'Distance: 8.4 km'}</span>
    </span>
    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">25 {t('common.minutes')}</span>
  </div>
  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
    <Bell className="w-3.5 h-3.5 text-amber-500" />
    <span>{language === 'vi' ? 'Khuyến nghị: Xuất phát lúc 13:35 PM' : 'Suggested departure: 13:35 PM'}</span>
  </div>
</div>
```
* **Phân tích:** Mọi sự kiện thuộc loại `event` khi người dùng bấm vào xem chi tiết đều bị gán cứng: khoảng cách `8.4 km`, thời gian đi `25 phút`, và giờ xuất phát luôn luôn là `13:35 PM`, kể cả khi sự kiện đó diễn ra lúc 8 giờ sáng hay buổi tối. Đây là triệu chứng AI "vẽ ra mockup cho đẹp mắt" nhưng không thèm liên kết logic với dữ liệu thực tế của sự kiện (`ev.travelTime`, `ev.alertTime`).

#### Vấn đề 3.4: Bấm "Tùy chọn khác" lại nhảy sang Lên lịch hẹn
* **Vị trí:** `src/components/modals/CreateEventModal.tsx:Line 614-618`
* **Đoạn code vi phạm:**
```tsx
{/* Left: Ghost More Options */}
<button
  type="button"
  onClick={() => openModal('appointment-schedule')}
  className="text-xs font-medium text-[#9AA0A6] hover:text-[#E3E2E3] hover:underline cursor-pointer"
>
  {language === 'vi' ? 'Tùy chọn khác' : 'More options'}
</button>
```
* **Phân tích:** Nút "Tùy chọn khác" trong các ứng dụng Calendar (như Google Calendar) là để mở rộng form nhập thêm ghi chú, khách mời, phòng họp chi tiết. Ở đây, AI đã lười biếng móc sự kiện bấm nút này để gọi... `openModal('appointment-schedule')` (Mở modal thiết lập lịch nhận booking). Hai ngữ cảnh hoàn toàn không liên quan bị nối với nhau một cách ngớ ngẩn.

#### Vấn đề 3.5: Cấu hình Lịch hẹn giả lập tĩnh (`AppointmentScheduleModal.tsx`)
* **Vị trí:** `src/components/modals/AppointmentScheduleModal.tsx:Line 111-120` & `Line 89-101`
* **Đoạn code vi phạm:**
```tsx
// Weekday dates representation (13 to 19 Sep 2026)
const weekDays = [
  { nameVi: 'CN', nameEn: 'SUN', dayNum: 13, dayIndex: 0 },
  { nameVi: 'THỨ 2', nameEn: 'MON', dayNum: 14, dayIndex: 1 },
  { nameVi: 'THỨ 3', nameEn: 'TUE', dayNum: 15, dayIndex: 2, isToday: true },
  { nameVi: 'THỨ 4', nameEn: 'WED', dayNum: 16, dayIndex: 3 },
  ...
];
...
addEvent({
  type: 'event',
  title: `[Lịch hẹn] ${title}`,
  day: 15,
  ...
});
```
* **Phân tích:** Modal này chiếm trọn màn hình (1600px) nhưng bên trong toàn bộ danh sách ngày bị fix cứng thành tháng 9/2026 từ ngày 13 đến 19. Khi người dùng bấm lưu, sự kiện luôn bị lưu vào ngày 15. Đây hoàn toàn là một "bản demo chết" không có giá trị ứng dụng thực tế.

---

### Phân Hệ 4: Bảng Điều Khiển Hai Bên (Left & Right Sidebars)
* **File:** `LeftSidebar.tsx`, `RightSidebar.tsx`, `UserProfileDropdown.tsx`

#### Vấn đề 4.1: Input bù nhìn không có chức năng
* **Vị trí:** `src/components/sidebar/LeftSidebar.tsx:Line 110-115`
* **Đoạn code vi phạm:**
```tsx
<div className="space-y-1">
  <input
    type="text"
    placeholder={language === 'vi' ? 'Tìm người...' : 'Search people...'}
    className="w-full bg-[#28292A] border border-[#333538] focus:border-[#8AB4F8] text-[#E3E2E3] rounded-md px-3 py-1.5 text-xs placeholder-[#70757A] transition-all focus:outline-none"
  />
</div>
```
* **Phân tích:** Ô nhập "Tìm người..." được đặt ngay dưới mini calendar để bắt chước giao diện Google Calendar, nhưng không có thuộc tính `value`, không có `onChange`, không có danh sách người để tìm kiếm. Đây là một thành phần giao diện "trang trí rác" làm rối mắt người dùng.

#### Vấn đề 4.2: Tab "Thi công dở dang" (Under-construction Stub)
* **Vị trí:** `src/components/sidebar/RightSidebar.tsx:Line 56-78`
* **Đoạn code vi phạm:**
```tsx
} : rightSidebarTab === 'contacts' ? (
  <div className="w-full h-full flex flex-col justify-between">
    ...
    <div className="flex-1 flex items-center justify-center text-center p-4">
      <p className="text-xs text-[#70757A]">Tính năng đồng bộ danh bạ Google Contacts đang chuẩn bị kết nối.</p>
    </div>
  </div>
) : (
```
* **Phân tích:** Trên thanh Dock bên phải có icon danh bạ (`Users`). Người dùng bấm vào thì sidebar mở ra chỉ để đọc dòng chữ: *"Tính năng đồng bộ danh bạ Google Contacts đang chuẩn bị kết nối"*. Nếu tính năng chưa có, không nên đưa vào thanh Dock để làm phân tâm người dùng.

#### Vấn đề 4.3: Dropdown người dùng điều hướng lười biếng
* **Vị trí:** `src/components/layout/UserProfileDropdown.tsx:Line 90-120`
* **Phân tích:** Ba mục menu: "Hồ sơ cá nhân", "Giao diện", "Thiết bị kết nối" đều gọi hàm `openModal('settings')` mà **không truyền tham số tab**. Kết quả là khi người dùng muốn đổi giao diện hay kiểm tra thiết bị, modal Settings luôn luôn mở ra ở tab "Hồ sơ cá nhân", bắt người dùng phải click thêm một lần nữa để tìm tab mình cần.

---

## 4. Danh Sách Cắt Bỏ & Tinh Chỉnh Đề Xuất (Subtract Before Replacing)

Dựa trên nguyên lý thiết kế chất lượng cao của Meng To: **Loại bỏ cái thừa trước khi xây cái mới (Prune Slop & Fix Integrity)**:

### 1. Cần XÓA BỎ NGAY LẬP TỨC (Prune & Delete):
- [ ] **Xóa bỏ các file mã nguồn rác/mồ côi:**
  - `src/components/layout/FlashSaleBanner.tsx` (Banner bán hàng không liên quan).
  - `src/components/calendar/CalendarControls.tsx` (Header lịch cũ thừa thãi đã chuyển vào TopHeader).
  - `src/components/calendar/AgendaListView.tsx` (Nếu không đưa vào view chính thì phải dọn dẹp hoặc tích hợp chuẩn chỉ).
- [ ] **Xóa bỏ các class CSS ảo giác không tồn tại:**
  - `ambient-glow-1`, `ambient-glow-2`, `liquid-portal-card` trong `LoginPage.tsx`.
  - `liquid-glass-card`, `liquid-glass-pill` trong `AuthCarousel.tsx`.
- [ ] **Xóa bỏ các trường UI bù nhìn / trang trí không có logic:**
  - Ô input "Tìm người..." vô dụng trong `LeftSidebar.tsx`.
  - Đèn xanh nhấp nháy giả tạo "Đã đồng bộ" (`animate-pulse`) trong `LeftSidebar.tsx`.
  - Tab "Danh bạ dở dang" trên thanh `RightSidebarDock.tsx` cho đến khi có API thực tế.
- [ ] **Xóa bỏ dữ liệu hardcode giả mạo trong `EventDetailModal.tsx`:**
  - Xóa lộ trình cố định "8.4 km / 25 phút / 13:35 PM" và chỉ render khi sự kiện thực sự có dữ liệu travel time / alert time.
- [ ] **Xóa bỏ liên kết sai lệch:**
  - Xóa hành vi bấm "Tùy chọn khác" mở Lịch hẹn trong `CreateEventModal.tsx`.

### 2. Cần SỬA CHỮA & TINH CHỈNH CẤP THIẾT (Fix & Harmonize):
- [ ] **Sửa triệt để `WeekTimelineView.tsx`:**
  - Mở rộng mảng `hours` đủ 24 giờ hoặc từ 06:00 đến 23:00 (cả giờ chẵn lẫn giờ lẻ).
  - Đổi logic từ `.find(...)` sang `.filter(...)` để hiển thị đầy đủ danh sách sự kiện trong cùng một khung giờ.
  - Xóa bỏ bọc thẻ Bento Card co cụm `rounded-xl p-4` và chuyển thành bố cục tràn viền tự nhiên như `MonthGridView`.
- [ ] **Đồng bộ hóa Design System (Unified Dark Material 3):**
  - Đồng bộ toàn bộ các Modal (`SettingsModal`, `EventDetailModal`, `CheckoutModal`, `LimitModal`, `RecurringActionModal`, `UserProfileDropdown`) từ phong cách Apple Glass (`apple-glass-modal`, `rounded-[28px]`, `backdrop-blur-xl`) sang ngôn ngữ Google Calendar Dark Mode (`#1F2021`, viền `#333538`, bo góc chuẩn 12px - 16px).
  - Thiết kế lại trang `LoginPage.tsx` theo tông màu hiện đại, tối giản, đồng bộ với dark canvas của sản phẩm chính thay vì màu sáng chói lạc loài.
- [ ] **Xử lý Theme Engine trong `SettingsModal.tsx`:**
  - Hoặc triển khai đầy đủ các biến màu CSS tương ứng cho các theme (Dark Obsidian, Festive, etc.), hoặc loại bỏ các lựa chọn theme "bánh vẽ" không hoạt động.
- [ ] **Xử lý "Màn hình ma" `DayInspectorDrawer.tsx`:**
  - Gắn trigger mở drawer khi người dùng double-click hoặc click vào ngày trên Month Grid (hoặc loại bỏ file nếu không cần thiết).
- [ ] **Cập nhật `UserProfileDropdown.tsx`:**
  - Truyền đúng tham số `tabName` khi mở `SettingsModal` (`openModal('settings', 'appearance')`, etc.).

---

*Báo cáo được khởi tạo tự động bởi skill `ui-audit-reporter`.*
