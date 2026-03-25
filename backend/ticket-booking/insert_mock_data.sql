USE ticket_booking_db;
GO

ALTER TABLE tuyen_duong ALTER COLUMN origin NVARCHAR(255) NOT NULL;
ALTER TABLE tuyen_duong ALTER COLUMN destination NVARCHAR(255) NOT NULL;
ALTER TABLE nha_cung_cap ALTER COLUMN provider_name NVARCHAR(255) NOT NULL;
ALTER TABLE nha_cung_cap ALTER COLUMN contact_info NVARCHAR(255);
ALTER TABLE phuong_tien ALTER COLUMN vehicle_type NVARCHAR(255);
GO

INSERT INTO tuyen_duong (origin, destination) VALUES 
(N'Hà Nội', N'Hải Phòng'), (N'Hải Phòng', N'Hà Nội'),
(N'Hà Nội', N'Sapa'), (N'Sapa', N'Hà Nội'),
(N'Hồ Chí Minh', N'Nha Trang'), (N'Nha Trang', N'Hồ Chí Minh'),
(N'Hồ Chí Minh', N'Đà Lạt'), (N'Đà Lạt', N'Hồ Chí Minh'),
(N'Hồ Chí Minh', N'Đà Nẵng'), (N'Đà Nẵng', N'Hồ Chí Minh')
GO

INSERT INTO nha_cung_cap (provider_name, provider_type, contact_info) VALUES
(N'Phương Trang (FUTA)', 'BUS', N'19006067'),
(N'Thành Bưởi', 'BUS', N'19006079'),
(N'Hải Vân', 'BUS', N'19006763'),
(N'Đường Sắt VN (VNR)', 'TRAIN', N'19006469'),
(N'Vietnam Airlines', 'AIRLINE', N'19001100'),
(N'Vietjet Air', 'AIRLINE', N'19001886'),
(N'Bamboo Airways', 'AIRLINE', N'19001166')
GO

DECLARE @futaId BIGINT = (SELECT TOP 1 provider_id FROM nha_cung_cap WHERE provider_name = N'Phương Trang (FUTA)');
DECLARE @tbId BIGINT = (SELECT TOP 1 provider_id FROM nha_cung_cap WHERE provider_name = N'Thành Bưởi');
DECLARE @vnrId BIGINT = (SELECT TOP 1 provider_id FROM nha_cung_cap WHERE provider_name = N'Đường Sắt VN (VNR)');
DECLARE @vnaId BIGINT = (SELECT TOP 1 provider_id FROM nha_cung_cap WHERE provider_name = N'Vietnam Airlines');
DECLARE @vjId BIGINT = (SELECT TOP 1 provider_id FROM nha_cung_cap WHERE provider_name = N'Vietjet Air');

INSERT INTO phuong_tien (provider_id, vehicle_type, total_seats) VALUES
(@futaId, 'BUS', 40),
(@futaId, 'BUS', 34),
(@tbId, 'BUS', 34),
(@vnrId, 'TRAIN', 60),
(@vnrId, 'TRAIN', 40),
(@vnaId, 'PLANE', 180),
(@vjId, 'PLANE', 150)
GO

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
ALTER TABLE cho_ngoi ALTER COLUMN seat_number NVARCHAR(255);
ALTER TABLE cho_ngoi ALTER COLUMN seat_type NVARCHAR(255);

GO

PRINT N'Hoàn tất quá trình cập nhật toàn bộ cột sang NVARCHAR thành công!'
PRINT N'Bây giờ bạn có thể khởi động lại Backend Spring Boot (npm run start:all).'
GO

SELECT * 
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'cho_ngoi';

USE ticket_booking_db;
GO

-- 1. Xóa tất cả các liên kết phụ thuộc vòng ngoài cùng để không bị lỗi khoá ngoại
-- Xóa Vé (Ticket) và Đánh Giá (Review) của các Chuyến Đi thuộc Tuyến/Nhà Cung Cấp bị lỗi
DELETE FROM ve 
WHERE trip_id IN (
    SELECT trip_id FROM chuyen_di WHERE route_id IN (
        SELECT route_id FROM tuyen_duong WHERE origin LIKE N'%?%' OR destination LIKE N'%?%'
    ) OR vehicle_id IN (
        SELECT vehicle_id FROM phuong_tien WHERE provider_id IN (
            SELECT provider_id FROM nha_cung_cap WHERE provider_name LIKE N'%?%'
        )
    )
);

DELETE FROM danh_gia 
WHERE trip_id IN (
    SELECT trip_id FROM chuyen_di WHERE route_id IN (
        SELECT route_id FROM tuyen_duong WHERE origin LIKE N'%?%' OR destination LIKE N'%?%'
    ) OR vehicle_id IN (
        SELECT vehicle_id FROM phuong_tien WHERE provider_id IN (
            SELECT provider_id FROM nha_cung_cap WHERE provider_name LIKE N'%?%'
        )
    )
);

-- Xóa Ghế Ngồi (Seat) của các Phương Tiện thuộc Nhà Cung Cấp bị lỗi
DELETE FROM cho_ngoi 
WHERE vehicle_id IN (
    SELECT vehicle_id FROM phuong_tien WHERE provider_id IN (
        SELECT provider_id FROM nha_cung_cap WHERE provider_name LIKE N'%?%'
    )
);

-- 2. Xóa các Chuyến Đi (Trip) thuộc Tuyến/Nhà Cung Cấp bị lỗi
DELETE FROM chuyen_di 
WHERE route_id IN (
    SELECT route_id FROM tuyen_duong WHERE origin LIKE N'%?%' OR destination LIKE N'%?%'
) OR vehicle_id IN (
    SELECT vehicle_id FROM phuong_tien WHERE provider_id IN (
        SELECT provider_id FROM nha_cung_cap WHERE provider_name LIKE N'%?%'
    )
);

-- 3. Xóa các Phương Tiện (Vehicle) thuộc Nhà Cung Cấp bị lỗi
DELETE FROM phuong_tien 
WHERE provider_id IN (
    SELECT provider_id FROM nha_cung_cap WHERE provider_name LIKE N'%?%'
);

-- 4. Xóa các Tuyến Đường (Route) và Nhà Cung Cấp (Provider) gốc bị lỗi font
DELETE FROM tuyen_duong 
WHERE origin LIKE N'%?%' OR destination LIKE N'%?%';

DELETE FROM nha_cung_cap 
WHERE provider_name LIKE N'%?%';

GO
PRINT N'Đã xóa sạch dữ liệu lỗi bao gồm cả các bản ghi phụ thuộc (đặt vé, đánh giá)!';
GO

SELECT *
FROM phuong_tien

WITH cte AS (
    SELECT *,
           ROW_NUMBER() OVER(
               PARTITION BY provider_id, vehicle_type
               ORDER BY vehicle_id
           ) AS rn
    FROM phuong_tien
)
DELETE FROM cte
WHERE rn > 1;