# Báo Cáo Kiểm Định Giao Diện & Rà Soát AI Slop: Phân Hệ Quản Lý Task & Subtasks (Công Việc Con)

* **Ngày kiểm định:** 2026-09-16
* **File mục tiêu:**
  - `src/components/modals/CreateEventModal.tsx`
  - `src/components/task/TaskItem.tsx`
  - `src/components/task/SubtaskList.tsx`
  - `src/components/sidebar/RightSidebar.tsx`
  - `src/context/AppContext.tsx`
  - `src/types/index.ts`
* **Tiêu chuẩn áp dụng:** MengTo Anti-Slop & UI Quality Standards (Skill 1: `ui-audit-reporter`)

---

## 1. Tổng Quan Chẩn Đoán (Executive Summary)

* **Bản chất màn hình & phân hệ:** Phân hệ quản lý công việc cá nhân (Google Tasks Companion) và Hộp thoại tạo mới sự kiện/công việc (`CreateEventModal`). Mục đích sử dụng là giúp người dùng ghi chú nhanh các công việc cần làm, chia nhỏ mục tiêu thành các hành động con (Checklist / Subtasks), theo dõi tiến độ hoàn thành theo thời gian thực (Progress Bar) và nhận thông báo nhắc việc.
* **Vấn đề cốt lõi lớn nhất:**
  1. **Ảo ảnh tính năng - Tab giả mạo (Fake Tab / Façade Pattern - Triệu chứng AI Slop điển hình):** Trên giao diện modal `CreateEventModal`, tab "Việc cần làm" được thiết kế như một lựa chọn ngang hàng với "Sự kiện". Tuy nhiên, khi người dùng bấm chuyển tab, toàn bộ nội dung form bên dưới **giữ nguyên 100% các trường của cuộc họp sự kiện** (mời khách dự họp bằng email, thêm phòng họp/vị trí, rich text soạn thảo mô tả cuộc họp, trạng thái bận/rảnh).
  2. **Biến mất hoàn toàn UI cấu hình Task con (Missing Subtasks UI / Dead Mock Data):** Trên Card hiển thị (`TaskItem.tsx` - như trong ảnh chụp thực tế), hệ thống phô diễn một giao diện công việc rất chi tiết với tiến độ `2/3 (67%)`, thanh progress bar màu xanh và danh sách 3 task con có checkbox gạch ngang. Tuy nhiên, trong toàn bộ ứng dụng **không hề có bất kỳ form, input hay popover nào cho phép người dùng nhập, sửa hoặc thêm mới các task con này**. Dữ liệu subtask hiện tại hoàn toàn là "dữ liệu chết" được hardcode tĩnh trong mock data ban đầu (`AppContext.tsx`).
  3. **Đứt gãy luồng xử lý dữ liệu (Architectural Logic Disconnect):** Khi người dùng điền tab "Việc cần làm" và bấm "Lưu", hàm `handleSubmit` lại gọi `addEvent` (tạo một Routine trên Calendar) thay vì gọi `addTask` để lưu vào danh sách Google Tasks ở thanh bên phải. Nghĩa là việc cần làm được tạo ra không bao giờ xuất hiện tại bảng Tasks.
  4. **Thiếu cơ chế tương tác vi mô (Lack of Inline Micro-interactions):** Không có thao tác thêm nhanh subtask trực tiếp trên danh sách thẻ (Inline Subtask Creation), biến component `TaskItem` thành dạng "chỉ xem và bấm tick" thay vì một công cụ quản lý công việc động.

---

## 2. Bảng Thống Kê Điểm Bất Cập (Findings Summary)

