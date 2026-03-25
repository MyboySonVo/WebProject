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
