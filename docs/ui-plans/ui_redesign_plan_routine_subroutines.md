# Kế Hoạch Chỉnh Sửa Giao Diện & Tái Cấu Trúc: Phân Hệ Routine & Sub-Routines (Các Bước Kỷ Luật Con)

* **Dựa trên báo cáo:** [ui_audit_routine_subroutines.md](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-audits/ui_audit_routine_subroutines.md)
* **Phương án thiết kế:** Clean Anti-Slop System (MengTo + Stitch Design Spec)
* **Bản xem trước Mockup trực quan:** [routine_subroutines_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/routine_subroutines_mockup.html)
* **Stitch Project ID:** `14319920441420585833` (Screen: `18532e8687694148b08b1f1ccd80542f`)

---

## 1. Mục Tiêu Cải Tiến Cốt Lõi & Ràng Buộc Kiến Trúc

* **Ràng buộc kiến trúc (Strict Scope):** Tính năng Routine là một phân hệ phụ trợ (Companion Feature) nằm bên trong **Thanh bên phải (Right Sidebar Panel với chiều rộng cố định 360px)** khi người dùng bấm vào tab bóng đèn trên thanh Dock dọc (56px). **Tuyệt đối không thiết kế dạng toàn màn hình (Full Windowscreen)** mà tối ưu hóa mật độ hiển thị công thái học cao nhất trong khung 360px này.
1. **Hiện thực hóa cấu trúc thói quen nguyên tử (Atomic Habits with Sub-Routines):** Nâng cấp mỗi thói quen kỷ luật (Routine) từ một dòng đơn điệu thành một thói quen có cấu trúc nhiều bước con rõ ràng (ví dụ: thói quen *Tập Gym chu kỳ interval* gồm các bước con: *Khởi động 5 phút*, *4 set Squats*, *3 set Bench Press*, *Giãn cơ*).
2. **Cơ chế tiến độ lũy tiến (Progressive Habit Completion):** Hiển thị thanh tiến độ phần trăm bước con hoàn thành (`2/4 bước - 50%`) kèm màu hổ phách Amber Gold đặc trưng của kỷ luật. Tự động đánh dấu hoàn thành Routine và tăng chuỗi Streak khi đạt 100% các bước.
3. **Tương tác vi mô tức thì (Inline Micro-interactions):**
   - Click vào thẻ Routine để mở rộng/thu gọn (Accordion) xem chi tiết danh sách việc con.
   - Nút `+ Thêm bước con` inline gõ phím `Enter` để thêm trực tiếp từng bước mà không cần mở modal.
   - Checkbox riêng biệt cho từng bước con kèm nút xóa `x` khi hover.
4. **Nâng cấp Quick Composer đa năng (Dual Quick Composer trong khung 360px):** Tách rõ 2 tab `[Ghi chú | Thói quen mới]` tại thanh soạn thảo nhanh trên đầu panel, cho phép người dùng tạo ngay một Routine mới (tên, giờ hẹn, tần suất, các bước con) chỉ trong vài giây ngay tại Sidebar.

---

## 2. So Sánh Kiến Trúc Bố Cục (Before vs. After)

| Khu Vực | Hiện Trạng (Dính Slop / Thiếu Hụt) | Thiết Kế Mới Đề Xuất (MengTo + Stitch) | Lợi Ích Mang Lại |
|---|---|---|---|
| **Bố cục tổng thể** | Thiếu phối cảnh phụ trợ, dễ nhầm với trang full-window screen | Đặt chuẩn xác trong Right Sidebar Panel 360px + Companion Dock 56px | Đúng 100% kiến trúc tab con của ứng dụng |
| **Thẻ Thói Quen (Routine Card)** | Thẻ phẳng 1 dòng, chỉ tick chọn 1 lần hoặc hoàn tất hoặc không | Thẻ Accordion mở rộng/thu gọn được, hiển thị danh sách bước con, tỷ lệ hoàn tất và progress bar | Người dùng kiểm soát chi tiết từng hành động trong một thói quen |
| **Thêm bước con (Sub-routines)** | Hoàn toàn không có tính năng này | Nút `+ Thêm bước con` inline gõ Enter thêm ngay dưới danh sách | Bổ sung bài tập/nhiệm vụ con tức thì không gián đoạn luồng làm việc |
| **Đánh giá tiến độ** | Chỉ có số ngày streak tĩnh | Thanh tiến độ màu hổ phách/cam hiển thị `X/Y bước (Z%)`, tính streak tự động khi hoàn thành tất cả bước | Tạo động lực tâm lý mạnh mẽ theo phương pháp Atomic Habits |
| **Thanh Composer trên đầu** | Ghi "Thêm ghi chú hoặc thói quen" nhưng chỉ tạo được Ghi chú | Segmented Tab rõ ràng `[Ghi chú | Thói quen mới]`, tạo được cả Routine kèm các bước con | Loại bỏ ảo ảnh tính năng, đúng cam kết giao diện |

---

## 3. Hệ Thống Token & Phong Cách Mới (Design Spec)

* **Tone & Theme:** Dark Executive Workspace (Material Dark + Amber Discipline Accent).
* **Bề mặt (Surfaces):**
  - Panel Background: `#121314`
  - Thẻ Routine Card: `#1F2021` với viền `1px solid #2A2B2D`
  - Thẻ mở rộng (Expanded Well): `#18191A` với viền `#333538`
  - Hover Surface: `#28292A`
