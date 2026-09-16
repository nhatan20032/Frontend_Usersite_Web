# Báo Cáo Kiểm Định Chuyên Sâu: Màu Sắc & Biểu Tượng (Color & Icon Slop Diagnostic)

* **Ngày kiểm định:** 2026-09-16
* **Đối tượng kiểm định:** Hệ thống Màu sắc (Color Palette) & Biểu tượng (Iconography) trên toàn bộ phân hệ Frontend Usersite Web
* **Tiêu chuẩn áp dụng:** MengTo Anti-Slop Guidelines, WCAG Contrast Standards & Google Material 3 Design Tokens (Skill 1: `ui-audit-reporter`)

---

## 1. Tổng Quan Chẩn Đoán (Executive Summary)

* **Bản chất vấn đề:** 
  1. **Hội chứng "Cầu vồng ngẫu nhiên" (Hardcoded Color Rainbow):** Ứng dụng không có hệ thống Semantic Design Tokens nhất quán. AI đã tự sinh ra hơn 15 sắc độ xám đen ngẫu nhiên và hơn 20 mã màu hex phân mảnh cho các trạng thái, gây mất đồng bộ thị giác.
  2. **Xung đột màu sắc ngữ nghĩa nghiệp vụ (Semantic Color Conflict):** Cùng một thực thể ("Sự kiện" / "Task") nhưng ở menu trên gán một màu, ở danh sách dưới lại gán màu hoàn toàn ngược lại.
  3. **Biểu tượng chắp vá & Rác Emoji (Icon Slop & Emoji Placeholders):** Dùng emoji hệ điều hành (`💡`, `👥`, `👑`, `▾`) và vẽ tay hình học bằng thẻ `span` để thay thế icon chuyên nghiệp.
  4. **Độ rực màu quá cao trên nền tối (Oversaturated Dark Surfaces):** Các chip sự kiện dùng màu đặc rực rỡ thập niên 2010 gây mỏi mắt, thẻ ưu tiên phối màu đục ngầu, giảm khả năng đọc lướt.

---

## 2. Bảng Thống Kê Điểm Bất Cập Về Màu Sắc & Icon (Findings Summary)

| STT | Vị Trí (File/Line/Component) | Phân Loại | Mức Độ | Triệu Chứng Cụ Thể |
|---|---|---|---|---|
| 1 | `RightSidebarDock.tsx:L39, L50` | Slop Pattern | **Cực kỳ nghiêm trọng** | Nhét emoji hệ điều hành `💡` và `👥` vào giữa hình tròn màu để giả lập icon Google Keep và Contacts |
| 2 | `LeftSidebar.tsx:L78-98` vs `LeftSidebar.tsx:L134-165` | Quality Defect | **Nghiêm trọng** | Xung đột màu ngữ nghĩa: Menu gán Event = Xanh dương, Task = Xanh lá; checklist dưới lại gán Event = Xanh lá, Task = Xanh dương |
| 3 | `LeftSidebar.tsx:L53-56` | Slop Pattern | **Cao** | Dùng 2 thanh `span` đỏ/xanh xếp chéo để vẽ icon cộng giả tạo thay vì dùng icon SVG chuẩn |
| 4 | `LeftSidebar.tsx:L58, L124, L175, L200` | Slop Pattern | **Trung bình** | Dùng ký tự Unicode `▾` và emoji vương miện `👑` thay vì icon Lucide nhất quán |
| 5 | `TopHeader.tsx:L60-64` | Slop Pattern | **Trung bình** | Logo Lịch vẽ khối xanh cứng nhắc với chữ "T9" và số "15" to bản kiểu widget iOS thu nhỏ |
| 6 | Toàn bộ các component (`LeftSidebar`, `RightSidebar`, `MonthGrid`, `ProductivityKPI`) | Quality Defect | **Nghiêm trọng** | Hardcode hơn 15 mã màu xám đen ngẫu nhiên (`#151618`, `#161718`, `#1A1B1D`, `#1C1D1F`, `#232426`, `#242527`, `#242628`, `#28292A`, `#3A3B3D`, `#3C4043`...) |
| 7 | `MonthGridView.tsx:L114-118` | Quality Defect | **Cao** | Chip sự kiện dùng màu đặc quá gắt (`#174EA6`, `#1E8E3E`) trên nền tối, gây chói mắt và phá vỡ độ êm dịu của Dark mode |
| 8 | `TaskItem.tsx:L47-55` | Quality Defect | **Trung bình** | Badge GẤP/TB dùng tổ hợp màu đục ngầu (`#3C1E1E` + `#F28B82` + `#5C2828`), độ tương phản thấp |

