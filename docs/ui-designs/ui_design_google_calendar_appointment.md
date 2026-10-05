# Hồ Sơ Thiết Kế Giao Diện Mới: Lịch Hẹn Đặt Trước (Clone Google Calendar)

* **Ngày thiết kế:** 2026-10-05
* **Archetype:** Focused Form & Data Grid
* **Thiết bị mục tiêu:** Desktop (1440px+)
* **Công cụ thực hiện:** Stitch MCP + MengTo Anti-Slop Suite
* **Stitch Project ID:** `2415211978166983436` | **Screen ID:** `320ac57bb710436e84e94931abb4c766`

---

## 1. Mục Tiêu Nghiệp Vụ & Kiến Trúc Trải Nghiệm (UX Architecture)
* **Job-to-be-Done cốt lõi:** Cho phép người dùng thiết lập lịch rảnh chuyên nghiệp, chính xác đến từng phút và giới hạn đặt lịch giống y hệt trải nghiệm người dùng của Google Calendar.
* **Điểm đột phá thiết kế:** Không lai tạp, sao chép chính xác tỉ lệ (1:1) giao diện Dark Mode của Google Calendar. Sử dụng cấu trúc Grid linh hoạt và các Dropdown tùy chỉnh không bị gò bó bởi UI mặc định của trình duyệt. 

---

## 2. Bố Cục Không Gian (Spatial Layout & Wireframe)
* **Header / Navigation:** Tiêu đề "Lịch hẹn đặt trước" và các thao tác lưu.
* **Main Canvas (2 Cột):**
  - **Cột trái (Panel cài đặt, 340px-420px):** Cuộn độc lập. Chứa tiêu đề sự kiện, cài đặt thời lượng, thời gian rảnh hàng tuần (Dropdown tùy chỉnh giờ phút, không bị snap 15 phút), giới hạn lịch hẹn và tùy chọn.
  - **Cột phải (Calendar Grid):** Hiển thị dạng tuần (Thứ 2 đến Chủ Nhật), chia lưới từ 8AM đến 8PM. Thanh báo giờ hiện tại màu đỏ chạy ngang qua ô ngày hiện tại.

---

## 3. Hệ Thống Token Thiết Kế (Design System Tokens)
* **Surface Language (Dark Theme):**
  - Base Background: `#202124` (Nền Modal và Grid)
  - Container / Surface Input: `#303134` (Nền các ô input, dropdown menu)
  - Hover / Active Surface: `#28292a` / `#3c4043`
  - Border: `1px solid #5f6368` (Viền input, border divider)
* **Color Palette:**
  - Primary Accent: `#8ab4f8` (Nút "Tiếp", khung giờ đã chọn, checkbox active)
  - Danger / Current Time: `#f28b82` (Đường kẻ đỏ hiển thị giờ hiện tại)
* **Typography:**
  - Font Family: `Roboto` / `Google Sans`
  - Primary Text: `#e8eaed`
  - Secondary Text: `#9aa0a6`
* **MengTo Craft Touches:**
  - Viền mỏng 1px, không dùng shadow quá lớn, sử dụng flat color chuẩn Material Design.
  - Dropdown menu cuộn linh hoạt với Custom Scrollbar.
  - Thanh báo giờ hiện tại có dấu chấm đỏ tròn nhỏ ở đầu mút bên trái.

---

## 4. Danh Mục Thành Phần Giao Diện (Component Specifications)
| Thành phần | Loại UI | Dữ liệu hiển thị | Hành vi tương tác |
|---|---|---|---|
| Time Picker Dropdown | Custom Dropdown | Giờ/Phút (vd: 9:00AM) | Click để mở menu, cuộn chọn giờ hoặc nhập text thủ công từng phút |
| Calendar Grid | Lưới thời gian | Các khối giờ rảnh màu xanh | Hiển thị các khối hộp, đường giờ hiện tại màu đỏ |
| Action Button | Pill Button | Nút "Tiếp", "Hủy" | Bo góc tròn hoàn toàn (rounded-full) |
| Settings Section | Form Group | Thời lượng, Phạm vi | Các khối input nằm xen kẽ radio/checkbox chuẩn Google |

---

## 5. Danh Mục Đã Kiểm Định Anti-Slop (Quality Gate Passed)
- [x] Không nhồi nhét hiệu ứng trang trí thừa (No decorative stacking, dùng thuần màu solid của Google)
- [x] Không bọc card lồng card, không bento grid hình thức
- [x] Không từ ngữ quảng cáo AI sáo rỗng, nhãn rõ ràng, xúc tích
- [x] Mật độ thông tin tương thích hoàn hảo với nghiệp vụ sử dụng
- [x] Độ tương phản màu sắc đạt chuẩn WCAG AA/AAA

---

## 6. Liên Kết Preview & Chuyển Giao Lập Trình
* **File Preview Mockup:** [google_calendar_appointment_modal_mockup.html](file:///e:/SideProject/Frontend_Usersite_Web/docs/ui-designs/previews/google_calendar_appointment_modal_mockup.html)
* **Skill chuyển giao:** Kích hoạt `/ui-clean-coder` để lập trình component vào mã nguồn.
