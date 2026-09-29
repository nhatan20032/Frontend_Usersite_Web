# BÁO CÁO ĐẶC TẢ CHI TIẾT API CHO GIAO DIỆN NGƯỜI DÙNG (FRONTEND_USERSITE_WEB)

> **Dự án**: RoutinePulse - Nền tảng Quản lý Lịch Thông Minh, Thói Quen, Nhiệm Vụ & Lịch Hẹn  
> **Phân hệ**: Frontend User Site (`Frontend_Usersite_Web`)  
> **Thư mục tài liệu**: `docs/api_specifications_report.md`  
> **Chuẩn giao tiếp**: RESTful JSON API over HTTPS, Header `Authorization: Bearer <JWT_TOKEN>`

---

## MỤC LỤC
1. [Tổng quan Kiến trúc Tích hợp UI - API](#1-tổng-quan-kiến-trúc-tích-hợp-ui---api)
2. [Phân hệ 1: Xác thực & Hồ sơ Cá nhân (Authentication & User Profile)](#phân-hệ-1-xác-thực--hồ-sơ-cá-nhân-authentication--user-profile)
3. [Phân hệ 2: Lịch & Quản lý Sự kiện (Calendar & Events)](#phân-hệ-2-lịch--quản-lý-sự-kiện-calendar--events)
4. [Phân hệ 3: Quản lý Thói quen & Điểm danh Chuỗi (Routines & Streak Habits)](#phân-hệ-3-quản-lý-thói-quen--điểm-danh-chuỗi-routines--streak-habits)
5. [Phân hệ 4: Quản lý Công việc & Phân rã AI (Tasks & Subtasks)](#phân-hệ-4-quản-lý-công-việc--phân-rã-ai-tasks--subtasks)
6. [Phân hệ 5: Ghi chú Nhanh Thẻ màu (Keep Notes)](#phân-hệ-5-ghi-chú-nhanh-thẻ-màu-keep-notes)
7. [Phân hệ 6: Lịch hẹn & Khung giờ Làm việc (Appointment Scheduling & Availability)](#phân-hệ-6-lịch-hẹn--khung-giờ-làm-việc-appointment-scheduling--availability)
8. [Phân hệ 7: Gói Dịch vụ, Mã Giảm giá & Thanh toán (Subscriptions & Checkout)](#phân-hệ-7-gói-dịch-vụ-mã-giảm-giá--thanh-toán-subscriptions--checkout)
9. [Phân hệ 8: Cấu hình Giao diện & Tùy chọn Hệ thống (Preferences & Settings)](#phân-hệ-8-cấu-hình-giao-diện--tùy-chọn-hệ-thống-preferences--settings)
10. [Bảng Tổng hợp Khớp nối API Frontend vs Backend (App_Backend)](#10-bảng-tổng-hợp-khớp-nối-api-frontend-vs-backend-app_backend)

---

## 1. TỔNG QUAN KIẾN TRÚC TÍCH HỢP UI - API

Frontend hiện đang sử dụng `React 18 + TypeScript + Vite + TailwindCSS`. Cấu trúc state quản lý tập trung thông qua 3 Context:
- **`AuthContext.tsx`**: Lưu trữ `token`, phiên đăng nhập, cấp bậc tài khoản (`FREE`, `PRO`, `VIP`) và quyền năng (Permissions).
- **`AppContext.tsx`**: Quản lý lịch sự kiện, thói quen, công việc, ghi chú, bộ lọc danh mục và trạng thái hiển thị các Modal/Drawer.
- **`LanguageContext.tsx`**: Đa ngôn ngữ (`vi`, `en`).

Tài liệu này xác định chi tiết dữ liệu đầu vào (**Input**), cấu trúc dữ liệu trả về (**Output**) và mục đích sử dụng trên từng thành phần giao diện (**UI Usage**) để chuyển đổi toàn bộ cơ chế Mock/LocalStorage sang tích hợp Backend thực tế.

---

## PHÂN HỆ 1: XÁC THỰC & HỒ SƠ CÁ NHÂN (AUTHENTICATION & USER PROFILE)

### 1.1. Đăng ký tài khoản (Register)
- **Màn hình UI**: `LoginPage.tsx` / `AuthForm.tsx` (Tab Đăng ký).
- **Mục đích**: Tạo tài khoản người dùng mới và tự động thiết lập gói `FREE_USER`.
- **Phương thức & Endpoint**: `POST /api/v1/user/auth/register`
- **Xác thực**: Public.

#### Input (Request Body)
```json
{
  "email": "user@routinepulse.com",
  "password": "Password@123",
  "fullName": "Nguyễn Văn An",
  "phone": "0987654321"
}
```
| Trường | Kiểu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `email` | string | Có | Email hợp lệ, duy nhất trong hệ thống |
| `password` | string | Có | Tối thiểu 8 ký tự, gồm chữ hoa, thường và số |
| `fullName` | string | Có | Họ tên đầy đủ hiển thị trên Navbar & Avatar |
| `phone` | string | Không | Số điện thoại liên hệ |

#### Output (Response Body - 200 OK)
```json
{
  "message": "Đăng ký tài khoản thành công.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a6f874c2-9e22-475e-9901-70e633d45ef2",
    "email": "user@routinepulse.com",
    "fullName": "Nguyễn Văn An",
    "phone": "0987654321",
    "role": "FREE_USER",
    "subscriptionTier": "FREE",
    "isPremium": false,
    "planName": "Gói Miễn Phí",
    "planExpiresAt": null,
    "features": ["BASIC_CALENDAR", "DAILY_ROUTINE"]
  }
}
```
- **UI Sử dụng**: Lưu JWT vào `localStorage` qua `setAuthToken(token)`, cập nhật `currentUser` trong `AuthContext`, chuyển hướng vào màn hình làm việc chính `AppLayout`.

---

### 1.2. Đăng nhập (Login)
- **Màn hình UI**: `LoginPage.tsx` / `AuthForm.tsx` (Tab Đăng nhập).
- **Phương thức & Endpoint**: `POST /api/v1/user/auth/login`
- **Xác thực**: Public.

#### Input (Request Body)
```json
{
  "email": "user@routinepulse.com",
  "password": "Password@123"
}
```

#### Output (Response Body - 200 OK)
```json
{
  "message": "Đăng nhập thành công.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a6f874c2-9e22-475e-9901-70e633d45ef2",
    "email": "user@routinepulse.com",
    "fullName": "Nguyễn Văn An",
    "phone": "0987654321",
    "role": "PREMIUM_USER",
    "subscriptionTier": "VIP",
    "isPremium": true,
    "planName": "Gói Trọn Đời VIP (1 Năm)",
    "planExpiresAt": "2027-09-29T00:00:00Z",
    "features": [
      "UNLIMITED_TASKS",
      "UNLIMITED_ROUTINES",
      "TRAVEL_ALERT",
      "AI_ASSISTANT",
      "CUSTOM_THEMES"
    ]
  }
}
```
- **UI Sử dụng**: Cập nhật badge VIP/PRO trên `TopHeader.tsx` và `UserProfileDropdown.tsx`, mở khóa tính năng nâng cao (AI Assistant, Travel alert).

---

### 1.3. Lấy thông tin phiên hiện tại (Get Current Profile)
- **Màn hình UI**: Khởi tạo app trong `AuthContext.tsx` khi có sẵn token.
- **Phương thức & Endpoint**: `GET /api/v1/user/auth/me`
- **Xác thực**: `Bearer Token`.
- **Input**: None (truyền Token trên Header).
- **Output (200 OK)**: Trả về object `user` tương tự cấu trúc response của Login.
- **UI Sử dụng**: Tự động đồng bộ trạng thái VIP/Hạn dùng của gói khi tải lại trang F5.

---

### 1.4. Cập nhật hồ sơ người dùng (Update Profile)
- **Màn hình UI**: `SettingsModal.tsx` (Tab "Hồ sơ cá nhân").
- **Phương thức & Endpoint**: `PUT /api/v1/user/auth/profile`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "fullName": "Nguyễn Văn An Cường",
  "phone": "0912345678"
}
```

#### Output (200 OK)
```json
{
  "message": "Cập nhật thông tin thành công.",
  "user": {
    "id": "a6f874c2-9e22-475e-9901-70e633d45ef2",
    "fullName": "Nguyễn Văn An Cường",
    "email": "user@routinepulse.com",
    "phone": "0912345678"
  }
}
```
- **UI Sử dụng**: Cập nhật chữ ký tên và Avatar Initials trên Navbar; kích hoạt Toast thông báo thành công.

---

### 1.5. Đổi mật khẩu (Change Password)
- **Màn hình UI**: `SettingsModal.tsx` (Bảo mật tài khoản).
- **Phương thức & Endpoint**: `PUT /api/v1/user/auth/change-password`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@2026"
}
```
#### Output (200 OK)
```json
{
  "message": "Đổi mật khẩu thành công. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau."
}
```

---

### 1.6. Quản lý thiết bị đăng nhập (Session Devices)
- **Màn hình UI**: `SettingsModal.tsx` (Tab "Thiết bị").
- **Endpoints**:
  - `GET /api/v1/user/auth/devices`: Lấy danh sách thiết bị/IP/Trình duyệt đang active.
  - `DELETE /api/v1/user/auth/devices/{deviceId}`: Đăng xuất từ xa khỏi một thiết bị.

---

## PHÂN HỆ 2: LỊCH & QUẢN LÝ SỰ KIỆN (CALENDAR & EVENTS)

### 2.1. Lấy danh sách sự kiện theo Tháng / Năm (Get Calendar Events)
- **Màn hình UI**: `MonthGridView.tsx`, `WeekTimelineView.tsx`, `AgendaListView.tsx`.
- **Phương thức & Endpoint**: `GET /api/v1/user/events`
- **Xác thực**: `Bearer Token`.

#### Input (Query Parameters)
| Tham số | Kiểu | Bắt buộc | Ví dụ | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| `year` | integer | Không | `2026` | Năm cần lấy dữ liệu |
| `month` | integer | Không | `9` | Tháng cần lấy (1-12) |
| `type` | string | Không | `event` | Lọc sự kiện thường (`event`) hoặc lịch thói quen (`routine`) |

#### Output (Response Body - 200 OK)
```json
[
  {
    "id": "e1-4567-89ab-cdef",
    "type": "event",
    "title": "Hội thảo Công Nghệ & AI Summit",
    "description": "Tham luận về Clean Architecture và Micro-interactions",
    "locationText": "Trung tâm Hội nghị Quốc gia, Hà Nội",
    "latitude": 21.0069,
    "longitude": 105.7836,
    "startTime": "2026-09-29T14:00:00Z",
    "endTime": "2026-09-29T17:00:00Z",
    "priority": "high",
    "colorTag": "blue",
    "recurrenceRule": null,
    "seriesId": null,
    "travelTime": "25 phút",
    "alertTime": "2026-09-29T13:35:00Z",
    "attendees": ["an.nguyen@routinepulse.com", "partner@corp.vn"],
    "hasMeet": true
  }
]
```
- **UI Sử dụng**: Render các thẻ sự kiện trên từng ô lịch tháng, vạch timeline tuần, và danh sách Agenda; hiển thị icon chỉ đường Google Maps và liên kết Google Meet.

---

### 2.2. Tạo sự kiện mới (Create Event)
- **Màn hình UI**: `CreateEventModal.tsx` (Tab Sự kiện).
- **Phương thức & Endpoint**: `POST /api/v1/user/events`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "title": "Họp Định hướng Quý 4/2026",
  "description": "Đánh giá KPI và kế hoạch mở rộng",
  "locationText": "Tòa nhà Keangnam Landmark 72, Hà Nội",
  "latitude": 21.0173,
  "longitude": 105.7838,
  "startTime": "2026-09-30T09:00:00Z",
  "endTime": "2026-09-30T10:30:00Z",
  "priority": "high",
  "colorTag": "emerald",
  "recurrenceRule": "WEEKLY;BYDAY=MO,WE,FR",
  "attendees": ["teamlead@routinepulse.com"],
  "hasMeet": true
}
```

#### Output (201 Created)
```json
{
  "id": "e2-9876-12cd-ef01",
  "title": "Họp Định hướng Quý 4/2026",
  "seriesId": "series_1759132800000",
  "startTime": "2026-09-30T09:00:00Z",
  "endTime": "2026-09-30T10:30:00Z",
  "generatedInstancesCount": 12,
  "message": "Đã tạo sự kiện và 12 phiên lặp lại trong chuỗi."
}
```
- **UI Sử dụng**: Đóng modal `CreateEventModal`, tự động reload hoặc chèn trực tiếp các item vào mảng `eventsData` trong `AppContext`, kích hoạt Toast xanh.

---

### 2.3. Cập nhật sự kiện (Update Event)
- **Màn hình UI**: `EventDetailModal.tsx` / `CreateEventModal.tsx` (Chế độ Chỉnh sửa).
- **Phương thức & Endpoint**: `PUT /api/v1/user/events/{id}`
- **Xác thực**: `Bearer Token`.

#### Input
- **Path Param**: `id` (GUID / ID sự kiện).
- **Query Param**: `applyToSeries` (boolean, tùy chọn: `true` nếu sửa toàn bộ chuỗi lặp).
- **Request Body**: Tương tự như Create Event.

#### Output (200 OK)
```json
{
  "id": "e2-9876-12cd-ef01",
  "title": "Họp Định hướng Quý 4/2026 (Đã dời giờ)",
  "startTime": "2026-09-30T10:00:00Z",
  "endTime": "2026-09-30T11:30:00Z",
  "message": "Cập nhật sự kiện thành công."
}
```

---

### 2.4. Xóa sự kiện (Delete Event & Series)
- **Màn hình UI**: `EventDetailModal.tsx` và `RecurringActionModal.tsx`.
- **Phương thức & Endpoint**: `DELETE /api/v1/user/events/{id}`
- **Xác thực**: `Bearer Token`.

#### Input
- **Path Param**: `id` (ID của sự kiện).
- **Query Param**: `deleteAllSeries` (`boolean`, mặc định `false`). Nếu chọn "Xóa toàn bộ chuỗi sự kiện này" trong `RecurringActionModal`, gửi `true`.

#### Output (200 OK)
```json
{
  "deletedId": "e2-9876-12cd-ef01",
  "deletedSeries": true,
  "affectedCount": 12,
  "message": "Đã xóa toàn bộ chuỗi 12 sự kiện liên quan."
}
```
- **UI Sử dụng**: Lọc bỏ sự kiện khỏi state `eventsData` và đóng `RecurringActionModal`.

---

### 2.5. Cấu hình Cảnh báo Di chuyển Thông minh (Travel Alert Estimate)
- **Màn hình UI**: Checkbox & Input "Cảnh báo thời gian di chuyển" trong `CreateEventModal.tsx`.
- **Phương thức & Endpoint**: `POST /api/v1/user/events/{id}/travel-alert`
- **Xác thực**: `Bearer Token` (Tính năng PRO/VIP).

#### Input (Request Body)
```json
{
  "alertMinutesBefore": 25,
  "originLatitude": 21.0285,
  "originLongitude": 105.8542
}
```

#### Output (200 OK)
```json
{
  "eventId": "e1-4567-89ab-cdef",
  "travelEstimate": "25 phút",
  "departureTime": "2026-09-29T13:35:00Z",
  "distanceKm": 8.4,
  "message": "Đã kích hoạt cảnh báo di chuyển lúc 13:35 PM."
}
```
- **UI Sử dụng**: Hiển thị nhãn huy hiệu xe hơi/di chuyển trên card sự kiện: `alertTime: '13:35 PM' • Đi mất ~25 phút`.

---

## PHÂN HỆ 3: QUẢN LÝ THÓI QUEN & ĐIỂM DANH CHUỖI (ROUTINES & STREAK HABITS)

### 3.1. Lấy danh sách thói quen (Get Routines List)
- **Màn hình UI**: `NotesRoutineSidebarPanel.tsx` (Tab Thói quen), `ProductivityKPI.tsx`.
- **Phương thức & Endpoint**: `GET /api/v1/user/routines`
- **Xác thực**: `Bearer Token`.

#### Output (200 OK)
```json
[
  {
    "id": "r1-1234-abcd",
    "title": "Chạy bộ 30 phút buổi sáng",
    "frequencyType": 0,
    "frequencyText": "Hàng ngày",
    "targetTime": "06:30 AM",
    "streakCount": 14,
    "maxStreak": 21,
    "isActive": true,
    "completedToday": false,
    "subroutines": [
      { "id": 1, "title": "Uống 300ml nước ấm sau khi thức dậy", "completed": true },
      { "id": 2, "title": "Khởi động khớp gối & cổ chân 5 phút", "completed": true },
      { "id": 3, "title": "Chạy 3.5km với nhịp pace 6:15", "completed": false }
    ]
  }
]
```
- **UI Sử dụng**: Render thanh đo tiến độ Streak kèm ngọn lửa (`Flame`), danh sách các bước con (Subroutines Checklist) có thể tương tác trực tiếp.

---

### 3.2. Tạo thói quen mới kèm Subroutines (Create Routine)
- **Màn hình UI**: Bộ soạn thảo nhanh Quick Composer trong `NotesRoutineSidebarPanel.tsx` và `CreateEventModal.tsx`.
- **Phương thức & Endpoint**: `POST /api/v1/user/routines`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "title": "Tập Gym chu kỳ interval",
  "frequencyType": 2,
  "frequencyValue": "INTERVAL_3_DAYS",
  "targetTime": "07:30 AM",
  "subroutines": [
    "Khởi động khớp & làm nóng 5 phút",
    "4 set Squats (8-10 reps)",
    "3 set Bench Press",
    "Căng cơ hạ nhiệt 5 phút"
  ]
}
```

#### Output (201 Created)
```json
{
  "id": "r2-5678-efgh",
  "title": "Tập Gym chu kỳ interval",
  "streakCount": 0,
  "maxStreak": 0,
  "subroutines": [
    { "id": 101, "title": "Khởi động khớp & làm nóng 5 phút", "completed": false },
    { "id": 102, "title": "4 set Squats (8-10 reps)", "completed": false },
    { "id": 103, "title": "3 set Bench Press", "completed": false },
    { "id": 104, "title": "Căng cơ hạ nhiệt 5 phút", "completed": false }
  ]
}
```

---

### 3.3. Điểm danh / Check-in hoàn thành thói quen (Check-in Routine)
- **Màn hình UI**: Nút Check tròn bên cạnh thói quen hoặc trong Drawer chi tiết ngày `DayInspectorDrawer.tsx`.
- **Phương thức & Endpoint**: `POST /api/v1/user/routines/{id}/checkin`
- **Xác thực**: `Bearer Token`.

#### Input
- **Path Param**: `id` (ID thói quen).
- **Request Body** (tùy chọn):
```json
{
  "date": "2026-09-29"
}
```

#### Output (200 OK)
```json
{
  "id": "r1-1234-abcd",
  "title": "Chạy bộ 30 phút buổi sáng",
  "streakCount": 15,
  "maxStreak": 21,
  "completed": true,
  "message": "Điểm danh thành công! Chuỗi streak hiện tại: 15 ngày 🔥"
}
```
- **UI Sử dụng**: Kích hoạt hiệu ứng âm thanh và hiệu ứng animation vinh danh Streak tăng lên 1; đồng thời tự động đánh dấu tick toàn bộ các Subroutines bên dưới.

---

### 3.4. Quản lý Checklist nhiệm vụ con của Routine (Subroutine Items)
- **Màn hình UI**: Danh sách accordion bung nở bên dưới mỗi thói quen.
- **Endpoints**:
  - `POST /api/v1/user/routines/{routineId}/subroutines`: Thêm 1 bước nhỏ (Input: `{ "title": "Giãn cơ 5 phút" }`).
  - `PATCH /api/v1/user/routines/{routineId}/subroutines/{subId}/toggle`: Toggle trạng thái checkbox của bước con.
  - `DELETE /api/v1/user/routines/{routineId}/subroutines/{subId}`: Xóa bước con.

---

### 3.5. Kho Thói quen Mẫu (Routine Templates)
- **Màn hình UI**: Gợi ý tạo nhanh Routine.
- **Phương thức & Endpoint**: `GET /api/v1/user/routines/templates`
- **Output (200 OK)**:
```json
[
  {
    "category": "Sức khỏe & Thể chất",
    "templates": [
      {
        "title": "Uống đủ 2L nước mỗi ngày",
        "frequency": "Hàng ngày",
        "subroutines": ["500ml buổi sáng", "500ml buổi trưa", "500ml chiều", "500ml tối"]
      }
    ]
  }
]
```

---

## PHÂN HỆ 4: QUẢN LÝ CÔNG VIỆC & PHÂN RÃ AI (TASKS & SUBTASKS)

### 4.1. Lấy danh sách công việc (Get Tasks List)
- **Màn hình UI**: Cột tiện ích `RightSidebar.tsx` (Tab Tasks).
- **Phương thức & Endpoint**: `GET /api/v1/user/tasks`
- **Xác thực**: `Bearer Token`.

#### Output (200 OK)
```json
[
  {
    "id": "t1-89ab-cdef",
    "title": "Nộp báo cáo Đồ án tốt nghiệp",
    "description": "Báo cáo cuối kỳ",
    "priority": 2,
    "priorityLabel": "high",
    "status": 0,
    "completed": false,
    "dueDate": "2026-09-29T17:00:00Z",
    "reminders": "Push App • SMS • Email",
    "subTasks": [
      { "id": "st-1", "title": "Khảo sát yêu cầu & đặc tả bài toán", "status": 1, "completed": true },
      { "id": "st-2", "title": "Viết tài liệu mô tả chức năng", "status": 1, "completed": true },
      { "id": "st-3", "title": "Hoàn thiện báo cáo PDF cuối cùng", "status": 0, "completed": false }
    ]
  }
]
```
- **UI Sử dụng**: Render danh sách Task kèm hạn chót (Badge giờ đỏ nếu sắp trễ hạn), thanh tiến độ subtasks (vd: `2/3 hoàn thành`).

---

### 4.2. Tạo công việc mới (Create Task)
- **Màn hình UI**: Ô nhập liệu nhanh dưới chân cột `RightSidebar.tsx` hoặc nút `+` góc trên.
- **Phương thức & Endpoint**: `POST /api/v1/user/tasks`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "title": "Chuẩn bị bài thuyết trình Keynote",
  "description": "Chuẩn bị demo live",
  "priority": 1,
  "dueDate": "2026-09-30T09:00:00Z",
  "reminders": "Push App"
}
```

#### Ràng buộc nghiệp vụ gói cước (Free Tier Limitation)
Nếu tài khoản là `FREE_USER` và đã có quá **10 công việc chưa hoàn thành**, API trả về mã lỗi `403 Forbidden`:
```json
{
  "errorCode": "UPGRADE_REQUIRED",
  "message": "Tài khoản Miễn phí chỉ được tạo tối đa 10 công việc chưa hoàn thành. Vui lòng nâng cấp lên gói PRO để không giới hạn!",
  "requiredTier": "PRO"
}
```
- **UI Sử dụng**: Frontend nhận mã `UPGRADE_REQUIRED` sẽ kích hoạt mở `LimitModal.tsx` hoặc `CheckoutModal.tsx` để điều hướng người dùng nâng cấp.

---

### 4.3. Đổi trạng thái hoàn thành Task (Toggle Task Status)
- **Màn hình UI**: Nút checkbox vuông trước tiêu đề task `TaskItem.tsx`.
- **Phương thức & Endpoint**: `PATCH /api/v1/user/tasks/{id}/toggle`
- **Xác thực**: `Bearer Token`.
- **Output (200 OK)**:
```json
{
  "id": "t1-89ab-cdef",
  "status": 1,
  "completed": true,
  "message": "Đã hoàn thành công việc!"
}
```
- **UI Sử dụng**: Gạch ngang chữ (strikethrough), mờ dần opacity, di chuyển công việc xuống nhóm Đã hoàn tất.

---

### 4.4. Quản lý Subtasks của Task
- **Màn hình UI**: Thành phần `SubtaskList.tsx` mở rộng bên dưới từng Task.
- **Endpoints**:
  - `POST /api/v1/user/tasks/{taskId}/subtasks`: Thêm subtask (Input: `{ "title": "Thiết kế slide 15 trang" }`).
  - `PATCH /api/v1/user/tasks/{taskId}/subtasks/{subId}/toggle`: Check/uncheck subtask.
  - `DELETE /api/v1/user/tasks/{taskId}/subtasks/{subId}`: Xóa subtask.

---

### 4.5. Phân rã mục tiêu bằng Trợ lý AI (AI Task Breakdown Suggestion)
- **Màn hình UI**: Nút bấm biểu tượng lấp lánh `Sparkles` "Gợi ý AI" trong modal tạo task.
- **Phương thức & Endpoint**: `POST /api/v1/user/tasks/ai-suggest`
- **Xác thực**: `Bearer Token` (Tính năng PRO/VIP).

#### Input (Request Body)
```json
{
  "goal": "Tổ chức sự kiện ra mắt sản phẩm công nghệ trong 2 tuần"
}
```

#### Output (200 OK)
```json
{
  "goal": "Tổ chức sự kiện ra mắt sản phẩm công nghệ trong 2 tuần",
  "suggestedTasks": [
    { "title": "Chốt danh sách 50 khách mời VIP & Diễn giả", "priority": 2 },
    { "title": "Thuê hội trường & setup backdrop sân khấu", "priority": 2 },
    { "title": "Kiểm thử live demo sản phẩm trên sân khấu", "priority": 1 },
    { "title": "Gửi email thiệp mời và xác nhận tham dự", "priority": 0 }
  ],
  "message": "AI đã phân rã thành công 4 bước thực hiện."
}
```
- **UI Sử dụng**: Hiển thị bảng chọn nhanh, cho phép người dùng click "Áp dụng tất cả" để tự động chèn vào danh sách subtasks.

---

## PHÂN HỆ 5: GHI CHÚ NHANH THẺ MÀU (KEEP NOTES)

### 5.1. Lấy danh sách ghi chú (Get Notes)
- **Màn hình UI**: `NotesRoutineSidebarPanel.tsx` (Tab Ghi chú).
- **Phương thức & Endpoint**: `GET /api/v1/user/notes`
- **Xác thực**: `Bearer Token`.

#### Output (200 OK)
```json
[
  {
    "id": "note-1",
    "title": "Kỷ luật & Thói quen cốt lõi",
    "content": "Nguyên tắc bất di bất dịch:\n• Ngủ trước 23:00\n• Review tiến độ qua checklist",
    "color": "amber",
    "isPinned": true,
    "tags": ["KỷLuật", "Mindset"],
    "checklist": [
      { "id": "c1", "text": "Ngủ trước 23:00, không màn hình xanh sau 22:30", "completed": true },
      { "id": "c2", "text": "Review tiến độ qua checklist mỗi 17:30", "completed": false }
    ],
    "updatedAt": "2026-09-29T08:30:00Z"
  }
]
```
- **UI Sử dụng**: Render thành 2 khu vực: "ĐÃ GHIM" (Pinned) và "GHI CHÚ KHÁC" (Other) với màu nền linh hoạt (Hổ phách amber, Xanh dương blue, Xanh ngọc lá green, Tím purple).

---

### 5.2. Tạo ghi chú mới (Create Note)
- **Màn hình UI**: Ô soạn thảo nhanh (Quick Note Composer) trong `NotesRoutineSidebarPanel.tsx`.
- **Phương thức & Endpoint**: `POST /api/v1/user/notes`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "title": "Ý tưởng tính năng Sync Cloud",
  "content": "Dùng WebSocket đồng bộ realtime 2 chiều",
  "color": "blue",
  "isPinned": false,
  "tags": ["ÝTưởng", "Tech"]
}
```

#### Output (201 Created)
```json
{
  "id": "note-1759132900000",
  "title": "Ý tưởng tính năng Sync Cloud",
  "content": "Dùng WebSocket đồng bộ realtime 2 chiều",
  "color": "blue",
  "isPinned": false,
  "tags": ["ÝTưởng", "Tech"],
  "checklist": [],
  "updatedAt": "2026-09-29T09:00:00Z"
}
```

---

### 5.3. Ghim / Bỏ ghim ghi chú (Toggle Pin Note)
- **Màn hình UI**: Nút biểu tượng đinh ghim `Pin` góc phải thẻ ghi chú.
- **Phương thức & Endpoint**: `PATCH /api/v1/user/notes/{id}/pin`
- **Xác thực**: `Bearer Token`.
- **Output (200 OK)**:
```json
{
  "id": "note-1",
  "isPinned": true,
  "message": "Đã ghim ghi chú lên đầu danh sách."
}
```

---

### 5.4. Xóa ghi chú (Delete Note)
- **Phương thức & Endpoint**: `DELETE /api/v1/user/notes/{id}`
- **Xác thực**: `Bearer Token`.
- **Output (200 OK)**:
```json
{
  "message": "Ghi chú đã được xóa thành công."
}
```

---

## PHÂN HỆ 6: LỊCH HẸN & KHUNG GIỜ LÀM VIỆC (APPOINTMENT SCHEDULING & AVAILABILITY)

### 6.1. Lấy cấu hình khung giờ rảnh hàng tuần (Get Availability Slots)
- **Màn hình UI**: `AppointmentScheduleModal.tsx`.
- **Phương thức & Endpoint**: `GET /api/v1/user/appointments/availability`
- **Xác thực**: `Bearer Token`.

#### Output (200 OK)
```json
{
  "timezone": "GMT+07:00",
  "bookingSlug": "an-nguyen-calendar",
  "defaultDurationMinutes": 60,
  "slots": [
    { "dayIndex": 0, "dayNameVi": "Chủ Nhật", "isAvailable": false, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 1, "dayNameVi": "Thứ 2", "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 2, "dayNameVi": "Thứ 3", "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 3, "dayNameVi": "Thứ 4", "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 4, "dayNameVi": "Thứ 5", "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 5, "dayNameVi": "Thứ 6", "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 6, "dayNameVi": "Thứ 7", "isAvailable": false, "startTime": "09:00 AM", "endTime": "05:00 PM" }
  ]
}
```
- **UI Sử dụng**: Render công tắc toggle Bật/Tắt từng ngày và dropdown chọn khung giờ làm việc; hỗ trợ nút "Sao chép Thứ 2 cho cả tuần".

---

### 6.2. Cập nhật khung giờ làm việc (Save Availability Configuration)
- **Màn hình UI**: Nút "Lưu lịch biểu" trong `AppointmentScheduleModal.tsx`.
- **Phương thức & Endpoint**: `PUT /api/v1/user/appointments/availability`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "timezone": "GMT+07:00",
  "defaultDurationMinutes": 60,
  "slots": [
    { "dayIndex": 1, "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 2, "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 3, "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 4, "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" },
    { "dayIndex": 5, "isAvailable": true, "startTime": "09:00 AM", "endTime": "05:00 PM" }
  ]
}
```

#### Output (200 OK)
```json
{
  "message": "Đã lưu lịch biểu khung giờ rảnh thành công.",
  "publicBookingUrl": "https://routinepulse.com/book/an-nguyen-calendar"
}
```
- **UI Sử dụng**: Cập nhật URL chia sẻ link đặt hẹn và copy vào clipboard.

---

### 6.3. Lấy danh sách cuộc hẹn đã đặt (Get Bookings)
- **Phương thức & Endpoint**: `GET /api/v1/user/appointments/bookings`
- **Xác thực**: `Bearer Token`.
- **Output (200 OK)**:
```json
[
  {
    "id": "book-1",
    "clientName": "Trần Thị Mai",
    "clientEmail": "mai.tran@client.com",
    "meetingTime": "2026-10-02T10:00:00Z",
    "durationMinutes": 60,
    "topic": "Tư vấn Thiết kế UI/UX & Code Review",
    "status": "CONFIRMED",
    "meetUrl": "https://meet.google.com/xyz-abcd-efg"
  }
]
```

---

## PHÂN HỆ 7: GÓI DỊCH VỤ, MÃ GIẢM GIÁ & THANH TOÁN (SUBSCRIPTIONS & CHECKOUT)

### 7.1. Lấy danh mục các gói cước (Get Subscription Plans)
- **Màn hình UI**: `CheckoutModal.tsx`, `FlashSaleBanner.tsx`, `SettingsModal.tsx` (Tab Thanh toán).
- **Phương thức & Endpoint**: `GET /api/v1/user/subscriptions/plans`
- **Xác thực**: Public hoặc Bearer Token.

#### Output (200 OK)
```json
[
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "Gói Miễn Phí (Free)",
    "durationMonths": 12,
    "originalPrice": 0,
    "featuresJson": "[\"Tối đa 10 tasks\", \"Lịch cơ bản\", \"1 Routine hàng ngày\"]",
    "isPopular": false,
    "isActive": true
  },
  {
    "id": "00000000-0000-0000-0000-000000000002",
    "name": "Gói Chuyên Nghiệp (Pro)",
    "durationMonths": 1,
    "originalPrice": 59000,
    "featuresJson": "[\"Không giới hạn Tasks\", \"Nhắc nhở di chuyển Travel Time\", \"Routine chu kỳ nâng cao\", \"Trọn bộ Giao diện VIP\"]",
    "isPopular": true,
    "isActive": true
  },
  {
    "id": "00000000-0000-0000-0000-000000000003",
    "name": "Gói Trọn Đời VIP (Lifetime VIP)",
    "durationMonths": 120,
    "originalPrice": 499000,
    "featuresJson": "[\"Mở khóa toàn bộ tính năng\", \"Hỗ trợ ưu tiên 24/7\", \"AI Assistant Unlimited\", \"Đồng bộ Cloud đa nền tảng vĩnh viễn\"]",
    "isPopular": false,
    "isActive": true
  }
]
```

---

### 7.2. Tra cứu gói cước hiện tại của tôi (My Subscription)
- **Màn hình UI**: `UserProfileDropdown.tsx`, `SettingsModal.tsx`.
- **Phương thức & Endpoint**: `GET /api/v1/user/subscriptions/my-subscription`
- **Xác thực**: `Bearer Token`.

#### Output (200 OK)
```json
{
  "tier": "VIP",
  "isPremium": true,
  "planName": "Gói Trọn Đời VIP (1 Năm)",
  "status": "ACTIVE",
  "startDate": "2026-09-29T00:00:00Z",
  "endDate": "2027-09-29T00:00:00Z",
  "features": [
    "UNLIMITED_TASKS",
    "UNLIMITED_ROUTINES",
    "TRAVEL_ALERT",
    "AI_ASSISTANT",
    "CUSTOM_THEMES"
  ]
}
```

---

### 7.3. Áp dụng mã giảm giá Coupon (Apply Coupon)
- **Màn hình UI**: Nút "Áp dụng" mã voucher trong `CheckoutModal.tsx`.
- **Phương thức & Endpoint**: `POST /api/v1/user/subscriptions/apply-coupon`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "code": "VIP50",
  "amount": 179000
}
```

#### Output (200 OK)
```json
{
  "code": "VIP50",
  "discountValue": 89500,
  "finalAmount": 89500,
  "message": "Áp dụng mã ưu đãi [VIP50] thành công: Giảm 50%!"
}
```
- **Xử lý mã lỗi**: Nếu mã hết hạn hoặc không tồn tại, trả về `404 Not Found` kèm `{ "message": "Mã giảm giá không tồn tại hoặc đã hết hạn." }`.

---

### 7.4. Tạo yêu cầu nâng cấp gói & Thanh toán (Upgrade Subscription)
- **Màn hình UI**: Nút "Xác nhận Thanh toán & Kích hoạt" trong `CheckoutModal.tsx`.
- **Phương thức & Endpoint**: `POST /api/v1/user/subscriptions/upgrade`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "planId": "00000000-0000-0000-0000-000000000003",
  "couponCode": "VIP50",
  "gateway": 1
}
```
*(Ghi chú `gateway`: `0` = Manual/Free, `1` = VNPay, `2` = VietQR, `3` = MoMo, `4` = Stripe).*

#### Output (200 OK)
```json
{
  "orderId": "ORD_20260929_8941",
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "qrCodeData": "00020101021238580010A000000727...",
  "finalAmount": 89500,
  "message": "Tạo giao dịch thành công. Vui lòng quét mã QR để hoàn tất thanh toán."
}
```
- **UI Sử dụng**: Mở trang thanh toán của ngân hàng hoặc hiển thị QR VietQR trực tiếp trên modal; sau khi hoàn tất sẽ nâng `role` thành `PREMIUM_USER` và `tier` thành `VIP`.

---

## PHÂN HỆ 8: CẤU HÌNH GIAO DIỆN & TÙY CHỌN HỆ THỐNG (PREFERENCES & SETTINGS)

### 8.1. Lấy tùy chọn cá nhân của người dùng (Get User Preferences)
- **Màn hình UI**: `SettingsModal.tsx` (Tab Giao diện, Tab Ngôn ngữ, Tab Thông báo).
- **Phương thức & Endpoint**: `GET /api/v1/user/settings`
- **Xác thực**: `Bearer Token`.

#### Output (200 OK)
```json
{
  "theme": "default",
  "language": "vi",
  "calendarViewDefault": "month",
  "enableSound": true,
  "notifications": {
    "pushApp": true,
    "emailDigest": false,
    "smsEmergency": false
  }
}
```

---

### 8.2. Lưu tùy chọn giao diện & ngôn ngữ (Update User Preferences)
- **Màn hình UI**: Đổi theme (`default`, `dark`, `tet`, `christmas`, `sakura`) hoặc đổi cờ Ngôn ngữ (`vi`/`en`) trên TopHeader.
- **Phương thức & Endpoint**: `PUT /api/v1/user/settings`
- **Xác thực**: `Bearer Token`.

#### Input (Request Body)
```json
{
  "theme": "tet",
  "language": "vi",
  "notifications": {
    "pushApp": true,
    "emailDigest": true
  }
}
```

#### Output (200 OK)
```json
{
  "message": "Đã lưu cài đặt cá nhân thành công."
}
```

---

## 10. BẢNG TỔNG HỢP KHỚP NỐI API FRONTEND VS BACKEND (APP_BACKEND)

Dưới đây là bảng đối chiếu chi tiết giữa nhu cầu thực tế của [Frontend_Usersite_Web](file:///e:/SideProject/Frontend_Usersite_Web) và mã nguồn hiện hữu tại [App_Backend](file:///e:/SideProject/App_Backend):

| Tên Endpoint | Method | Trạng thái ở Backend `App_Backend` | Ghi chú & Đề xuất Nâng cấp |
| :--- | :---: | :---: | :--- |
| `/api/v1/user/auth/register` | `POST` | **Đã có** (`UserAuthController`) | Hoạt động tốt |
| `/api/v1/user/auth/login` | `POST` | **Đã có** (`UserAuthController`) | Hoạt động tốt |
| `/api/v1/user/auth/me` | `GET` | **Đã có** (`UserAuthController`) | Hoạt động tốt |
| `/api/v1/user/auth/profile` | `PUT` | **Chưa có** | Cần thêm Action cập nhật Họ tên, SĐT trong `UserAuthController` |
| `/api/v1/user/auth/change-password`| `PUT` | **Chưa có** | Cần thêm Action đổi mật khẩu (xác thực `PasswordHasher`) |
| `/api/v1/user/events` | `GET` | **Đã có** (`UserEventsController`) | Đã có lọc theo `year`, `month` |
| `/api/v1/user/events` | `POST` | **Đã có** (`UserEventsController`) | Cần hỗ trợ trả về `seriesId` cho chuỗi lặp |
| `/api/v1/user/events/{id}` | `PUT` | **Đã có** (`UserEventsController`) | Cần thêm cờ `applyToSeries` |
| `/api/v1/user/events/{id}` | `DELETE` | **Đã có** (`UserEventsController`) | Cần bổ sung xử lý xóa toàn bộ chuỗi lặp `deleteAllSeries` |
| `/api/v1/user/events/{id}/travel-alert` | `POST` | **Đã có** (`UserEventsController`) | Đã có tính toán cơ bản |
| `/api/v1/user/routines` | `GET` | **Đã có** (`UserRoutinesController`) | Cần bổ sung Include danh sách `Subroutines` |
| `/api/v1/user/routines` | `POST` | **Đã có** (`UserRoutinesController`) | Cần bổ sung nhận mảng chuỗi `subroutines` khi tạo |
| `/api/v1/user/routines/{id}/checkin` | `POST` | **Đã có** (`UserRoutinesController`) | Đã có tính toán streak |
| `/api/v1/user/routines/{rId}/subroutines/{sId}/toggle` | `PATCH` | **Chưa có** | Cần thêm bảng `UserSubroutine` để lưu từng mục check |
| `/api/v1/user/tasks` | `GET` | **Đã có** (`UserTasksController`) | Đã có Include `SubTasks` |
| `/api/v1/user/tasks` | `POST` | **Đã có** (`UserTasksController`) | Đã có chặn giới hạn 10 task với `FREE_USER` |
| `/api/v1/user/tasks/{id}/toggle` | `PATCH` | **Đã có** (`UserTasksController`) | Đã có |
| `/api/v1/user/tasks/ai-suggest` | `POST` | **Đã có** (`UserTasksController`) | Đã có Mock phân rã bằng AI |
| `/api/v1/user/notes` | CRUD | **Chưa có** | Cần tạo mới `UserNotesController.cs` & Entity `UserNote` |
| `/api/v1/user/appointments/availability` | `GET`/`PUT` | **Chưa có** | Cần tạo mới `UserAppointmentsController.cs` |
| `/api/v1/user/subscriptions/plans` | `GET` | **Đã có** (`UserSubscriptionsController`) | Đã có kèm dữ liệu mẫu tự sinh |
| `/api/v1/user/subscriptions/apply-coupon` | `POST` | **Đã có** (`UserSubscriptionsController`) | Đã có kiểm tra hạn sử dụng Coupon |
| `/api/v1/user/subscriptions/upgrade` | `POST` | **Đã có** (`UserSubscriptionsController`) | Đã có chuyển đổi Tier và cấp quyền |
| `/api/v1/user/subscriptions/my-subscription` | `GET` | **Đã có** (`UserSubscriptionsController`) | Đã có |
| `/api/v1/user/settings` | `GET`/`PUT` | **Chưa có** | Cần tạo mới để đồng bộ Theme VIP và Ngôn ngữ lên server |

---
*Tài liệu được xuất bản nhằm phục vụ việc hoàn thiện API Backend và liên kết mã nguồn Frontend User Site chuẩn xác.*