---

## 3. Bằng Chứng Chi Tiết & Phân Tích Kỹ Thuật (Detailed Evidence)

### Vấn đề 1: Nhét Emoji hệ điều hành thay cho Icon ứng dụng chuyên nghiệp
* **Vị trí:** `src/components/sidebar/RightSidebarDock.tsx:Line 32-52`
* **Đoạn code vi phạm:**
```tsx
{/* 2. Google Keep Note Placeholder Icon */}
<button ...>
  <div className="w-7 h-7 rounded-full bg-[#FDD663]/15 flex items-center justify-center">
    <span className="text-xs">💡</span>
  </div>
</button>

{/* 3. Google Contacts Placeholder Icon */}
<button ...>
  <div className="w-7 h-7 rounded-full bg-[#81C995]/15 flex items-center justify-center">
    <span className="text-xs">👥</span>
  </div>
</button>
```
* **Phân tích:** Đây là biểu hiện điển hình của **AI Slop / Hallucination Placeholders**. AI lười import icon chuẩn từ thư viện `lucide-react` (đã có sẵn `Lightbulb` cho Keep và `Users` cho Contacts) mà tự tiện nhét emoji hệ điều hành (`💡` và `👥`) vào giao diện web. Emoji hiển thị khác nhau trên Windows, macOS, Android, nét vẽ đa sắc hoạt họa, phá vỡ hoàn toàn sự trang trọng và tính nhất quán của phong cách Monochrome / Clean Dark.
* **Ảnh hưởng:** Giao diện trông như một sản phẩm chắp vá của người mới học lập trình.

---

### Vấn đề 2: Xung đột màu sắc ngữ nghĩa nghiệp vụ (Semantic Color Inconsistency)
* **Vị trí:** `src/components/sidebar/LeftSidebar.tsx:Line 78-98` và `Line 128-168`
* **Đoạn code vi phạm:**
Trong Dropdown Tạo mới (Dòng 78-98):
```tsx
{/* Sự kiện: Xanh dương #8AB4F8 */}
<span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
<span>Sự kiện</span>

{/* Việc cần làm (Task): Xanh lá #81C995 */}
<span className="w-2 h-2 rounded-full bg-[#81C995]" />
<span>Việc cần làm</span>
```
Nhưng ngay bên dưới, trong "Lịch của tôi" (Dòng 128-168):
```tsx
{/* Routine: Vàng hổ phách amber-500 */}
<span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />

{/* Sự kiện: Lại đổi thành Xanh lá emerald-500! */}
<span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />

{/* Task: Lại đổi thành Xanh dương #1A73E8! */}
<span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] flex-shrink-0" />
```
* **Phân tích:** Đây là lỗi **Nghiêm trọng về UX & Công thái học thị giác (Semantic Mismatch)**. Màu sắc trong một ứng dụng quản lý là ngôn ngữ định danh dữ liệu (Color-coded Data). Người dùng nhìn màu xanh lá ở menu tạo việc sẽ mặc định "Xanh lá là Task", nhưng nhìn xuống danh sách thì "Xanh lá lại là Sự kiện, còn Task lại là Xanh dương". 
* **Ảnh hưởng:** Khiến người dùng rối loạn nhận thức, không thể phân biệt nhanh loại lịch trình trên lưới tháng.

---