| STT | Vị Trí (File/Line/Component) | Phân Loại | Mức Độ | Triệu Chứng Cụ Thể |
|---|---|---|---|---|
| 1 | `CreateEventModal.tsx:L300-384` | Slop Pattern | **Cực kỳ nghiêm trọng** | Tab "Việc cần làm" hiển thị sai ngữ cảnh: Ép người dùng nhập khách mời dự họp, phòng họp và rich text cuộc họp |
| 2 | `CreateEventModal.tsx:L175-447` | Quality Defect | **Cực kỳ nghiêm trọng** | Hoàn toàn không có trường nhập danh sách việc con (Subtasks / Checklist) khi tạo Task |
| 3 | `CreateEventModal.tsx:L116-135` | Quality Defect | **Nghiêm trọng** | Lưu sai thực thể: Chọn tab Task nhưng lại lưu thành Calendar Routine (`addEvent`) thay vì TaskItem (`addTask`) |
| 4 | `TaskItem.tsx:L63-83` & `SubtaskList.tsx` | Quality Defect | **Cao** | Render Subtask read-only: Có hiển thị tiến độ và checkbox nhưng không có nút "+ Thêm việc con" hay thao tác xóa/sửa subtask |
| 5 | `RightSidebar.tsx:L111-125` & `AppContext.tsx:L560-572` | Quality Defect | **Trung bình** | Thao tác tạo nhanh (Quick Add) chỉ nhận tiêu đề 1 dòng, luôn gán `subtasks: []`, không cho phép mở rộng chi tiết |
| 6 | `CreateEventModal.tsx:L233-273` | Ergonomic Defect | **Cao** | Task cần Hạn chót (Deadline / Due Date) nhưng form lại bắt chọn khoảng thời gian bắt đầu - kết thúc (Start Time - End Time) của một cuộc họp |
| 7 | `CreateEventModal.tsx:L423-430` | Slop Pattern | **Trung bình** | Trường trạng thái "Bận" / "Rảnh" (Free/Busy) vốn của Calendar Event bị giữ lại trên form Việc cần làm |
| 8 | `CreateEventModal.tsx:L161` & `L225` | Hallucination Defect | **Thấp** | Lạm dụng Eyebrow dãn dòng (`uppercase tracking-wider`) và dùng class Tailwind ảo giác (`py-0.2`) |
| 9 | `TaskItem.tsx:L47-55` vs `SubtaskList.tsx:L23` | Style Inconsistency | **Trung bình** | Trộn lẫn màu Hex Material Design (`#EA4335`, `#FBBC04`) với class Tailwind mặc định (`text-slate-400`, `text-blue-600`) |

---

## 3. Bằng Chứng Chi Tiết & Phân Tích (Detailed Evidence)

### Vấn đề 1: Tab "Việc cần làm" chỉ là vỏ bọc, hiển thị nguyên xi các trường của Cuộc họp
* **Vị trí:** `src/components/modals/CreateEventModal.tsx:Line 300 - 384`
* **Đoạn code vi phạm:**
```tsx
{/* Row 2: Add Guests - Vẫn hiển thị khi đang ở tab Task */}
<div className="flex items-start gap-3.5">
  <Users className="w-5 h-5 text-[#9AA0A6] mt-1 shrink-0" />
  <div className="flex-1 space-y-2">
    <input
      type="text"
      value={guestEmail}
      onChange={(e) => setGuestEmail(e.target.value)}
      placeholder="Thêm khách (nhập email rồi nhấn Enter)..."
      ...
    />
...
{/* Row 3: Location - Việc cần làm lại bắt nhập phòng họp */}
<div className="flex items-center gap-3.5">
  <MapPin className="w-5 h-5 text-[#9AA0A6] shrink-0" />
  <div className="flex-1">
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="Thêm vị trí hoặc phòng họp..."
      ...
    />
...
{/* Row 5: Description & Toolbar - Mô tả tài liệu đính kèm cho cuộc họp */}
<textarea
  rows={3}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Thêm mô tả hoặc tài liệu đính kèm cho cuộc họp..."
  ...
/>
```
* **Phân tích:** Khi người dùng chuyển sang tab `Việc cần làm` (`activeTab === 'task'`), form hoàn toàn không thay đổi trạng thái giao diện theo ngữ cảnh (Context-blind). Đây là biểu hiện rõ rệt của **AI Design Slop: Cắt ghép giao diện máy móc**. Việc cần làm cá nhân lại bắt người dùng nhìn thấy ô nhập email khách mời, phòng họp và toolbar soạn thảo tài liệu đính kèm cuộc họp.
* **Ảnh hưởng:** Người dùng cảm thấy hoang mang, giao diện rối rắm thừa thãi, không đúng bản chất của một công cụ To-do list tinh gọn.

---

