# Báo Cáo Kiểm Định Giao Diện & Rà Soát AI Slop: Lịch Hẹn Đặt Trước (Appointment Schedule)
* **Ngày kiểm định:** 2026-10-05
* **File mục tiêu:** `src/components/modals/AppointmentScheduleModal.tsx`
* **Tiêu chuẩn áp dụng:** MengTo Anti-Slop & UI Quality Standards

---

## 1. Tổng Quan Chẩn Đoán (Executive Summary)
* **Bản chất màn hình:** Công cụ cấu hình khung giờ rảnh để khách đặt lịch. Thao tác cốt lõi: **xác định giờ bắt đầu/kết thúc theo từng ngày** và thấy ngay các slot sinh ra.
* **Vấn đề cốt lõi lớn nhất:** Canvas bên phải là **ảnh tĩnh giả lập**, không phải công cụ. Mọi vị trí, giờ, slot đều hard-code (`top: 64px`, `height: 512px`, `9 + i`), không đọc `startTime/endTime`, không có handler nào. Panel trái cũng chỉ hiển thị giờ dạng `<span>` — **người dùng không có chỗ nào để sửa giờ cả**. Trên nền đó, AI phủ thêm lớp trang trí (dashed border + tint + blur + shadow + badge + mini-pill) khiến 5 cột giống hệt nhau, nhồi chữ, và **thông tin sai lệch** (pill "9:00" nằm ở hàng 12 CH).

---

## 2. Bảng Thống Kê Điểm Bất Cập (Findings Summary)
| STT | Vị Trí | Phân Loại | Mức Độ | Triệu Chứng |
|---|---|---|---|---|
| 1 | `L411-461` | Quality Defect | Nghiêm trọng | Canvas phải không có bất kỳ `onClick/onPointerDown`; không tạo/kéo/resize/xoá được khung giờ |
| 2 | `L264-273` | Quality Defect | Nghiêm trọng | Giờ bắt đầu/kết thúc là `<span>` — không thể chỉnh ở đâu cả |
| 3 | `L426-429` | Quality Defect | Nghiêm trọng | Block hard-code 9:00–17:00, bỏ qua `slot.startTime/endTime` |
| 4 | `L445-455` | Quality Defect | Nghiêm trọng | Luôn 8 pill `9+i:00`, không phụ thuộc `duration` (15p vẫn ra 8 slot "15p"); pill bị `justify-between` đẩy xuống giữa block → "9:00" nằm ngang hàng 12 CH |
| 5 | `L88-100` | Quality Defect | Nghiêm trọng | `handleSave` lưu cứng `09:00 AM–05:00 PM`, mô tả cứng "Thứ 2 - Thứ 6"; bỏ qua `availability`, `timezone`, `repeatMode` |
| 6 | `L360, L395, L362` | Quality Defect | Cao | `grid-cols-8` → cột trục giờ rộng bằng cột ngày (~1/8 width), comment ghi "56px" sai; header `w-14` lệch với body |
| 7 | `L387-393` | Quality Defect | Cao | Now-line `top:155px` cố định, `left-14` không khớp grid → chấm đỏ nằm giữa cột trục giờ (thấy trong screenshot) |
| 8 | `L126` | Quality Defect | Trung bình | `isToday` thực chất là "ngày đang chọn", không phải hôm nay |
| 9 | `L363, L28-38, L208-213, L231, L288, L298, L440` | Quality Defect | Trung bình | "GMT+7", "SA/CH", "phút", title tooltip hard-code tiếng Việt, không theo `timezone`/`language` |
| 10 | `L325-335` | Quality Defect | Trung bình | Hàng "Phạm vi thời gian đặt lịch" có icon Sliders trông như nút nhưng không làm gì |
| 11 | `L425` | Slop Pattern | Cao | Decorative stacking: `border-2 border-dashed` + `bg/15` + `rounded-xl` + `shadow-lg` + `backdrop-blur-xs` + `animate-in` trên một block thông tin |
| 12 | `L432-459` | Slop Pattern | Cao | Mỗi cột lặp: badge "60M SLOTS" + tiêu đề + giờ + 8 pill + "Khách có thể đặt lịch" → 5 lần cùng nội dung |
| 13 | `L432, L449, L457` | Slop Pattern | Cao | Micro-type `text-[8px]`, `text-[9px]`, `text-[10px]` không đọc được; badge tiếng Anh in hoa trộn giữa UI tiếng Việt ("60M SLOTS", "60p") |
| 14 | `L151, L179, L368` | Slop Pattern | Trung bình | Eyebrow pill `uppercase tracking-wider` ở header lặp nghĩa với `h2` ngay cạnh; label input cũng uppercase tracking |
| 15 | `L164-169, L347-353` | Slop Pattern | Trung bình | Hai nút Save khác nhãn ("Lưu & Hoàn tất" vs "Tiếp tục / Lưu") cùng gọi `handleSave` |
| 16 | `L192, L250, L325` | Slop Pattern | Trung bình | Card-ification: duration, mỗi ngày, scheduling window đều bọc box có border; icon xanh trước mọi heading |
| 17 | `L137` | Quality Defect | Trung bình | `select-none` toàn modal; thiếu `role="dialog"`, `aria-modal`, Esc, focus trap |
| 18 | `L139, L176` | Quality Defect | Thấp | Modal `max-h-[96vh]` + aside cố định 460px chiếm ~1/3 chiều ngang trên màn 1366px; không thu gọn |
| 19 | Nhiều nơi | Slop Pattern | Cao | Lạm dụng mã màu hex cố định, không dùng Design System/biến CSS; hiệu ứng blur vô nghĩa trên nền solid. Thi ếu focus states chuẩn. Màu sắc đơn điệu (AI Blue fatigue). |

