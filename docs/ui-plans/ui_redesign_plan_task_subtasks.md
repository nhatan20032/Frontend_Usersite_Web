# Kế Hoạch Chỉnh Sửa Giao Diện & Tái Cấu Trúc: Phân Hệ Task & Subtasks (Checklist)

* **Dựa trên báo cáo:** [ui_audit_task_subtasks.md](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-audits/ui_audit_task_subtasks.md)
* **Phương án thiết kế:** Clean Anti-Slop System (MengTo + Stitch Design Spec)
* **Bản xem trước Mockup trực quan:** [task_creation_subtasks_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/task_creation_subtasks_mockup.html)
* **Stitch Project ID:** `14319920441420585833` (Screen: `bfccb7dbd5374132905cfef53698b3a5`)

---

## 1. Mục Tiêu Cải Tiến Cốt Lõi

1. **Xóa bỏ triệt để vỏ bọc tab giả (Banish Fake Tab Slop):** Chuyển đổi `CreateEventModal` thành form có nhận thức ngữ cảnh linh hoạt (Context-Aware Dynamic Form). Khi người dùng chọn tab **"Việc cần làm" (Task)**, loại bỏ 100% các trường thừa thãi của cuộc họp (khách mời email, phòng họp, rich text toolbar, trạng thái bận/rảnh).
2. **Hiện thực hóa UI nhập Task con (Subtasks Dynamic Checklist):** Bổ sung khu vực Checklist trực quan cho phép người dùng nhập việc phụ bằng phím `Enter`, xóa nhanh từng mục, và cấu hình hạn chót deadline đơn nhất (`17:00 PM`).
3. **Nối thông luồng dữ liệu (Fix Logic Disconnect):** Khi bấm "Lưu" ở tab Việc cần làm, dữ liệu được ghi nhận chính xác vào `tasksData` trong `AppContext` qua hàm `addTask`, lập tức xuất hiện trên thanh bên phải (RightSidebar) với đầy đủ tiến độ và danh sách việc con như thiết kế ở Ảnh 1.
4. **Bổ sung tương tác vi mô trực tiếp (Inline Micro-interactions):** Cho phép người dùng thêm nhanh việc phụ (`+ Thêm việc phụ`) và xóa việc phụ trực tiếp trên từng Thẻ công việc ở Sidebar mà không bắt buộc phải mở lại modal.

---

## 2. So Sánh Kiến Trúc Bố Cục (Before vs. After)

| Khu Vực | Hiện Trạng (Dính Slop / Thiếu Hụt) | Thiết Kế Mới Đề Xuất (MengTo + Stitch) | Lợi Ích Mang Lại |
|---|---|---|---|
| **Tab Việc cần làm (Modal)** | Ép người dùng nhập email khách mời, phòng họp, textarea họp hành, bận/rảnh | Chỉ giữ lại: Tiêu đề, Hạn chót (Due Date), Mức độ ưu tiên, Danh sách việc phụ (Checklist) và Ghi chú ngắn | Giảm 60% trường thừa, đúng 100% ngữ cảnh quản lý To-do cá nhân |
| **Nhập việc phụ (Subtasks)** | Hoàn toàn không có UI; dữ liệu phụ thuộc vào mock cứng trong code | Input chuyên dụng `+ Thêm việc phụ...` nhấn `Enter` để thêm liên tục, có nút xóa `x` khi hover | Người dùng chủ động tạo checklist thực tế cho bất kỳ công việc nào |
| **Cấu hình thời gian** | Bắt chọn khoảng giờ họp (09:00 AM – 10:00 AM) | Chọn Hạn chót (Deadline): Ngày + Giờ chót (ví dụ: `17:00 PM`) hoặc toggle "Cả ngày" | Phản ánh chính xác khái niệm Deadline công việc |
| **Thẻ công việc (Sidebar)** | Chỉ hiển thị tĩnh và tick chọn subtask, không thêm hay xóa được | Thêm nút viền nét đứt `+ Thêm việc phụ` inline và icon xóa từng mục khi hover | Thao tác cực nhanh ngay trên sidebar mà không gián đoạn công việc |
| **Nút bấm `+` trên Header Sidebar** | Mở modal nhưng tab mặc định là Event, phải tự bấm chuyển tab | Mở thẳng modal với tab `task` được kích hoạt sẵn | Giảm 1 click thừa thãi, nâng cao công thái học |