### Vấn đề 2: Hoàn toàn thiếu UI nhập danh sách Subtasks (Checklist)
* **Vị trí:** `src/components/modals/CreateEventModal.tsx` & `src/components/task/TaskItem.tsx`
* **Đoạn code hiển thị ở Card (`TaskItem.tsx:Line 63-83`):**
```tsx
{subtaskCount > 0 && (
  <div className="space-y-1 pt-1">
    <div className="flex justify-between text-[10px] text-[#9AA0A6]">
      <span>{language === 'vi' ? 'Tiến độ:' : 'Progress:'}</span>
      <span className="font-semibold text-[#8AB4F8] font-mono">
        {subtaskDone}/${subtaskCount} ({progressPercent}%)
      </span>
    </div>
    <div className="w-full bg-[#28292A] h-1.5 rounded-full overflow-hidden">
      <div
        className="bg-[#1A73E8] h-full rounded-full transition-all"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
    <SubtaskList
      taskId={task.id}
      subtasks={task.subtasks}
      onToggleSubtask={onToggleSubtask}
    />
  </div>
)}
```
* **Đoạn code trong Mock Data (`AppContext.tsx:Line 175-179`):**
```tsx
subtasks: [
  { id: 1, title: 'Khảo sát yêu cầu & đặc tả bài toán', completed: true },
  { id: 2, title: 'Viết tài liệu mô tả chức năng', completed: true },
  { id: 3, title: 'Hoàn thiện báo cáo PDF cuối cùng', completed: false },
]
```
* **Phân tích:** Giao diện Card (Ảnh 1 người dùng cung cấp) có đầy đủ thanh tiến độ và danh sách task con. Nhưng trong toàn bộ `CreateEventModal.tsx` **không có dù chỉ một dòng code hoặc component nào hỗ trợ thêm `subtasks`**. Dữ liệu chỉ có thể hiển thị nếu được gán cứng sẵn trong file mã nguồn.
* **Ảnh hưởng:** Người dùng không thể tự tạo ra bất kỳ công việc nào có task con giống như mẫu hiển thị. Đây là lỗi "hứa hẹn giao diện mà không có chức năng" (Visual Phantom).

---

### Vấn đề 3: Đứt gãy luồng xử lý - Lưu sai thực thể giữa Calendar Event và Task
* **Vị trí:** `src/components/modals/CreateEventModal.tsx:Line 116-136`
* **Đoạn code vi phạm:**
```tsx
const success = addEvent({
  type: activeTab === 'task' ? 'routine' : 'event',
  title: title.trim(),
  time: startTime,
  endTime,
  priority,
  year: selectedYear,
  month: selectedMonth,
  day: selectedDay,
  streak: 1,
  completed: false,
  location: location.trim() || undefined,
  travelTime: location.trim() ? '20 phút' : undefined,
  alertTime: reminder === '30m' ? 'Trước 30 phút' : 'Trước 15 phút',
  frequency: freqText,
  description: description.trim() || undefined,
  attendees: guests,
  colorTag: selectedColor,
  status,
});
```
* **Phân tích:** Khi người dùng chọn tab `task`, thay vì gọi hàm `addTask` để lưu vào `tasksData` (danh sách công việc ở `RightSidebar`), code lại gọi `addEvent` biến nó thành một mục lịch trình/thói quen (`type: 'routine'`).
* **Ảnh hưởng:** Người dùng tạo "Việc cần làm" nhưng danh sách Google Tasks bên phải không hề cập nhật, gây cảm giác ứng dụng bị lỗi nặng hoặc không lưu dữ liệu.

---

### Vấn đề 4: Thẻ Task chỉ hỗ trợ xem và tick chọn, thiếu thao tác quản trị Subtask
* **Vị trí:** `src/components/task/SubtaskList.tsx:Line 14-28`
* **Đoạn code vi phạm:**
```tsx
return (
  <div className="space-y-1 pt-1">
    {subtasks.map((st) => (
      <label key={st.id} className="flex items-center gap-2 cursor-pointer text-[11px] app-text-secondary">
        <input
          type="checkbox"
          checked={st.completed}
          onChange={() => onToggleSubtask(taskId, st.id)}
          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
        />
        <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}>
          {st.title}
        </span>
      </label>
    ))}
  </div>
);
```
* **Phân tích:** Component `SubtaskList` hoàn toàn thụ động:
  - Không có nút thêm subtask trực tiếp (Inline "+ Thêm mục con").
  - Không có nút xóa từng subtask con.
  - Không có khả năng chỉnh sửa lại nội dung subtask khi gõ sai.
