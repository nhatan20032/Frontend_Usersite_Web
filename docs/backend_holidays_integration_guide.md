# Tích hợp ngày lễ hiện hành

Lịch tự tính và dữ liệu lễ cố định phía client đã được thay bằng API backend.
Xem `App_Backend/docs/FIREBASE_AND_HOLIDAYS_SETUP.md` trong bộ repository để biết nguồn dữ liệu, API, chu kỳ cập nhật và giới hạn.

Web gọi `/api/v1/user/holidays` với JWT. Mặc định Việt Nam, chọn quốc gia/khu vực trong Cài đặt → Ngôn ngữ & khu vực. Lịch chỉ xem, không lưu thành sự kiện cá nhân. Nguồn lỗi báo rõ, không nạp dữ liệu mẫu thay thế.