---

## 3. Hệ Thống Token & Phong Cách Mới (Design Spec)

* **Tone & Theme:** Dark Workspace Minimalist (Google Tasks + Linear style).
* **Bề mặt (Surfaces):**
  - Modal Background: `#242628` với viền hairline `1px solid #333538`
  - Input & Card Background: `#1E1F20`
  - Hover Surface: `#28292A`
* **Màu sắc chỉ định (Semantic Accents):**
  - Primary Action / Progress Bar: `#1A73E8` (Google Blue)
  - Badge GẤP / Priority High: Nền `rgba(234, 67, 53, 0.15)`, chữ `#F28B82`, viền `rgba(234, 67, 53, 0.35)`
  - Priority Medium: Nền `rgba(251, 188, 4, 0.15)`, chữ `#FDD663`, viền `rgba(251, 188, 4, 0.35)`
  - Văn bản chính: `#E3E2E3` (Off-white) | Văn bản phụ/placeholder: `#70757A` (Muted Grey)
* **Bo góc:** `rounded-lg` (8px) cho input, card và container; `rounded-full` cho nút bấm hành động chính.
* **Typography:** Không dùng eyebrow hoa dãn cách rườm rà; sử dụng phân cấp nhãn tự nhiên 12px/13px chuẩn mắt đọc.

---

## 4. Kế Hoạch Thay Đổi Từng File Mã Nguồn (Code Impact Plan)

### 1. `src/types/index.ts`
* **Thay đổi:**
  - Bổ sung interface `CreateTaskInput` phục vụ cho việc tạo task linh hoạt:
    ```ts
    export interface CreateTaskInput {
      title: string;
      dueDate?: string;
      priority?: Priority;
      reminders?: string;
      subtasks?: { title: string; completed?: boolean }[];
    }
    ```

---

### 2. `src/context/AppContext.tsx`
* **Thay đổi:**
  - Cập nhật hàm `addTask` để nhận `CreateTaskInput | string` (vẫn tương thích ngược với Quick Add truyền 1 chuỗi tiêu đề):
    ```ts
    const addTask = (input: string | CreateTaskInput, priority: Priority = 'medium') => {
      // Nếu là string -> tạo task đơn giản
      // Nếu là object -> tạo task với đầy đủ dueDate, priority, reminders, subtasks
    };
    ```
  - Bổ sung 2 hàm xử lý subtask động:
    ```ts
    const addSubtask = (taskId: number, title: string) => { ... };
    const deleteSubtask = (taskId: number, subtaskId: number) => { ... };
    ```
  - Export `addSubtask` và `deleteSubtask` qua `AppContextType` để các component con sử dụng.

---

### 3. `src/components/modals/CreateEventModal.tsx`
* **Thay đổi State:**
  - Thêm state quản lý danh sách việc con khi đang mở modal:
    `const [subtaskList, setSubtaskList] = useState<string[]>([]);`
    `const [newSubtaskInput, setNewSubtaskInput] = useState<string>('');`
  - Thêm state hạn chót deadline: `const [dueTime, setDueTime] = useState<string>('17:00 PM');`
