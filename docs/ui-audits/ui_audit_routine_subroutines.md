# Báo Cáo Kiểm Định Giao Diện & Rà Soát AI Slop: Phân Hệ Ghi Chú & Routine (Thói Quen Con / Sub-Routines)

* **Ngày kiểm định:** 2026-09-16
* **File mục tiêu:**
  - `src/components/notes-routine/NotesRoutineSidebarPanel.tsx`
  - `src/context/AppContext.tsx`
  - `src/types/index.ts`
  - `src/components/modals/CreateEventModal.tsx`
* **Tiêu chuẩn áp dụng:** MengTo Anti-Slop & UI Quality Standards (Skill 1: `ui-audit-reporter`)

---

## 1. Tổng Quan Chẩn Đoán (Executive Summary)

* **Bản chất màn hình & phân hệ:** Bảng điều khiển thanh bên phải "Ghi chú & Routine" (`NotesRoutineSidebarPanel`), phục vụ theo dõi chuỗi kỷ luật thói quen hàng ngày (Daily Routines & Streaks) kết hợp ghi chú nhanh (Keep Notes).
* **Vấn đề cốt lõi lớn nhất:**
  1. **Thói quen phẳng, thiếu cấu trúc hành động con (Missing Sub-Routines / Atomic Habits Steps):** Các mục thói quen hiện tại ("Chạy bộ 30 phút buổi sáng", "Tập Gym chu kỳ interval", "Đọc sách chuyên ngành 20 trang") chỉ là các đầu mục phẳng một dòng. Người dùng không có cách nào chia nhỏ thói quen thành các bước hành động cụ thể (sub-routines / micro-habits checklist) như khởi động, các set bài tập, số trang sách, hay giãn cơ.
  2. **Trải nghiệm điểm danh cơ học "Một chạm" (All-or-Nothing Check-in):** Khi bấm vào thẻ routine, hệ thống chỉ đổi trạng thái hoàn tất 100% hoặc 0%. Thiếu thanh tiến độ thể hiện phần trăm các bước con đã hoàn thành (ví dụ: hoàn thành 3/4 bước = 75%), làm giảm động lực duy trì kỷ luật tích lũy.
  3. **Thiếu hoàn toàn UI thêm/sửa Routine con:**
     - Trên từng thẻ Routine không có nút mở rộng (expand/collapse) để xem danh sách bước con, không có nút `+ Thêm bước` (Inline Add Step).
     - Thanh Quick Composer trên đầu panel chỉ hỗ trợ tạo Keep Note (`addNote`), không hỗ trợ tạo Routine hay Sub-routines.
     - Nút `+` ở header panel mở `CreateEventModal`, nhưng modal này không có tab hay form cấu hình Routine kèm các bước con.

---

## 2. Bảng Thống Kê Điểm Bất Cập (Findings Summary)

| STT | Vị Trí (File/Line/Component) | Phân Loại | Mức Độ | Triệu Chứng Cụ Thể |
|---|---|---|---|---|
| 1 | `CalendarEvent` trong `types/index.ts:L36-60` | Model Defect | **Nghiêm trọng** | Interface `CalendarEvent` không có trường `subroutines` / checklist bước con |
| 2 | `NotesRoutineSidebarPanel.tsx:L245-298` | Quality Defect | **Cực kỳ nghiêm trọng** | Thẻ Routine chỉ hiển thị 1 dòng tĩnh; không có UI xem, thêm hoặc tick chọn routine con |
| 3 | `NotesRoutineSidebarPanel.tsx:L132-216` | UX Defect | **Cao** | Quick Composer ghi là "Thêm ghi chú hoặc thói quen..." nhưng thực tế chỉ tạo được Ghi chú (`addNote`), không tạo được Routine |
| 4 | `AppContext.tsx:L548-561` | Logic Defect | **Cao** | `toggleCheckInRoutine` chỉ đảo ngược `completed` toàn bộ, không có hàm `toggleSubroutine`, `addSubroutine`, `deleteSubroutine` |
| 5 | `NotesRoutineSidebarPanel.tsx:L110-118` | Navigation Defect | **Trung bình** | Nút `+` header mở `openModal('create')` nhưng modal không hề có form tạo Routine |

---

## 3. Bằng Chứng Chi Tiết & Phân Tích (Detailed Evidence)

