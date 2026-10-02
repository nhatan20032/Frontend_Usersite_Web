# Kế Hoạch Tái Thiết Kế Giao Diện: Quét Sạch Toàn Bộ AI Slop Trên Badges, Buttons & Surface Containers

* **Dự án:** `Frontend_Usersite_Web`
* **Căn cứ rà soát:** Phát hiện hàng loạt các thành phần Tag phân loại, Badge mức độ ưu tiên, Khối nhắc nhở và Nút hành động đang bị áp dụng mẫu mã AI Slop (màu nền mờ đục 10–20% opacity + viền rực neon 30–40% + chữ mờ mắt).
* **Mục tiêu:** Thay thế 100% các thành phần này bằng ngôn ngữ thiết kế phẳng, sắc nét, tương phản cao chuẩn **Google Workspace & Material 3 Dark System** (Solid Badges, Neutral Containers, Clear Action Buttons).

---

## 1. Kết Quả Quét Toàn Bộ Source Code (Audit Findings)

Qua quét toàn diện thư mục `src/`, phát hiện **8 nhóm component** đang tồn tại hiệu ứng viền neon và nền mờ đục:

```
[Danh sách các vị trí dính AI Slop được rà soát]
├── 1. src/components/modals/EventDetailModal.tsx
│   ├── Dòng 58-65: Pill "SỰ KIỆN" / "THÓI QUEN" dùng bg-[#8AB4F8]/15 border-[#8AB4F8]/30 (Ảnh 1 người dùng gửi)
│   ├── Dòng 122-126: Khối thông báo nhắc nhở "Thời gian nhắc nhở" dùng bg-[#FDD663]/10 border-[#FDD663]/20 (Ảnh 2 người dùng gửi)
│   └── Dòng 144-148: Nút "Xóa" dùng bg-[#F28B82]/15 border-[#F28B82]/30 text-[#F28B82] (Ảnh 3 người dùng gửi)
│
├── 2. src/components/task/TaskItem.tsx
│   ├── Dòng 54-56: Badge mức ưu tiên "GẤP" dùng bg-[#EA4335]/15 border-[#EA4335]/35 (Ảnh 5 người dùng gửi)
│   └── Dòng 59-61: Badge mức ưu tiên "TB" dùng bg-[#FBBC04]/15 border-[#FBBC04]/35 (Ảnh 4 người dùng gửi)
│
├── 3. src/components/calendar/DayInspectorDrawer.tsx
│   ├── Dòng 124: Khối biểu tượng Sparkles empty-state dùng bg-[#1A73E8]/15 border-[#1A73E8]/30
│   ├── Dòng 156: Badge ưu tiên High dùng bg-[#F28B82]/20 border-[#F28B82]/30
│   └── Dòng 170-175: Nút xóa thùng rác dùng hover:bg-[#F28B82]/10 text-[#70757A]
│
├── 4. src/components/notes-routine/NotesRoutineSidebarPanel.tsx
│   ├── Dòng 152: Container icon Routine dùng bg-[#E37400]/15 border-[#E37400]/30
│   ├── Dòng 215: Tab chọn Routine dùng bg-[#E37400]/20 border-[#E37400]/40
│   ├── Dòng 400: Badge "Hoàn tất" dùng bg-[#1E8E3E]/15 border-[#1E8E3E]/30
│   └── Dòng 404: Badge Streak dùng bg-[#E37400]/15 border-[#E37400]/30
│
├── 5. src/components/sidebar/LeftSidebar.tsx
│   └── Dòng 97: Badge "MỚI" dùng bg-[#8430CE]/20 text-[#C58AF9]
│
├── 6. src/components/modals/RecurringActionModal.tsx
│   ├── Dòng 43: Icon thùng rác dùng bg-rose-500/15 text-rose-400
│   └── Dòng 113: Badge đếm ngày dùng bg-rose-500/20 text-rose-400
│
├── 7. src/components/modals/CheckoutModal.tsx
│   ├── Dòng 107: Huy hiệu VIP Upgrade dùng bg-[#F9AB00]/15 border-[#F9AB00]/40
│   └── Dòng 122, 137, 152: Thẻ gói tháng dùng bg-[#...]/15 border
│
└── 8. src/components/modals/LimitModal.tsx
    └── Dòng 23: Icon ổ khóa dùng bg-[#F9AB00]/15 border-[#F9AB00]/30
```

---

## 2. Bảng So Sánh Kiến Trúc Trước & Sau Thiết Kế (Before vs. After)

