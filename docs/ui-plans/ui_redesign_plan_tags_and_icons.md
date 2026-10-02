# Kế Hoạch Tái Thiết Kế Giao Diện: Loại Bỏ AI Slop Trên Event Tags & Navigation Icons

* **Dự án:** `Frontend_Usersite_Web`
* **Căn cứ yêu cầu người dùng:** Yêu cầu loại bỏ hoàn toàn các viền neon, màu nền mờ đục trong suốt (opacity), gradient loè loẹt kiểu AI trên các thẻ Tag/Chip sự kiện và các Icon thanh điều hướng.
* **Phong cách thiết kế chủ đạo:** Google Calendar & Workspace Material 3 Dark (Solid Surfaces, High-Contrast Typography, Clean Flat Geometries).

---

## 1. Phân Tích Hiện Trạng & Vấn Đề "AI Design Slop"

Dựa trên hình ảnh chụp thực tế từ người dùng, hệ thống đang tồn tại 3 nhóm thành phần bị ảnh hưởng nặng bởi phong cách sinh mã AI mặc định:

```
[Hiện trạng AI Slop]
├── Ảnh 1 & 2 (App Logo): Khối bo tròn viền xanh neon mờ ảo (bg 15% opacity + border 35% opacity + glow).
├── Ảnh 3 (Right Dock Icons): Các nút tròn bị lồng 2-3 lớp vòng tròn mờ đục (ring-1 + bg 20% + bg 15% mờ mờ).
└── Ảnh 4 (Calendar Event Chips): Thẻ sự kiện nền đen mờ 15%, viền neon rực cam/xanh 35%, text neon -> Nhìn như HUD game sci-fi.
```

### Các tác hại công thái học:
1. **Độ tương phản kém (Poor Contrast):** Nền mờ đục kết hợp chữ màu neon khiến mắt phải điều tiết liên tục, gây mỏi mắt khi sử dụng trên 15 phút.
2. **Cảm giác "hàng mẫu giả lập" (Fake / Slop Aesthetics):** Thay vì tạo cảm giác tin cậy như một phần mềm làm việc (Productivity Tool), giao diện tạo ấn tượng như một bản mẫu dựng vội bằng AI prompt.
3. **Mất trật tự thị giác (Visual Noise):** Viền sáng neon bao quanh từng sự kiện làm vụn vỡ tầm nhìn của người dùng khi nhìn vào tổng thể tháng.

---

## 2. Bảng So Sánh Kiến Trúc Trước & Sau Thiết Kế (Before vs. After)

| Thành Phần | Hiện Trạng (Dính AI Slop) | Thiết Kế Mới Đề Xuất (Clean Workspace) | Lợi Ích Mang Lại |
|---|---|---|---|
| **Event Chips trên Calendar** (`MonthGridView.tsx`) | Nền đen mờ 15% + Viền neon cam/xanh 35% + Chữ pastel neon | **Phương án Solid Block:** Khối màu đặc (`#1A73E8`, `#E37400`, `#1E8E3E`) chữ trắng phẳng đậm nét, hoặc **Thẻ nền đặc `#28292A` kèm thanh Color Strip mép trái**. Không viền neon, không opacity. | Quét mắt cực nhanh, đọc tiêu đề sự kiện rõ ràng, phong cách Google Calendar chính thống. |
| **Biểu Tượng Ứng Dụng (App Logo)** (`TopHeader.tsx`) | Ô vuông bo tròn phát sáng viền xanh neon cyan mờ mờ | **Google Calendar Page Icon chuẩn:** Khối nẹp lịch phẳng gọn gàng với ngày thực tế bên trong, hoặc icon phẳng sắc nét trên nền xanh Google `#1A73E8`, viền sạch sẽ không glow. | Nhận diện thương hiệu đẳng cấp, chuyên nghiệp và vững chãi. |
| **Right Rail Companion Icons** (`RightSidebarDock.tsx`) | 2–3 lớp vòng tròn lồng nhau mờ đục (`ring-1`, nền `20%` và `15%` opacity) | **Nút Icon Đơn Lớp Material 3:** Trạng thái thường nền trong suốt / hover xám nhẹ `#28292A`; Trạng thái Active dùng nền đặc `#2D2E30` kết hợp vạch chỉ báo trái (`Indicator Strip`), bỏ toàn bộ vòng viền lồng nhau. | Tinh giản, loại bỏ hoàn toàn cảm giác rườm rà mờ ảo. |

---

## 3. Quy Cách Đặc Tả Kỹ Thuật (Design Specifications & Tokens)

### 3.1. Quy cách Thẻ Sự kiện (Calendar Event Tags / Chips)
Chúng tôi đề xuất triển khai phong cách **Solid Block** tiêu chuẩn của Google Calendar Dark:

* **Sự kiện (Event):**
  * Nền: `#1A73E8` (Google Blue Solid)
  * Chữ: `#FFFFFF` (Trắng tinh khiết, `font-medium`, cỡ chữ `11px`)
  * Giờ sự kiện: `#D2E3FC` (Xanh nhạt tương phản cao, `font-mono`)
  * Hover: `#1B66CA`
  * Viền: `border-0` (Không dùng viền)
* **Thói quen (Routine):**
  * Nền: `#E37400` (Amber/Orange Solid)
  * Chữ: `#FFFFFF`
  * Chấm trạng thái / Giờ: `#FFE082`
  * Hover: `#D56A00`
  * Viền: `border-0`