### Vấn đề 3: Vẽ icon chắp vá bằng thẻ `span` và rải rác ký tự Unicode
* **Vị trí:** `src/components/sidebar/LeftSidebar.tsx:Line 52-60, Line 124, Line 200`
* **Đoạn code vi phạm:**
```tsx
{/* Vẽ nút Google Plus bằng 2 thanh span */}
<div className="w-4 h-4 flex items-center justify-center relative">
  <span className="w-3.5 h-0.5 bg-[#EA4335] rounded-full absolute" />
  <span className="w-0.5 h-3.5 bg-[#4285F4] rounded-full absolute" />
</div>
...
{/* Mũi tên chữ ▾ */}
<span className="text-[#9AA0A6] text-xs ml-auto ...">▾</span>
...
{/* Emoji vương miện */}
<span className="font-semibold text-[#9AA0A6]">
  {currentRole === 'FREE' ? 'FREE' : 'VIP 👑'}
</span>
```
* **Phân tích:** Đây là tàn dư của các đoạn mã chắp vá. Việc dùng 2 thẻ span ghép thành dấu cộng chỉ có 2 màu (đỏ và xanh) lệch tỉ lệ, dùng ký tự unicode `▾` bị lệch baseline giữa các font chữ, và emoji `👑` khiến giao diện kém tinh tế.
* **Ảnh hưởng:** Mất tính đồng bộ về Visual Weight với toàn bộ hệ thống icon Lucide nét 1.5–2px trong app.

---

### Vấn đề 4: Ma trận màu nền xám đen bị phân mảnh (Background Shading Chaos)
* **Vị trí:** Toàn bộ các file trong `src/components/`
* **Bằng chứng các mã màu hex bị hardcode rải rác:**
  - Nền chính: `#121314`
  - Vùng đệm tháng trước/sau: `#151618/40`
  - Bottom KPI strip: `#161718`
  - KPI drawer mở rộng: `#1A1B1D`
  - Hover ô ngày: `#1C1D1F`
  - Container chính: `#1F2021`
  - Card chi tiết KPI: `#242527`
  - Dropdown menu tạo: `#242628`
  - Nút bấm, bề mặt cao: `#28292A`
  - Border viền: `#2A2B2D`
  - Hover item: `#303336`
  - Border input: `#333538`
  - Border nút tạo: `#3A3B3D`
  - Border dropdown: `#3C4043`
* **Phân tích:** Một hệ thống Design System chuẩn mực (như Material 3 Dark) chỉ có đúng 4–5 cấp độ bề mặt phân cấp (Elevation Levels):
  - Level 0 (Base Canvas): `#121314`
  - Level 1 (Surface Container Low): `#1B1C1D`
  - Level 2 (Surface Container): `#1F2021`
  - Level 3 (Surface Container High): `#28292A`
  - Level 4 (Surface Container Highest / Hover): `#333538`
  - Viền phân cách (Outline Variant): `#2A2B2D`
  Việc có tới 15 mã hex xám khác nhau cách nhau chỉ 1–2% độ sáng là triệu chứng của việc AI tự bịa mã màu qua mỗi lần sinh code mà không sử dụng CSS Variables hoặc Tailwind Tokens.
* **Ảnh hưởng:** Giao diện bị loang lổ, độ sáng không đồng đều giữa các panel cạnh nhau.

---

### Vấn đề 5: Màu sắc chip sự kiện và huy hiệu quá rực hoặc đục ngầu
* **Vị trí:** `src/components/calendar/MonthGridView.tsx:Line 114-120` và `src/components/task/TaskItem.tsx:Line 47-55`
* **Đoạn code vi phạm:**
Trong `MonthGridView.tsx`:
```tsx
className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium flex items-center gap-1 transition-opacity hover:opacity-90 ${
  isGreen
    ? 'bg-[#1E8E3E] text-[#E6F4EA]'
    : 'bg-[#174EA6] text-[#D2E3FC]'
}`}
```
Trong `TaskItem.tsx`:
```tsx
{task.priority === 'high' && (
  <span className="text-[9px] bg-[#3C1E1E] text-[#F28B82] border border-[#5C2828] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
    GẤP
  </span>
)}
```
* **Phân tích:** 
  - Màu nền đặc `#174EA6` (xanh dương đậm thuần) và `#1E8E3E` (xanh lá cây đậm thuần) là các màu dùng cho màn hình Light mode hoặc bảng in, khi đặt lên nền Dark `#121314` sẽ tạo độ tương phản màu cục bộ (Vibration effect) rất chói, làm các sự kiện trông giống như các khối băng dính màu dán lên màn hình.
  - Ngược lại, badge `GẤP` dùng `#3C1E1E` (nền nâu đỏ sẫm) với viền `#5C2828` tạo cảm giác dơ màu (muddy), thiếu độ tươi sáng trong trẻo cần thiết cho một thông báo quan trọng.