| Nhóm Thành Phần | Hiện Trạng (AI Slop / Opacity mờ) | Thiết Kế Mới Đề Xuất (Clean Workspace Standard) | Lợi Ích Cải Tiến |
|---|---|---|---|
| **Priority Badges** (`GẤP`, `TB`, `Thấp`) | Nền đen mờ 15% + Viền neon phát sáng (`#EA4335/35`, `#FBBC04/35`) | **Solid Mini Badges:**<br>• GẤP: Nền đỏ đặc `#D93025`, chữ trắng `#FFFFFF` đậm.<br>• TB: Nền cam đặc `#E37400`, chữ trắng `#FFFFFF`.<br>• Thấp: Nền xám đặc `#333538`, chữ `#9AA0A6`. | Nổi bật tức thì, không bị mờ mắt, nhận biết mức độ quan trọng trong 0.1 giây. |
| **Category Pill** (`SỰ KIỆN`, `THÓI QUEN`) | Nền mờ 15% + Viền neon màu xanh/vàng 30% | **Solid Rounded Pills:**<br>• Sự kiện: Nền xanh Google `#1A73E8`, chữ trắng `#FFFFFF` sắc nét.<br>• Thói quen: Nền cam `#E37400`, chữ trắng `#FFFFFF`. | Phân cấp thị giác rõ rệt, chuẩn phong cách Google Workspace. |
| **Khối Thông Báo Nhắc Nhở** (`Reminder Block`) | Khối nền vàng mờ 10% viền vàng phát sáng 20% | **Neutral Material Container:** Nền đặc `#242527`, viền trung tính `#333538`, Icon chuông vàng `#FDD663`, tiêu đề `#E3E2E3` rõ ràng. | Dễ đọc, sạch sẽ, hòa nhập hoàn hảo vào modal chi tiết. |
| **Nút Hành Động Nguy Hiểm** (`Nút Xóa`) | Nền đỏ mờ 15% viền đỏ 30% chữ đỏ | **Clean Action Button:** Nền xám `#28292A` viền `#3A3B3D`, chữ `#F28B82`, khi hover chuyển sang đỏ solid `#D93025` chữ trắng. | Cảm giác bấm chắc chắn, rõ ràng và an toàn cho người dùng. |
| **Khối Thống Kê & Count Badges** | Viền neon xanh/cam mờ 30% | **Solid Chip Count:** Nền xám `#28292A` viền `#333538`, số liệu và icon màu phẳng sắc nét. | Giảm vụn vặt thị giác, loại bỏ hoàn toàn cảm giác website sinh bằng prompt. |

---

## 3. Quy Cách Đặc Tả Kỹ Thuật (Design Tokens & CSS Rules)

### 3.1. Priority Tokens
```tsx
// Gấp / Khẩn cấp:
className="text-[9px] bg-[#D93025] text-white font-bold px-2 py-0.5 rounded shadow-xs"

// Trung bình:
className="text-[9px] bg-[#E37400] text-white font-semibold px-2 py-0.5 rounded shadow-xs"

// Thấp / Tiêu chuẩn:
className="text-[9px] bg-[#333538] text-[#9AA0A6] font-medium px-2 py-0.5 rounded"
```

### 3.2. Modal Tag Tokens
```tsx
// Sự kiện:
className="text-[10px] bg-[#1A73E8] text-white font-semibold px-2.5 py-0.5 rounded-full shadow-xs"

// Thói quen:
className="text-[10px] bg-[#E37400] text-white font-semibold px-2.5 py-0.5 rounded-full shadow-xs"
```

### 3.3. Reminder Block Tokens
```tsx
className="bg-[#242527] border border-[#333538] p-2.5 rounded-lg text-xs flex items-center justify-between text-[#E3E2E3]"
```

### 3.4. Delete / Danger Button Tokens
```tsx
className="bg-[#28292A] hover:bg-[#D93025] text-[#F28B82] hover:text-white border border-[#3A3B3D] hover:border-transparent font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
```

---

## 4. Kế Hoạch Chỉnh Sửa Chi Tiết (Code Impact Plan)

### File 1: `src/components/modals/EventDetailModal.tsx`
- [ ] Chuyển đổi Pill "SỰ KIỆN" và "THÓI QUEN" sang `bg-[#1A73E8]` và `bg-[#E37400]` chữ trắng phẳng.
- [ ] Tái cấu trúc khối Reminder thành hộp phẳng `#242527` viền `#333538`.
- [ ] Cập nhật nút Xóa thành nút tương tác chuẩn Material 3 (hover solid danger).

### File 2: `src/components/task/TaskItem.tsx`
- [ ] Chuyển đổi badge `GẤP` sang nền solid `#D93025` chữ trắng.
- [ ] Chuyển đổi badge `TB` sang nền solid `#E37400` chữ trắng.

### File 3: `src/components/calendar/DayInspectorDrawer.tsx`
- [ ] Cập nhật badge ưu tiên sang nền solid tương ứng.
- [ ] Làm phẳng container icon empty-state.

### File 4: `src/components/notes-routine/NotesRoutineSidebarPanel.tsx`
- [ ] Làm sạch các badge hoàn tất và streak đếm ngày sang container nền đặc `#28292A` viền `#333538`.
- [ ] Tinh chỉnh các tab chọn Routine.

### File 5: `src/components/sidebar/LeftSidebar.tsx` & Các Modal còn lại
- [ ] Chuẩn hóa badge "MỚI" trong menu tạo sang màu solid `#8430CE` chữ trắng.
- [ ] Dọn sạch các icon ổ khóa, icon thùng rác mờ mờ trong `LimitModal`, `RecurringActionModal`.
- [ ] Chuyển thẻ lựa chọn gói trong `CheckoutModal` sang phong cách viền phẳng sắc nét.

---

## 5. Phương Án Xác Minh (Verification Plan)
- [ ] Kiểm tra trực quan trên màn hình:
  - Mở modal chi tiết sự kiện (`EventDetailModal`): Badge loại sự kiện, khối nhắc nhở và nút xóa hiển thị sắc nét, nền đặc rõ ràng.
  - Kiểm tra bảng công việc (`TaskItem`): Badge `GẤP` màu đỏ tươi rõ ràng, badge `TB` màu cam rõ ràng.
- [ ] Chạy `npm run build` để đảm bảo 0 lỗi TypeScript và bundle sạch sẽ.