---

## 3. Bằng Chứng Chi Tiết & Phân Tích (Detailed Evidence)

### Vấn đề 1: Canvas phải là hình vẽ, không phải công cụ
* **Vị trí:** `AppointmentScheduleModal.tsx:L418-L429`
```tsx
<div key={h.value} className="h-16 hover:bg-[#1E1F20]/40 transition-colors" />
...
style={{ top: '64px', height: '512px' }}
```
* **Phân tích:** Ô giờ có hover (gợi ý click được) nhưng không có handler → *false affordance*. Block không có handle resize, không drag, không click để xoá. Vị trí không tính từ dữ liệu.
* **Ảnh hưởng:** Người dùng nhìn thấy lịch tuần (mental model Google Calendar: kéo để tạo) nhưng mọi thao tác đều vô hiệu. Đây chính là phàn nàn "không thể tương tác với màn hình bên phải".

### Vấn đề 2: Không có điểm nhập liệu giờ
* **Vị trí:** `L266-272`
```tsx
<span className="bg-[#1E1F20] border ... rounded text-[11px]">{slot.startTime}</span>
```
* **Phân tích:** Được style giống input (border, bg) nhưng là `<span>`. Cả 2 panel đều không cho đổi giờ → chỉ có bật/tắt ngày. Không hỗ trợ nhiều khoảng/ngày (VD 9–12, 14–17) dù đã import `Plus`.

### Vấn đề 3: Slot pill sai lệch dữ liệu & vị trí
* **Vị trí:** `L425` (`flex-col justify-between`) + `L445-455`
```tsx
{Array.from({ length: 8 }).map((_, i) => (<span>{9 + i}:00</span> <span>{duration}p</span>))}
```
* **Phân tích:** (a) Số slot cố định 8, không = `(end-start)/duration`. (b) `justify-between` đặt nhóm pill giữa block → pill "9:00" thẳng hàng 12 CH, "16:00" thẳng hàng 2 CH. Hai hệ trục thời gian mâu thuẫn trong cùng một khung.
* **Ảnh hưởng:** Thông tin **sai**, tệ hơn là không hiển thị. Đây là lỗi nặng nhất về mặt tin cậy.

### Vấn đề 4: Save bỏ qua toàn bộ state
* **Vị trí:** `L89-100`
```ts
time: '09:00 AM', endTime: '05:00 PM',
description: `... Khung giờ khả dụng Thứ 2 - Thứ 6 (09:00 - 17:00).`
```
* **Phân tích:** Tắt Thứ 4, đổi múi giờ, chọn "Chỉ tuần này" → kết quả lưu y hệt. `timezone`, `repeatMode` là state chết.

### Vấn đề 5: Lưới cột lệch
* **Vị trí:** `L360`, `L362`, `L395-397`, `L388`
* **Phân tích:** `grid-cols-8` chia đều 8 cột → trục giờ ~120px phí không gian (screenshot: nhãn "8 SA" trôi giữa vùng trống). Now-line `left-14` (56px) rơi giữa cột trục; `top:155px` không tính theo giờ thực → không bao giờ đúng.

### Vấn đề 6: Decorative stacking trên block khả dụng
* **Vị trí:** `L425`
```tsx
"bg-[#8AB4F8]/15 border-2 border-dashed border-[#8AB4F8]/70 rounded-xl ... shadow-lg backdrop-blur-xs ... animate-in"
```
* **Phân tích:** Dashed border ngữ nghĩa là "nháp/placeholder/drop zone", không phải "đã xác nhận rảnh". Blur trên nền phẳng tối không có gì để làm mờ. Shadow + tint + dashed cùng lúc tranh nhau làm đường biên.

### Vấn đề 7: Lặp nội dung và micro-type
* **Vị trí:** `L432-L459`
* **Phân tích:** Tiêu đề trang, "60M SLOTS", "09:00 SA – 17:00 CH", "Khách có thể đặt lịch" lặp 5 lần — đều là thông tin cấp trang, không cấp ngày. Font 8–9px dưới ngưỡng đọc (≥11px cho dense UI). Giờ hiển thị trộn hệ 24h ("13:00") và 12h ("1 CH", "17:00 CH" — sai: 17:00 không đi với CH).

