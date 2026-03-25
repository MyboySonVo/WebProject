-- Script thêm ghế cho tất cả phương tiện chưa có ghế
-- Chạy trong SQL Server Management Studio

-- Xem các vehicle hiện tại
SELECT v.vehicle_id, v.vehicle_type, v.total_seats, p.provider_name,
       (SELECT COUNT(*) FROM cho_ngoi s WHERE s.vehicle_id = v.vehicle_id) AS so_ghe_hien_tai
FROM phuong_tien v
JOIN nha_cung_cap p ON v.provider_id = p.provider_id
ORDER BY v.vehicle_type, v.vehicle_id;

GO

-- ============================================================
-- THÊM GHẾ CHO MÁY BAY (PLANE) - 6 cột A-F, hàng 1-30
-- Hàng 1-6: BUSINESS  | Hàng 7-30: ECONOMY
-- ============================================================
DECLARE @vid INT;
DECLARE plane_cursor CURSOR FOR
    SELECT v.vehicle_id FROM phuong_tien v WHERE v.vehicle_type = 'PLANE'
    AND NOT EXISTS (SELECT 1 FROM cho_ngoi s WHERE s.vehicle_id = v.vehicle_id);

OPEN plane_cursor;
FETCH NEXT FROM plane_cursor INTO @vid;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @row INT = 1;
    WHILE @row <= 30
    BEGIN
        DECLARE @col NVARCHAR(1);
        DECLARE @colIdx INT = 1;
        WHILE @colIdx <= 6
        BEGIN
            SET @col = CASE @colIdx
                WHEN 1 THEN 'A' WHEN 2 THEN 'B' WHEN 3 THEN 'C'
                WHEN 4 THEN 'D' WHEN 5 THEN 'E' WHEN 6 THEN 'F'
            END;
            INSERT INTO cho_ngoi (vehicle_id, seat_number, seat_type)
            VALUES (@vid,
                    CAST(@row AS NVARCHAR) + @col,
                    CASE WHEN @row <= 6 THEN 'BUSINESS' ELSE 'ECONOMY' END);
            SET @colIdx = @colIdx + 1;
        END
        SET @row = @row + 1;
    END
    FETCH NEXT FROM plane_cursor INTO @vid;
END
CLOSE plane_cursor;
DEALLOCATE plane_cursor;

-- ============================================================
-- THÊM GHẾ CHO XE KHÁCH (BUS) - 2 cột A-B, hàng 1-20
-- Tất cả: SEAT
-- ============================================================
DECLARE @vid2 INT;
DECLARE bus_cursor CURSOR FOR
    SELECT v.vehicle_id FROM phuong_tien v WHERE v.vehicle_type = 'BUS'
    AND NOT EXISTS (SELECT 1 FROM cho_ngoi s WHERE s.vehicle_id = v.vehicle_id);

OPEN bus_cursor;
FETCH NEXT FROM bus_cursor INTO @vid2;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @brow INT = 1;
    WHILE @brow <= 20
    BEGIN
        INSERT INTO cho_ngoi (vehicle_id, seat_number, seat_type) VALUES (@vid2, CAST(@brow AS NVARCHAR) + 'A', 'SEAT');
        INSERT INTO cho_ngoi (vehicle_id, seat_number, seat_type) VALUES (@vid2, CAST(@brow AS NVARCHAR) + 'B', 'SEAT');
        SET @brow = @brow + 1;
    END
    FETCH NEXT FROM bus_cursor INTO @vid2;
END
CLOSE bus_cursor;
DEALLOCATE bus_cursor;

-- ============================================================
-- THÊM GHẾ CHO TÀU HỎA (TRAIN) - 4 cột A-D, hàng 1-20
-- Hàng 1-5: SOFT_BED  | Hàng 6-20: SOFT_SEAT
-- ============================================================
DECLARE @vid3 INT;
DECLARE train_cursor CURSOR FOR
    SELECT v.vehicle_id FROM phuong_tien v WHERE v.vehicle_type = 'TRAIN'
    AND NOT EXISTS (SELECT 1 FROM cho_ngoi s WHERE s.vehicle_id = v.vehicle_id);

OPEN train_cursor;
FETCH NEXT FROM train_cursor INTO @vid3;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @trow INT = 1;
    WHILE @trow <= 20
    BEGIN
        DECLARE @tc INT = 1;
        WHILE @tc <= 4
        BEGIN
            DECLARE @tcol NVARCHAR(1) = CASE @tc WHEN 1 THEN 'A' WHEN 2 THEN 'B' WHEN 3 THEN 'C' WHEN 4 THEN 'D' END;
            INSERT INTO cho_ngoi (vehicle_id, seat_number, seat_type)
            VALUES (@vid3, CAST(@trow AS NVARCHAR) + @tcol,
                    CASE WHEN @trow <= 5 THEN 'SOFT_BED' ELSE 'SOFT_SEAT' END);
            SET @tc = @tc + 1;
        END
        SET @trow = @trow + 1;
    END
    FETCH NEXT FROM train_cursor INTO @vid3;
END
CLOSE train_cursor;
DEALLOCATE train_cursor;

-- Kiểm tra kết quả
SELECT v.vehicle_id, v.vehicle_type, p.provider_name,
       COUNT(s.seat_id) AS total_seats_inserted
FROM phuong_tien v
JOIN nha_cung_cap p ON v.provider_id = p.provider_id
LEFT JOIN cho_ngoi s ON s.vehicle_id = v.vehicle_id
GROUP BY v.vehicle_id, v.vehicle_type, p.provider_name
ORDER BY v.vehicle_type, v.vehicle_id;