* **Màu sắc chỉ định (Discipline Semantic Tokens):**
  - Accent Kỷ luật / Streak: `#E37400` (Amber Gold), `#FDD663` (Golden Amber)
  - Accent Hoàn thành: `#1E8E3E` (Emerald Green), `#81C995` (Sage Green)
  - Văn bản chính: `#E3E2E3` | Muted: `#70757A`
* **Typography & Hiệu ứng:**
  - Font: Inter / JetBrains Mono (cho số liệu %, giờ và streak).
  - Transition mượt mà khi mở/đóng danh sách bước con (`transition-all duration-200 ease-out`).

---

## 4. Kế Hoạch Thay Đổi Từng File Mã Nguồn (Code Impact Plan)

### 1. `src/types/index.ts`
* **Thay đổi:**
  - Bổ sung `subroutines?: SubTask[]` vào interface `CalendarEvent`:
    ```ts
    export interface CalendarEvent {
      ...
      subroutines?: SubTask[];
    }
    ```
  - Bổ sung interface `CreateRoutineInput`:
    ```ts
    export interface CreateRoutineInput {
      title: string;
      time: string;
      frequency?: string;
      subroutines?: string[];
    }
    ```

---

### 2. `src/context/AppContext.tsx`
* **Thay đổi dữ liệu mẫu ban đầu (`getInitialEvents`):**
  - Bổ sung các bước con thực tế cho 4 Routine mẫu:
    - *Chạy bộ 30 phút buổi sáng*: `[Uống 300ml nước ấm, Khởi động khớp gối & cổ chân, Chạy 3km pace 6:00, Giãn cơ thả lỏng]`
    - *Tập Gym chu kỳ interval*: `[Khởi động 5 phút, 4 set Squats (8-10 reps), 3 set Bench Press, Căng cơ hạ nhiệt]`
    - *Đọc sách chuyên ngành 20 trang*: `[Chọn chương sách mục tiêu, Đọc tập trung 25 phút Pomodoro, Note 3 ý tưởng cốt lõi]`
    - *Học 20 từ vựng Tiếng Anh*: `[Ôn lại từ cũ trên Flashcard, Học 20 từ mới theo chủ đề, Đặt 5 câu ví dụ thực tế]` (đã hoàn thành)
* **Bổ sung các hàm xử lý Routine trong Context:**
  - `addRoutine: (input: CreateRoutineInput) => void;`
  - `addSubroutine: (routineId: number, title: string) => void;`
  - `toggleSubroutine: (routineId: number, subroutineId: number) => void;`
  - `deleteSubroutine: (routineId: number, subroutineId: number) => void;`
  - Cập nhật logic: Khi tất cả `subroutines` được tick xong -> Tự động đánh dấu `routine.completed = true` và tăng streak!

---

### 3. `src/components/notes-routine/NotesRoutineSidebarPanel.tsx`
* **Nâng cấp Quick Composer:**
  - Thêm state `composerTab: 'note' | 'routine'`.
  - Tab "Ghi chú": Giữ nguyên form tạo note hiện tại.
  - Tab "Thói quen mới": Cho phép nhập Tiêu đề thói quen, Giờ (ví dụ: `07:00 AM`), Tần suất (Hàng ngày / Cứ 2 ngày), và ô nhập các bước con bằng phím Enter.
  - Khi submit tab Thói quen: Gọi `addRoutine(...)`, thói quen mới lập tức xuất hiện trong danh sách "Kỷ luật hôm nay".
* **Nâng cấp Routine Card Component:**
  - Thêm state quản lý mở rộng: `expandedRoutineId` (mở/đóng danh sách con).
  - Hiển thị thanh tiến độ Amber `X/Y bước (Z%)`.
  - Danh sách checkbox từng bước con với gạch ngang khi hoàn thành.
  - Nút inline `+ Thêm bước` gõ phím Enter để thêm ngay bước mới.
  - Nút xóa `x` nhỏ khi hover từng bước con.

---

## 5. Phương Án Xác Minh (Verification Plan)

1. **Kiểm tra xem danh sách bước con của Routine:**
   - Mở panel "Ghi chú & Routine" trên sidebar phải.
   - Nhìn thấy các thói quen có chỉ số bước (ví dụ: `2/4 bước (50%)`).
   - Bấm mở rộng -> Thấy danh sách các bước con hiển thị chi tiết.
2. **Kiểm tra tương tác Check-in bước con:**
   - Click tick chọn 1 bước con -> Tiến độ cập nhật nhảy từ 50% lên 75%.
   - Tick nốt bước cuối cùng -> Thẻ thói quen tự động chuyển sang hoàn tất và streak tăng lên.
3. **Kiểm tra thêm bước con inline:**
   - Bấm `+ Thêm bước` ngay trên thẻ thói quen -> gõ "Uống protein shake" -> Enter -> Bước mới lập tức xuất hiện.
4. **Kiểm tra tạo Thói quen mới qua Quick Composer:**
   - Chuyển tab sang "Thói quen mới" trong Composer -> Nhập "Thiền định 15 phút" -> Thêm bước "Ngồi thẳng lưng", "Tập trung hơi thở" -> Bấm Lưu -> Thói quen mới xuất hiện trên danh sách Kỷ luật hôm nay.

---

*Bản kế hoạch được khởi tạo tự động bởi skill `ui-redesign-planner`.*