### Vấn đề 8: Header & nút trùng lặp
* **Vị trí:** `L151-156`, `L164-169`, `L347-353`
* **Phân tích:** Pill "LỊCH HẸN ĐẶT TRƯỚC" + h2 "Cấu hình khung giờ rảnh…" nói cùng một ý. Hai nút primary với hai nhãn khác nhau khiến người dùng nghi chúng làm việc khác nhau. "Tiếp tục" gợi bước tiếp nhưng thực tế đóng modal.

### Vấn đề 9: Triển khai CSS & Màu sắc (Color Slop & CSS Anti-patterns)
* **Vị trí:** Toàn bộ file, đặc biệt `L137-L141`, `L425`, các class `bg-[#8AB4F8]`
* **Phân tích:**
  - **Mã màu Hard-code:** Toàn bộ giao diện dùng mã hex cố định (`#121314`, `#1E1F20`, `#8AB4F8`) thay vì sử dụng hệ thống Design System (VD: `bg-surface-default`, `text-primary`). Điều này bóp nghẹt khả năng hỗ trợ Theme (Light/Dark) và khiến bảo trì khó khăn.
  - **Hội chứng "AI Blue" (Mệt mỏi màu sắc):** Lạm dụng duy nhất một màu `#8AB4F8` cho mọi yếu tố (icon, viền input, text, block lịch, badge). Giao diện trông như một template mặc định của AI, thiếu chiều sâu thẩm mỹ.
  - **Opacity Stacking sai trái:** `bg-[#8AB4F8]/15` + `border-[#8AB4F8]/70` kết hợp với `backdrop-blur-xs`. Blur trên nền màu đặc (`bg-[#121314]`) hoàn toàn vô dụng, chỉ làm tốn tài nguyên GPU render mà không tạo ra hiệu ứng kính (glassmorphism) thực sự.
  - **Thiếu trạng thái tương tác:** Các input có `focus:border-[#8AB4F8]` nhưng thiếu hiệu ứng `focus:ring` hay trạng thái active rõ ràng để đảm bảo tiêu chuẩn trợ năng (Accessibility).

---

## 4. Danh Sách Cắt Bỏ Đề Xuất (Subtract Before Replacing)
1. **Cần XÓA BỎ ngay:**
   - [ ] Toàn bộ 8 mini-pill trong block (`L445-455`) — trục giờ bên trái đã làm việc này
   - [ ] Badge "{duration}m slots", tiêu đề, "Khách có thể đặt lịch" lặp trong từng cột (`L432-459`)
   - [ ] `border-dashed`, `shadow-lg`, `backdrop-blur-xs`, `animate-in` trên block (`L425`)
   - [ ] Eyebrow pill ở header (`L151-153`)
   - [ ] Một trong hai nút Save (giữ nút ở header, bỏ footer hoặc ngược lại)
   - [ ] Hover giả trên ô giờ nếu chưa có handler (`L419`)
   - [ ] Icon Sliders không chức năng (`L334`) — hoặc biến thành nút thật
   - [ ] `select-none` ở root (`L137`)
2. **Cần TINH CHỈNH gọn lại:**
   - [ ] Lưới: `grid-cols-[56px_repeat(7,1fr)]` cho cả header và body
   - [ ] Block tính `top/height` từ `startTime/endTime`; slot chia theo `duration` và vẽ đường kẻ mảnh bên trong, đúng vị trí giờ
   - [ ] Canvas: click-drag trên cột để tạo khoảng, kéo mép để resize, click block để xoá/sửa; đồng bộ 2 chiều với panel trái
   - [ ] Panel trái: giờ thành time-picker thật, cho phép nhiều khoảng/ngày (`Plus` thêm khoảng)
   - [ ] `handleSave` dùng `availability`, `timezone`, `repeatMode` thực
   - [ ] Now-line tính theo `new Date()`, chỉ hiện ở cột hôm nay thực
   - [ ] Thống nhất định dạng giờ (24h hoặc 12h theo locale), i18n cho "GMT+7", "SA/CH", "phút", tooltip
   - [ ] Bỏ card cho Duration/ngày — dùng hàng phẳng + divider; bỏ icon trang trí trước heading
   - [ ] Font tối thiểu 11px; label bỏ `uppercase tracking-wider`
   - [ ] Chuyển toàn bộ mã hex hard-code (`#121314`, `#8AB4F8`...) sang các biến CSS/Tailwind theo Design System thực tế của dự án.
   - [ ] Thay thế các class opacity thủ công (`/15`, `/70`) bằng bộ màu có chủ đích. Loại bỏ `backdrop-blur` vô nghĩa.
   - [ ] A11y: Thêm `focus:ring`, `role="dialog"`, `aria-modal`, Esc để đóng, focus trap

---
*Báo cáo được khởi tạo tự động bởi skill `ui-audit-reporter`.*