### Vấn đề 1: Thẻ Routine chỉ hiển thị 1 dòng, thiếu hoàn toàn danh sách bước con
* **Vị trí:** `src/components/notes-routine/NotesRoutineSidebarPanel.tsx:Line 245-298`
* **Đoạn code vi phạm:**
```tsx
<div
  key={routine.id}
  onClick={() => toggleCheckInRoutine(routine.id)}
  className={`p-2.5 rounded-lg border ... cursor-pointer flex items-center justify-between gap-2.5 group ...`}
>
  <div className="flex items-center gap-2.5 min-w-0 flex-1">
    <button type="button" ...>{routine.completed && <Check ... />}</button>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium truncate">{routine.title}</p>
      <div className="flex items-center gap-2 text-[10px] text-[#70757A] mt-0.5">
        <span>{routine.time}</span>
        <span>• {routine.frequency}</span>
      </div>
    </div>
  </div>
  {/* Streak */}
  <span>{routine.streak} ngày</span>
</div>
```
* **Phân tích:** Thẻ Routine bị thiết kế đóng kín. Người dùng không thể mở rộng xem các bước nhỏ, không thể thêm các bài tập con cho buổi Gym hay các phần của buổi chạy.
* **Ảnh hưởng:** Giảm giá trị ứng dụng; biến tính năng Routine thành một nút bấm điểm danh đơn điệu thay vì công cụ rèn luyện kỷ luật bài bản.

---

### Vấn đề 2: Form soạn thảo nhanh "treo đầu dê bán thịt chó"
* **Vị trí:** `src/components/notes-routine/NotesRoutineSidebarPanel.tsx:Line 138 & Line 62-77`
* **Đoạn code vi phạm:**
```tsx
<span>+ Thêm ghi chú hoặc thói quen...</span>
...
const handleSaveQuickNote = (e: React.FormEvent) => {
  e.preventDefault();
  if (!quickTitle.trim() && !quickContent.trim()) return;
  addNote({ ... }); // CHỈ LƯU VÀO KEEP NOTE, HOÀN TOÀN KHÔNG LƯU ROUTINE!
};
```
* **Phân tích:** Placeholder ghi rõ *"Thêm ghi chú hoặc thói quen..."*, nhưng khi submit form chỉ gọi `addNote`. Người dùng muốn tạo một thói quen mới thì không thể nào tạo được tại đây.

---

## 4. Danh Sách Đề Xuất Cải Tiến (Subtract Before Replacing)

### 1. Cắt bỏ & Tinh chỉnh:
- [ ] Tách rõ ràng giữa **Tạo Ghi chú (Note)** và **Tạo Thói quen (Routine)** trong Quick Composer hoặc cung cấp Tab chuyển đổi [Ghi chú | Thói quen].
- [ ] Bỏ cơ chế click-to-check toàn bộ thói quen nếu thói quen đó có các bước con (chỉ hoàn thành 100% khi tất cả bước con được tick hoặc bấm nút hoàn tất nhanh).

### 2. Bổ sung & Nâng cấp (Add & Refine):
- [ ] **Mở rộng Model Routine:** Thêm mảng `subroutines: SubTask[]` vào `CalendarEvent`.
- [ ] **Thẻ Routine tương tác linh hoạt:**
  - Cho phép click mở rộng/thu gọn (Accordion chevron v) để xem danh sách các routine con.
  - Hiển thị thanh tiến độ mini màu vàng/hổ phách hoặc xanh lá (ví dụ: `2/3 bước (67%)`).
  - Danh sách checkbox từng bước con với gạch ngang khi hoàn thành.
  - Nút `+ Thêm bước` inline gõ Enter để thêm bước mới trực tiếp vào thói quen.
  - Nút xóa `x` nhỏ khi hover từng bước con.
- [ ] **Bổ sung State & Action trong Context:**
  - `addSubroutine(routineId: number, title: string)`
  - `toggleSubroutine(routineId: number, subroutineId: number)`
  - `deleteSubroutine(routineId: number, subroutineId: number)`
  - Khi hoàn thành tất cả bước con, tự động kích hoạt streak hoàn tất cho Routine.

---

*Báo cáo được khởi tạo tự động bởi skill `ui-audit-reporter`.*
