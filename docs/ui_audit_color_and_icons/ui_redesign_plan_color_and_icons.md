# Kế Hoạch Chuẩn Hóa Bảng Màu & Biểu Tượng: Workspace Calendar (Color & Icon System Redesign)

* **Dựa trên báo cáo:** `docs/ui_audit_color_and_icons.md`
* **Tiêu chuẩn thiết kế:** Google Material 3 Dark Semantic Tokens & MengTo Anti-Slop System
* **Trạng thái:** Chờ người dùng phê duyệt trước khi lập trình (Awaiting User Approval)

---

## 1. Mục Tiêu Cốt Lõi (Core Objectives)

1. **Triệt tiêu 100% rác Emoji và Icon tự vẽ chắp vá:**
   - Thay thế toàn bộ emoji hệ điều hành (`💡`, `👥`, `👑`, `▾`) bằng icon vector SVG chính thức từ thư viện `lucide-react` đồng bộ nét vẽ và tỷ lệ.
   - Thay thế nút tạo dấu cộng vẽ tay bằng 2 thẻ `span` bằng icon `Plus` vector chuẩn xác.
2. **Khắc phục triệt để xung đột màu sắc ngữ nghĩa (Semantic Consistency):**
   - Thiết lập bảng mã màu ngữ nghĩa thống nhất 1-1 cho toàn bộ ứng dụng: Sự kiện luôn luôn là Xanh dương (`#8AB4F8`), Task luôn luôn là Xanh lá (`#81C995`), Routine luôn luôn là Vàng hổ phách (`#FDD663`).
3. **Quy hoạch 5 cấp độ bề mặt tối (Surface Elevation Architecture):**
   - Xóa bỏ hơn 15 mã màu xám đen hardcode ngẫu nhiên, quy về 5 token bề mặt Material 3 Dark theme phân cấp rõ ràng.
4. **Chuyển đổi Event Chips sang dạng Muted Pastel Surface:**
   - Thay thế các khối màu đặc rực rỡ thập niên 2010 (`#174EA6`, `#1E8E3E`) bằng dạng nền mờ trong trẻo (20% opacity) với viền tinh tế và chữ sáng rõ, giảm 100% cảm giác mỏi mắt khi xem hàng chục sự kiện.

---

## 2. Hệ Thống Design Tokens Chuẩn (Design Specification)

### A. Tầng 1: 5 Cấp Độ Bề Mặt (Surface Elevation Levels)

| Tên Token | Mã Hex | Vai Trò Áp Dụng | Thay Thế Các Mã Cũ |
|---|---|---|---|
| **Level 0 (Base Canvas)** | `#121314` | Nền cốt lõi toàn ứng dụng | `#121314` |
| **Level 1 (Surface Low)** | `#171819` | Nền dock thu gọn, dải thanh trạng thái đáy | `#151618`, `#161718`, `#1A1B1D` |
| **Level 2 (Surface Container)** | `#1F2021` | Nền Sidebars, Drawer, Ô lịch chính | `#1C1D1F`, `#232426`, `#242527` |
| **Level 3 (Surface High)** | `#28292A` | Nền nút bấm, Thẻ con, Tab filter | `#242628`, `#28292A`, `#303336` |
| **Level 4 (Surface Highest)** | `#333538` | Trạng thái hover, Active chips | `#333538`, `#3A3B3D`, `#3C4043` |
| **Divider & Border** | `#2A2B2D` | Đường kẻ phân cách 1px tinh tế | Các loại viền rải rác |

---

### B. Tầng 2: Màu Ngữ Nghĩa Dữ Liệu Nghiệp Vụ (Semantic Color System)

Áp dụng đồng bộ 100% trên Menu Tạo -> Checklist Sidebar -> Chip Lịch Tháng -> Timeline Tuần:

| Loại Dữ Liệu | Màu Chủ Đạo | Token Nền Mờ (Background) | Token Viền (Border) | Token Chữ (Text) |
|---|---|---|---|---|
| **Sự kiện (Events)** | Google Blue | `bg-[#1A73E8]/15` | `border-[#1A73E8]/35` | `text-[#8AB4F8]` |
| **Việc cần làm (Tasks)** | Google Green | `bg-[#1E8E3E]/15` | `border-[#1E8E3E]/35` | `text-[#81C995]` |
| **Thói quen (Routine)** | Google Amber | `bg-[#E37400]/15` | `border-[#E37400]/35` | `text-[#FDD663]` |
| **Lên lịch hẹn / Ngày lễ** | Google Purple | `bg-[#8430CE]/15` | `border-[#8430CE]/35` | `text-[#C58AF9]` |

---

### C. Tầng 3: Độ Ưu Tiên Công Việc (Task Priority Tokens)

Thay thế hoàn toàn bộ 3 màu nâu đỏ đục ngầu cũ bằng các token sáng rõ:

| Độ Ưu Tiên | Nhãn Hiển Thị | Nền (Bg) | Viền (Border) | Chữ (Text) |
|---|---|---|---|---|
| **High** | GẤP / URGENT | `bg-[#EA4335]/15` | `border-[#EA4335]/35` | `text-[#F28B82]` |
| **Medium** | TB / MED | `bg-[#FBBC04]/15` | `border-[#FBBC04]/35` | `text-[#FDD663]` |
| **Low** | THẤP / LOW | `bg-[#9AA0A6]/12` | `border-[#9AA0A6]/25` | `text-[#9AA0A6]` |

---

