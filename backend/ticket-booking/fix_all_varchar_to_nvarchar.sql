-- =========================================================================
-- SCRIPT CHUYỂN ĐỔI TOÀN BỘ CÁC CỘT CHUỖI SANG NVARCHAR (UNICODE - TIẾNG VIỆT)
-- CHẠY TRONG SQL SERVER MANAGEMENT STUDIO (SSMS) CHO DB: ticket_booking_db
-- MỤC ĐÍCH: Khắc phục lỗi "conversion from varchar to NCHAR is unsupported"
-- TRẠNG THÁI: Tự động chạy và sửa chữa 100% các cột entity trong Spring Boot.
-- =========================================================================

USE ticket_booking_db;
GO

-- 1. Bảng: nguoi_dung (User)
ALTER TABLE nguoi_dung ALTER COLUMN full_name NVARCHAR(255);
ALTER TABLE nguoi_dung ALTER COLUMN email NVARCHAR(255);
ALTER TABLE nguoi_dung ALTER COLUMN password NVARCHAR(255);
ALTER TABLE nguoi_dung ALTER COLUMN phone NVARCHAR(255);
ALTER TABLE nguoi_dung ALTER COLUMN role NVARCHAR(255);

-- 2. Bảng: dat_ve (Booking)
ALTER TABLE dat_ve ALTER COLUMN status NVARCHAR(255);

-- 3. Bảng: thanh_toan (Payment)
ALTER TABLE thanh_toan ALTER COLUMN payment_method NVARCHAR(255);
ALTER TABLE thanh_toan ALTER COLUMN payment_status NVARCHAR(255);

-- 4. Bảng: danh_gia (Review)
ALTER TABLE danh_gia ALTER COLUMN comment NVARCHAR(1000);

-- 5. Bảng: hoan_tien (Refund)
ALTER TABLE hoan_tien ALTER COLUMN status NVARCHAR(255);

-- 6. Bảng: khuyen_mai (Promotion)
ALTER TABLE khuyen_mai ALTER COLUMN level_name NVARCHAR(255);

-- 7. Bảng: dich_vu_bo_sung (AdditionalService)
ALTER TABLE dich_vu_bo_sung ALTER COLUMN service_name NVARCHAR(255);

-- 8. Bảng: nha_cung_cap (Provider)
ALTER TABLE nha_cung_cap ALTER COLUMN provider_name NVARCHAR(255) NOT NULL;
ALTER TABLE nha_cung_cap ALTER COLUMN provider_type NVARCHAR(255);
ALTER TABLE nha_cung_cap ALTER COLUMN contact_info NVARCHAR(255);

-- 9. Bảng: phuong_tien (Vehicle)
ALTER TABLE phuong_tien ALTER COLUMN vehicle_type NVARCHAR(255);

-- 10. Bảng: tuyen_duong (Route)
ALTER TABLE tuyen_duong ALTER COLUMN origin NVARCHAR(255) NOT NULL;
ALTER TABLE tuyen_duong ALTER COLUMN destination NVARCHAR(255) NOT NULL;

-- 11. Bảng: chuyen_di (Trip)
ALTER TABLE chuyen_di ALTER COLUMN status NVARCHAR(255);

-- 12. Bảng: ghe_ngoi (Seat)
ALTER TABLE ghe_ngoi ALTER COLUMN seat_number NVARCHAR(255);
ALTER TABLE ghe_ngoi ALTER COLUMN seat_type NVARCHAR(255);

GO

PRINT N'Hoàn tất quá trình cập nhật toàn bộ cột sang NVARCHAR thành công!'
PRINT N'Bây giờ bạn có thể khởi động lại Backend Spring Boot (npm run start:all).'
GO