* **Tách biệt giao diện Form theo ngữ cảnh (`activeTab === 'task'`):**
  - **Khi `activeTab === 'task'`:**
    - Ẩn hàng `Row 2: Add Guests` (Khách mời).
    - Ẩn hàng `Row 3: Location` (Phòng họp/Vị trí).
    - Ẩn toolbar định dạng văn bản (B, I, U, Clip...); thay textarea bằng input ghi chú gọn gàng.
    - Ẩn dropdown trạng thái "Bận / Rảnh".
    - Thay bộ chọn khoảng thời gian 2 dropdown thành bộ chọn Ngày + Giờ hạn chót đơn nhất (`dueTime`).
    - **HIỆN MỚI:** Khu vực `Checklist Subtasks`:
      - Input: `+ Thêm việc con (Nhấn Enter để thêm)...`
      - List các item đã thêm: có icon gạch đầu dòng, text việc con, nút xóa `x` nhỏ màu `#70757A` hover chuyển đỏ.
  - **Khi `activeTab === 'event'`:** Giữ nguyên 100% logic và giao diện tạo sự kiện hiện hành.
* **Cập nhật hàm `handleSubmit`:**
  - Khi `activeTab === 'task'`:
    - Gọi hàm `addTask({ title, dueDate: `${weekdayName}, ${dueTime}`, priority, reminders: reminderText, subtasks: subtaskList.map(...) })`.
    - Hiển thị Toast thông báo: *"Đã tạo việc cần làm kèm X việc phụ"*.
    - Reset form và đóng modal.

---

### 4. `src/components/task/TaskItem.tsx` & `src/components/task/SubtaskList.tsx`
* **Thay đổi trong `SubtaskList.tsx`:**
  - Nhận thêm props: `onDeleteSubtask?: (taskId: number, subtaskId: number) => void`.
  - Hiển thị nút xóa `x` nhỏ gọn bên phải mỗi item khi hover.
  - Chuẩn hóa style checkbox sang màu đồng bộ `#1A73E8`, chữ `#E3E2E3`, chữ gạch ngang `#70757A`.
* **Thay đổi trong `TaskItem.tsx`:**
  - Thêm tính năng Quick Inline Add Subtask:
    - Ngay dưới `SubtaskList`, thêm nút nhỏ text `+ Thêm việc phụ`.
    - Khi click, mở một mini input inline 1 dòng: gõ tên và nhấn Enter để thêm ngay vào task cha thông qua `addSubtask(task.id, text)`.

---

### 5. `src/components/sidebar/RightSidebar.tsx`
* **Thay đổi:**
  - Cập nhật nút `+` (L94) trên Google Tasks Companion header:
    - Khi click nút `+` này, mở modal `openModal('create')` và truyền/set activeTab mặc định là `'task'` thay vì `'event'`.

---

## 5. Phương Án Xác Minh (Verification Plan)

1. **Kiểm tra luồng tạo mới qua Modal:**
   - Mở modal `Tạo sự kiện & công việc mới` -> chọn tab `Việc cần làm`.
   - Xác nhận các trường khách mời, phòng họp, bận/rảnh biến mất.
   - Nhập tiêu đề, nhập 2-3 việc phụ (nhấn Enter sau mỗi việc phụ), xóa thử 1 việc phụ.
   - Bấm "Lưu" -> Kiểm tra danh sách Google Tasks bên phải lập tức xuất hiện Task mới với thanh tiến độ 0% và các việc phụ vừa nhập.
2. **Kiểm tra tương tác vi mô tại Sidebar:**
   - Click tick chọn 1 việc phụ -> Thanh tiến độ nhảy từ 0% lên 50%, tỷ lệ `1/2 (50%)`.
   - Bấm `+ Thêm việc phụ` ngay trên thẻ ở Sidebar -> gõ thêm việc phụ thứ 3 -> Tiến độ tự động tính lại `1/3 (33%)`.
3. **Kiểm tra tương thích ngược:**
   - Chuyển lại tab "Sự kiện" -> Tạo sự kiện lịch trình bình thường, xác nhận không bị ảnh hưởng logic.
   - Form thêm nhanh `+ Thêm một việc cần làm` ở đầu Sidebar vẫn hoạt động mượt mà.

---

*Bản kế hoạch được khởi tạo tự động bởi skill `ui-redesign-planner`.*
