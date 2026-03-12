SELECT * FROM nguoi_dung WHERE email = 'admin@gmail.com';

UPDATE nguoi_dung
SET role = 'ROLE_ADMIN'
WHERE email = 'admin@gmail.com';