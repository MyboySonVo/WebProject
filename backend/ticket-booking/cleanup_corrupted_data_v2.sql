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