* **Ảnh hưởng:** Bó buộc người dùng vào trạng thái tĩnh, làm mất đi tính linh hoạt cốt lõi của một danh sách công việc.

---

### Vấn đề 5: Lệch pha giữa Thời gian họp (Time Range) và Hạn chót công việc (Due Date)
* **Vị trí:** `src/components/modals/CreateEventModal.tsx:Line 242-273`
* **Phân tích:** Đối với Task, người dùng quan tâm nhất đến: **Hạn chót (Deadline/Due Date)**, ví dụ `Hôm nay, 17:00 PM` (như trên Card ở Ảnh 1). Nhưng modal hiện tại lại bắt buộc chọn `Giờ bắt đầu: 09:00 AM` và `Giờ kết thúc: 10:00 AM` theo phong cách đặt phòng họp của Google Calendar.
* **Ảnh hưởng:** Tăng gánh nặng nhận thức, người dùng phải cấu hình những trường thời gian vô nghĩa với tính chất một đầu việc.

---

## 4. Danh Sách Cắt Bỏ & Tinh Chỉnh Đề Xuất (Subtract Before Replacing)

Để giao diện sạch sẽ, chuyên nghiệp và phản ánh chính xác nghiệp vụ Task & Subtasks như mong muốn của người dùng, đề xuất các hành động:

### 1. Cần XÓA BỎ khỏi tab "Việc cần làm" (Subtract / Prune):
- [ ] **Xóa hoàn toàn trường "Thêm khách (nhập email)" và chip người tham dự** khi `activeTab === 'task'`.
- [ ] **Xóa hoàn toàn trường "Thêm vị trí hoặc phòng họp"** khi `activeTab === 'task'`.
- [ ] **Xóa bỏ thanh toolbar rich text (B, I, U, List, Link, Clip)** phức tạp và đổi textarea thành ghi chú ngắn gọn (Notes).
- [ ] **Xóa bỏ dropdown trạng thái "Bận" / "Rảnh"** (Free/Busy status) khi `activeTab === 'task'`.
- [ ] **Xóa cấu hình khoảng giờ (Start Time - End Time)** và thay bằng cấu hình Hạn chót (Due Date & Due Time) đơn nhất.
- [ ] **Xóa bỏ class Tailwind ảo giác** `py-0.2` tại badge tab.

### 2. Cần BỔ SUNG & TINH CHỈNH khi ở tab "Việc cần làm" (Add / Refine):
- [ ] **Bổ sung Dynamic Checklist Component vào Modal:**
  - Cho phép người dùng nhập các đầu việc con: Một input "+ Thêm việc con...", nhấn `Enter` để tự động thêm vào danh sách và nhảy sang dòng mới.
  - Mỗi item subtask có icon kéo thả hoặc nút xóa `x` nhỏ gọn bên phải.
- [ ] **Cập nhật luồng Submit chuẩn xác:**
  - Khi `activeTab === 'task'`, gọi trực tiếp hàm tạo Task (`addTask` mở rộng) với đầy đủ `title`, `dueDate`, `priority`, `reminders`, và mảng `subtasks`.
  - Tự động đẩy task mới vào danh sách `tasksData` hiển thị ở RightSidebar.
- [ ] **Bổ sung Inline Subtask Creation tại `TaskItem.tsx`:**
  - Ngay dưới danh sách subtasks hiện có của mỗi Card, có một nút nhỏ `+ Thêm việc con` hoặc ô nhập nhanh để người dùng bổ sung subtask bất kỳ lúc nào mà không cần mở lại modal to.
  - Bổ sung nút xóa nhỏ khi hover vào từng subtask item.
- [ ] **Đồng bộ Design System:**
  - Chuẩn hóa màu checkbox và font chữ trong `SubtaskList.tsx` để đồng bộ hoàn toàn với tông màu Google Workspace Dark Theme (`#1A73E8`, `#E3E2E3`, `#70757A`) thay vì dùng các class `slate` rời rạc.

---

*Báo cáo được khởi tạo tự động bởi skill `ui-audit-reporter`.*