### D. Tầng 4: Quy Chuẩn Biểu Tượng (Iconography Standards)

* **Bộ thư viện thống nhất:** `lucide-react` (loại bỏ hoàn toàn emoji và ký tự unicode thô).
* **Quy chuẩn kích thước và nét vẽ:**
  - Icon nhỏ trong chip/badge/input: `14px` (`w-3.5 h-3.5`, stroke 2px).
  - Icon điều hướng, menu và header: `18px` (`w-[18px] h-[18px]`, stroke 1.75px).
  - Icon trong Dock công cụ: `20px` (`w-5 h-5`, stroke 1.75px) nằm trong khung tròn `w-9 h-9`.

---

## 3. Kế Hoạch Chỉnh Sửa Từng File Mã Nguồn (Code Impact Plan)

### File 1: `src/components/sidebar/RightSidebarDock.tsx`
- **Nhiệm vụ:** Loại bỏ 100% Emoji, thay bằng Lucide SVG Icons.
- **Thay đổi chi tiết:**
  - Thay `<span className="text-xs">💡</span>` bằng:
    ```tsx
    <Lightbulb className="w-5 h-5 text-[#FDD663]" />
    ```
  - Thay `<span className="text-xs">👥</span>` bằng:
    ```tsx
    <Users className="w-5 h-5 text-[#81C995]" />
    ```
  - Thống nhất kích thước vòng tròn bao quanh icon: `w-9 h-9` thay vì `w-10 h-10` kèm `w-7 h-7` lồng nhau.

### File 2: `src/components/sidebar/LeftSidebar.tsx`
- **Nhiệm vụ:** Đồng bộ hóa màu ngữ nghĩa và loại bỏ icon chắp vá.
- **Thay đổi chi tiết:**
  - **Nút "+ Tạo":** Xóa bỏ 2 thẻ `span` tự vẽ (L53-56). Thay bằng icon `Plus` vector sắc nét của Lucide với gradient nhẹ hoặc icon `Plus` Google chuẩn.
  - **Mũi tên dropdown:** Thay ký tự `▾` bằng `<ChevronDown className="w-3.5 h-3.5 text-[#9AA0A6]" />`.
  - **Đồng bộ màu sắc chấm danh mục:**
    - Sự kiện (Event): Đổi chấm tròn thành Xanh dương (`#8AB4F8`) và accent checkbox `accent-[#1A73E8]`.
    - Task: Đổi chấm tròn thành Xanh lá (`#81C995`) và accent checkbox `accent-[#1E8E3E]`.
    - Routine: Giữ màu Vàng hổ phách (`#FDD663`) và accent checkbox `accent-[#E37400]`.
  - **Footer:** Xóa bỏ emoji vương miện `👑`.

### File 3: `src/components/calendar/MonthGridView.tsx`
- **Nhiệm vụ:** Chuyển đổi Chip Sự Kiện sang dạng Muted Pastel Surface.
- **Thay đổi chi tiết:**
  - Thay thế màu nền đặc chói mắt `#174EA6` và `#1E8E3E` bằng các token pastel mờ:
    - Chip Sự kiện: `bg-[#1A73E8]/15 border border-[#1A73E8]/35 text-[#8AB4F8] hover:bg-[#1A73E8]/25`.
    - Chip Routine/Khác: `bg-[#E37400]/15 border border-[#E37400]/35 text-[#FDD663] hover:bg-[#E37400]/25`.
  - Thêm chấm tròn màu nhỏ (indicator dot) phía trước tên sự kiện để phân biệt nhanh loại lịch.

### File 4: `src/components/task/TaskItem.tsx`
- **Nhiệm vụ:** Chuẩn hóa badge ưu tiên GẤP / TB.
- **Thay đổi chi tiết:**
  - Badge GẤP: Thay `#3C1E1E` bằng `bg-[#EA4335]/15 text-[#F28B82] border border-[#EA4335]/35`.
  - Badge TB: Thay `#392F1D` bằng `bg-[#FBBC04]/15 text-[#FDD663] border border-[#FBBC04]/35`.

### File 5: `src/components/layout/TopHeader.tsx`
- **Nhiệm vụ:** Tinh giản logo Lịch.
- **Thay đổi chi tiết:**
  - Thay khối hình chữ "T9 15" nặng nề bằng icon `CalendarDays` hoặc logo Lịch phẳng tối giản của Material Design, mang lại vẻ thanh thoát, hiện đại.

---

## 4. Phương Án Xác Minh & Bảo Toàn Logic (Verification Plan)

1. **Bảo toàn 100% Logic Nghiệp Vụ:**
   - Không thay đổi bất kỳ state, context props hay event handlers nào.
   - Các hành vi click vào dock mở panel, click vào menu tạo sự kiện, filter checklist giữ nguyên tính năng.
2. **Kiểm tra trực quan (Visual Inspection):**
   - Màu sắc giữa menu Tạo và danh mục Checklist khớp nhau 100% theo mã màu ngữ nghĩa.
   - Toàn bộ các icon hiển thị đồng bộ nét vẽ vector SVG, không còn bất kỳ emoji nào xuất hiện trên giao diện.
   - Chip sự kiện trên lưới tháng êm dịu, không bị chói mắt khi xem trong phòng tối.
3. **Kiểm tra biên dịch:**
   - Đảm bảo `npm run build` chạy thành công (exit code 0).

---

*Kế hoạch được khởi tạo tự động bởi skill `ui-redesign-planner`.*
