# Hệ Thống Đặt Vé Đa Phương Tiện (Flight, Train, Bus Booking System)

Dự án đồ án tốt nghiệp cung cấp giải pháp đặt vé toàn diện cho máy bay, tàu hỏa và xe khách, tích hợp quản lý doanh thu cho nhà cung cấp và quản trị viên.

## 🚀 Tổng Quan Dự Án
Hệ thống được xây dựng trên kiến trúc Client-Server hiện đại, tách biệt hoàn toàn Frontend (React) và Backend (Spring Boot), đảm bảo tính mở rộng và bảo mật.

### 🛠 Công Nghệ Sử Dụng
- **Backend:** Java Spring Boot, Spring Security (JWT), Hibernate/JPA.
- **Frontend:** React JS (Vite), Tailwind CSS/Vanilla CSS, Recharts (Dashboard).
- **Database:** MS SQL Server.
- **Xác thực:** JWT + Google OAuth2.
- **Thanh toán:** Tích hợp VNPay (Sandbox).

---

## 📂 Cấu Trúc Thư Mục
Dự án được chia thành 2 module chính:

### 1. `/backend/ticket-booking`
Chứa toàn bộ mã nguồn xử lý logic nghiệp vụ, API và kết nối cơ sở dữ liệu.
- `src/main/java/com/booking/api/controller`: Quản lý các điểm cuối API.
- `src/main/java/com/booking/api/entity`: Định nghĩa cấu trúc dữ liệu (Booking, Trip, Refund, v.v.).
- `src/main/java/com/booking/api/security`: Cấu hình bảo mật và JWT.

### 2. `/my-react-app`
Chứa mã nguồn giao diện người dùng và bảng điều khiển quản trị.
- `src/components`: Các thành phần giao diện dùng chung.
- `src/pages`: Giao diện chính (Flight, Train, Bus, Dashboard).
- `src/context`: Quản lý trạng thái ứng dụng (Theme, Auth).

---

## ✨ Tính Năng Chính
- **Người dùng:** Tìm kiếm chuyến đi, đặt vé, chọn chỗ ngồi, thanh toán online, quản lý lịch sử đặt vé và yêu cầu hoàn tiền.
- **Nhà cung cấp (Provider):** Quản lý chuyến đi, theo dõi doanh thu qua biểu đồ trực quan.
- **Quản trị viên (Admin):** Quản lý người dùng, duyệt yêu cầu hoàn tiền, thống kê toàn hệ thống.

---

## 🛠 Hướng Dẫn Chạy Dự Án
Để khởi chạy nhanh toàn bộ hệ thống:
1. Chạy file `run_all.bat` ở thư mục gốc.
2. Frontend sẽ chạy tại: `http://localhost:5173`
3. Backend sẽ chạy tại: `http://localhost:8080`

---

---

## 🛠 Giải Quyết Lỗi Thường Gặp (Troubleshooting)
Để giảm thiểu việc AI phải quét lại toàn bộ mã nguồn, vui lòng kiểm tra các lỗi sau trước:

### 1. Lỗi kết nối Cơ sở dữ liệu (`failed for user 'sa'`)
- **Nguyên nhân:** Tài khoản `sa` sai mật khẩu hoặc chưa bật "SQL Server Authentication".
- **Cách sửa:** 
    1. Kiểm tra file `application.yml` xem mật khẩu có khớp với SQL Server của bạn không.
    2. Đảm bảo SQL Server đang chạy (Port 1433).
    3. Kiểm tra xem Database `ticket_booking_db` đã được tạo chưa.

### 2. Trang không load dữ liệu (Lịch sử đặt vé, Chuyến đi, v.v.)
- **Nguyên nhân:** Backend bị crash hoặc mất kết nối DB giữa chừng.
- **Cách kiểm tra:** Mở terminal chạy backend và xem có lỗi `HikariPool - Connection is not available` không.
- **Giải pháp:** Khởi động lại Backend hoặc kiểm tra log tại `target/spring.log` (nếu có).

### 3. Lỗi Token/Auth
- **Nguyên nhân:** Token JWT hết hạn hoặc secret key bị thay đổi.
- **Cách sửa:** Đăng xuất và đăng nhập lại.

---

## 🎯 Lộ Trình Phát Triển (Graduation Thesis Roadmap)

Các tính năng nâng cao đang và sẽ được triển khai để hoàn thiện đồ án:
1. **Dockerization:** Đóng gói ứng dụng vào Docker Container (`docker-compose.yml`).
2. **AI Chatbot:** Hỗ trợ người dùng tìm kiếm chuyến đi bằng ngôn ngữ tự nhiên.
3. **Mobile App (PWA/Capacitor):** Chuyển đổi giao diện Web thành ứng dụng Android tiện lợi.
4. **CI/CD:** Tự động hóa quy trình build và deploy.

---
*Ghi chú cho AI Assistant (Vibe/Cursor/Antigravity): Hãy ưu tiên đọc file này để nắm bắt cấu trúc toàn bộ dự án trước khi đi sâu vào các file code cụ thể.*