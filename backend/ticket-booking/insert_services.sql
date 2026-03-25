-- ============================================================
-- FIX + THÊM DỮ LIỆU DỊCH VỤ BỔ SUNG
-- Đã thêm xử lý chống lỗi trùng ID (Violation of PRIMARY KEY)
-- ============================================================

-- 1. Thử xóa toàn bộ dữ liệu cũ (nếu không vướng khóa ngoại)
BEGIN TRY
    DELETE FROM dich_vu_bo_sung;
END TRY
BEGIN CATCH
    PRINT N'Có dữ liệu đang được sử dụng ở bảng khác, giữ nguyên dữ liệu cũ và chèn tiếp...';
END CATCH

-- 2. Tự động cập nhật lại Identity Seed để không bao giờ bị trùng ID
DECLARE @MaxID INT;
SELECT @MaxID = ISNULL(MAX(service_id), 0) FROM dich_vu_bo_sung;
DBCC CHECKIDENT ('dich_vu_bo_sung', RESEED, @MaxID);

-- 3. INSERT Dịch vụ mới

-- HÀNH LÝ KÝ GỬI
INSERT INTO dich_vu_bo_sung (service_name, price) VALUES
(N'Hành lý ký gửi 10kg',  150000),
(N'Hành lý ký gửi 20kg',  250000),
(N'Hành lý ký gửi 30kg',  350000),
(N'Hành lý ký gửi 40kg',  450000);

-- SUẤT ĂN
INSERT INTO dich_vu_bo_sung (service_name, price) VALUES
(N'Suất ăn Cơm gà xối mỡ',   89000),
(N'Suất ăn Cơm bò nấu tiêu',  95000),
(N'Suất ăn Mì Ý sốt bò băm',  79000),
(N'Suất ăn Bánh mì thịt nướng',55000),
(N'Suất ăn Trái cây tươi',     45000),
(N'Suất ăn Chay (rau củ)',     70000);

-- BẢO HIỂM DU LỊCH
INSERT INTO dich_vu_bo_sung (service_name, price) VALUES
(N'Bảo hiểm du lịch Cơ bản (BIC)',     72000),
(N'Bảo hiểm du lịch Toàn diện (PTI)',  120000),
(N'Bảo hiểm hành lý thất lạc',          55000);

-- TAXI ĐÓN SÂN BAY
INSERT INTO dich_vu_bo_sung (service_name, price) VALUES
(N'Taxi đưa đón sân bay (Xanh SM 4 chỗ)',   199000),
(N'Taxi đưa đón sân bay (Xanh SM 7 chỗ)',   249000),
(N'Taxi đưa đón sân bay (Vinasun 4 chỗ)',   179000);

-- KIỂM TRA LẠI
SELECT service_id, service_name, FORMAT(price, 'N0') + ' đ' AS price
FROM dich_vu_bo_sung
ORDER BY service_id DESC;

-- 1. Xóa liên kết khóa ngoại trong bảng dat_ve_dich_vu trước
DELETE FROM dat_ve_dich_vu 
WHERE service_id IN (
    SELECT service_id 
    FROM dich_vu_bo_sung 
    WHERE service_name = N'Taxi dua dón sân bay (Xanh SM)'
);

-- 2. Xóa dịch vụ gốc
DELETE FROM dich_vu_bo_sung 
WHERE service_name = N'Taxi dua dón sân bay (Xanh SM)';