* **Ảnh hưởng:** Mỏi mắt khi làm việc lâu; người dùng khó lướt nhanh nội dung văn bản bên trong chip sự kiện.

---

## 4. Danh Sách Cắt Bỏ & Chuẩn Hóa Đề Xuất (Subtract & Standardize)

### 1. Cần XÓA BỎ ngay (Eliminate):
- [ ] **Xóa bỏ các Emoji `💡`, `👥`, `👑` và ký tự `▾`**: Thay bằng các SVG Icons chính thức từ thư viện `lucide-react`: `Lightbulb`, `Users`, `ChevronDown`.
- [ ] **Xóa bỏ khối icon cộng tự vẽ bằng thẻ `span`** tại `LeftSidebar.tsx`: Thay bằng icon `Plus` thanh thoát của Lucide hoặc SVG Google Plus chuẩn 4 màu.
- [ ] **Xóa bỏ toàn bộ 15 mã hex xám ngẫu nhiên**: Chuẩn hóa toàn bộ về 4 cấp độ token bề mặt Material 3 Dark có định nghĩa trong CSS variables / Tailwind.
- [ ] **Xóa bỏ khối logo "T9 - 15" tự vẽ thô kệch** trên TopHeader: Thay bằng icon Lịch vector phẳng tinh tế.

### 2. Cần CHUẨN HÓA & ĐỒNG BỘ (Standardize):
- [ ] **Đồng bộ hóa 100% màu ngữ nghĩa (Semantic Color Mapping):**
  - **Sự kiện (Events):** Cố định màu **Google Blue Soft** (`#8AB4F8` text, `#1A73E8/20` background, border `#1A73E8/40`).
  - **Công việc (Tasks):** Cố định màu **Google Green Soft** (`#81C995` text, `#1E8E3E/20` background, border `#1E8E3E/40`).
  - **Thói quen / Routine:** Cố định màu **Google Amber Soft** (`#FDD663` text, `#E37400/20` background, border `#E37400/40`).
  - **Lịch hẹn (Appointments):** Cố định màu **Google Purple Soft** (`#C58AF9` text, `#8430CE/20` background, border `#8430CE/40`).
  *Áp dụng thống nhất màu này từ Menu tạo -> Checklist Sidebar -> Chip trên Lịch tháng -> Timeline tuần.*
- [ ] **Tinh chỉnh chip sự kiện sang dạng Muted Pastel Surface:**
  - Thay vì dùng màu nền đặc chói mắt, chuyển sang nền mờ nhẹ 20–25% với đường viền mỏng cùng tông và chữ sáng nhẹ. Đảm bảo đúng chuẩn Material 3 Dark theme cao cấp, dịu mắt khi nhìn hàng chục sự kiện cùng lúc.
- [ ] **Quy chuẩn kích thước Icon (Icon Scale Rhythm):**
  - Icon nhỏ trong nút/badge: `14px` (`w-3.5 h-3.5`, stroke 2px).
  - Icon điều hướng và menu: `18px`–`20px` (`w-[18px] h-[18px]`, stroke 1.75px).
  - Icon dock bên phải: `20px` (`w-5 h-5`).

---

*Báo cáo được khởi tạo tự động bởi skill `ui-audit-reporter`.*