* **Công việc (Task):**
  * Nền: `#1E8E3E` (Google Green Solid)
  * Chữ: `#FFFFFF`
  * Giờ: `#CEEAD6`
  * Hover: `#1B7E37`
  * Viền: `border-0`

*(Ghi chú: Nếu sự kiện kéo dài hoặc quá dày, hỗ trợ thêm biến thể Minimal Stripe: Nền card `#28292A` đặc, viền `#333538`, mép trái có thanh màu đặc 3px, chữ `#E3E2E3`).*

---

### 3.2. Quy cách Logo Ứng Dụng (Header App Icon)
Tại [TopHeader.tsx](file:///e:/SideProject/Frontend_Usersite_Web/src/components/layout/TopHeader.tsx):
* Thay thế khối phát sáng `bg-[#1A73E8]/15 border border-[#1A73E8]/35 text-[#8AB4F8]` bằng:
  * Một khối hình vuông bo góc nhẹ `w-9 h-9 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center shadow-sm`.
  * Bên trong hiển thị icon lịch phẳng chuẩn xác hoặc mặt lịch tối giản với ngày hiện tại (ví dụ: ngày hôm nay), tạo sự sống động và thiết thực thay cho icon tĩnh mờ nhạt.

---

### 3.3. Quy cách Cột Dock Biểu Tượng Bên Phải (Right Rail Dock Icons)
Tại [RightSidebarDock.tsx](file:///e:/SideProject/Frontend_Usersite_Web/src/components/sidebar/RightSidebarDock.tsx):
* **Xóa bỏ triệt để:** Các lớp vòng tròn lồng nhau `w-7 h-7 rounded-full bg-[#...]/15` đặt bên trong nút `w-10 h-10 ring-1 bg-[#...]/20`.
* **Cấu trúc nút mới:**
  * Kích thước nút: `w-10 h-10 rounded-full flex items-center justify-center transition-colors`.
  * **Trạng thái Mặc định (Inactive):**
    * Tasks: Nút nền tròn phẳng `#1A73E8` gọn gàng hoặc icon xanh `#1A73E8` trên nền hover `#28292A`.
    * Keep/Notes: Icon bóng đèn màu vàng chuẩn Google Keep (`#FBC02D` hoặc `#F9AB00`), nền hover `#28292A`.
    * Contacts: Icon danh bạ màu xanh chuẩn Google Contacts (`#34A853` hoặc `#81C995`), nền hover `#28292A`.
  * **Trạng thái Đang mở (Active):**
    * Nền tròn đặc `#2D2E30` (hoặc `#333538`), không có vòng viền `ring-1` phát sáng, không có hiệu ứng opacity mờ đục.
    * Thanh chỉ báo active ở mép trái: `<span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#1A73E8]" />`.
  * **Huy hiệu số lượng (Badge):** Nền đỏ đặc `#EA4335`, chữ trắng `#FFFFFF` đậm, kích thước nhỏ gọn `min-w-[16px] h-4 text-[9px]`.

---

## 4. Kế Hoạch Chỉnh Sửa Từng File Mã Nguồn (Code Impact Plan)

### 1. `src/components/calendar/MonthGridView.tsx`
- [ ] Chỉnh sửa hàm xác định kiểu dáng chip sự kiện (`chipStyle`, `dotColor`):
  - Chuyển từ nền `bg-[#...]/15 border border-[#...]/35` sang nền đặc solid (`bg-[#1A73E8] text-white`, `bg-[#E37400] text-white`, `bg-[#1E8E3E] text-white`).
  - Điều chỉnh font chữ và màu sắc giờ (`ev.time`) để đảm bảo độ tương phản cao, rõ ràng.
  - Tinh chỉnh bo góc `rounded` mượt mà, loại bỏ hoàn toàn viền rực màu neon.

### 2. `src/components/layout/TopHeader.tsx`
- [ ] Tái cấu trúc vùng hiển thị logo ứng dụng tại dòng 68–73:
  - Thay thế khối container `bg-[#1A73E8]/15 border border-[#1A73E8]/35` bằng khối nẹp lịch phẳng hoặc solid icon `bg-[#1A73E8] text-white rounded-lg`.
  - Hiển thị ngày hôm nay rõ ràng hoặc biểu tượng Calendar sắc sảo.

### 3. `src/components/sidebar/RightSidebarDock.tsx`
- [ ] Xóa bỏ cấu trúc 2 vòng lồng nhau tại các nút Tasks, Notes/Routine, Contacts.
- [ ] Áp dụng cấu trúc nút đơn lớp Material 3:
  - Nền hover phẳng `#28292A`.
  - Trạng thái Active dùng container xám `#2D2E30` sạch sẽ + vạch indicator bên trái.
  - Icon giữ màu sắc nhận diện dịch vụ chuẩn mực, không dùng hiệu ứng viền phát sáng `ring-1 ring-[#...]/50`.

---

## 5. Phương Án Xác Minh (Verification Plan)
- [ ] Kiểm tra trực quan trên màn hình hiển thị: Các tag trên ô lịch tháng có nền đặc rõ ràng, đọc tiêu đề và thời gian dễ dàng ngay cả từ khoảng cách 1 mét.
- [ ] Kiểm tra trạng thái đóng/mở thanh Dock bên phải: Icon chuyển đổi mượt mà giữa trạng thái inactive và active mà không có vòng tròn phát sáng mờ ảo.
- [ ] Kiểm tra logo trên Header: Sắc nét, liền mạch với thanh TopHeader tối màu chuẩn Google Workspace.
- [ ] Chạy `npm run build` để đảm bảo không phát sinh bất kỳ lỗi cú pháp hoặc TypeScript nào.
