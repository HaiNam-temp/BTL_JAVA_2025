-- Flyway V2: seed sample data

INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');

INSERT INTO users (fullname, phone_number, email, address, profile_image, password, is_active, date_of_birth, facebook_account_id, google_account_id, role_id, created_at, updated_at)
VALUES
('Alice Nguyen','0123456789','alice@example.com','123 Tran Phu','/images/profiles/alice.jpg','$2a$10$fakehashedpassword',1,'1990-05-12',NULL,NULL,1,NOW(),NOW()),
('Bob Tran','0987654321','bob@example.com','456 Le Loi','/images/profiles/bob.jpg','$2a$10$fakehashedpassword',1,'1985-08-20',NULL,NULL,2,NOW(),NOW());

INSERT INTO categories (name) VALUES ('Điện Thoại & Phụ Kiện'), ('Thời Trang Nam'), ('Đồng Hồ'), ('Giày Dép Nam');

INSERT INTO products (name, price, thumbnail, category_id, quantity_in_stock, created_at, updated_at)
VALUES
('Điện Thoại Oppo F11',299.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mdjziqdwen1r19.webp',1,50,NOW(),NOW()),
('ĐIỆN THOẠI SAMSUNG A20',19.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lox1eu9npu8rb9.webp',1,120,NOW(),NOW()),
('ĐIỆN THOẠI SAMSUNG A75',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytif4rmjnu68',1,200,NOW(),NOW()),
('Điện thoại Xiaomi Redmi',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytif4rmjnu68',1,200,NOW(),NOW()),
('Điện thoại samsung galaxy',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6yx2yvb99o851.webp',1,200,NOW(),NOW()),
('Điện thoại mini nắp gập',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m418dtg4tsbk8e.webp',1,200,NOW(),NOW()),
('Sạc 20000mah sạc nhanh',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-loj8gu856ub7c7.webp',1,200,NOW(),NOW()),
('Sạc Dự Phòng DX310 50000mah',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6xrwghgcpjs0c.webp',1,200,NOW(),NOW()),
('GOOJODOQ Mini Sạc dự phòng',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgythzoyyvws9e',1,200,NOW(),NOW()),
('bộ sạc nhanh 20.W',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0xcugmpc75910.webp',1,200,NOW(),NOW()),
('Giá kệ đỡ điện thoại',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7dovdxzvcnsa4.webp',1,200,NOW(),NOW()),
('Áo khoác Blazer Nam',9.99,'https://down-vn.img.susercontent.com/file/39ba55af4ef2c88080163ecb7a478a13.webp',2,200,NOW(),NOW()),
('Áo Gile Len Nam',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1bhj3y30km015.webp',2,200,NOW(),NOW()),
('Áo gile len trơn',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgyt9vibelmw44',2,200,NOW(),NOW()),
('Bộ vest nam cao cấp',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lu6jbm6qf0nzd1.webp',2,200,NOW(),NOW()),
('Áo Blazer Nam Sanminhchau',9.99,'https://down-vn.img.susercontent.com/file/1e96e6b9335c69bcd2aa153148553476@resize_w900_nl.webp',2,200,NOW(),NOW()),
('Quần Jean Ống Rộng Nam',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgyt9vibelmw44',2,200,NOW(),NOW()),
('Quần short jean nam',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma0b2uxa7bbuf3.webp',2,200,NOW(),NOW()),
('Quần Jeans Dài Ống Suông',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4gyi5hhdjv3b7.webp',2,200,NOW(),NOW()),
('Mắt kính chống tia bức xạ',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfdxlkky0fic7d.webp',2,200,NOW(),NOW()),
('Thắt Lưng Nam Vải Canvas',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8zp6g8rg0w78a.webp',2,200,NOW(),NOW()),
('Đồng hồ điện tử nam nữ',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytif4rmjnu68',3,200,NOW(),NOW()),
('Đồng hồ thời trang nữ',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytczozbvnxba',3,200,NOW(),NOW()),
('ồng hồ nữ Z02 mặt vuông',9.99,'https://down-vn.img.susercontent.com/file/9af8f54b6c5ae582b4f5e4334ea081fe.webp',3,200,NOW(),NOW()),
('Đồng Hồ Đeo Tay Điện Tử',9.99,'https://down-vn.img.susercontent.com/file/sg-11134201-22100-7besz9o63miv73@resize_w900_nl.webp',3,200,NOW(),NOW()),
('Đồng hồ nam dây da Wokai68',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytkkpcplak52',3,200,NOW(),NOW()),
('Đồng Hồ Đeo Tay Mặt Vuông',9.99,'https://down-vn.img.susercontent.com/file/sg-11134201-7rbmv-m5wl6fskcpsn1b.webp',3,200,NOW(),NOW()),
('Đồng hồ thể thao nam nữ',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytif4rmjnu68',3,200,NOW(),NOW()),
('Đồng hồ thời trang nữ BS',9.99,'https://down-vn.img.susercontent.com/file/ce7e4287b7565624a3fc092b2c4f7fe5.webp',3,200,NOW(),NOW()),
('Bộ Đồng Hồ Nữ 2',9.99,'https://down-vn.img.susercontent.com/file/sg-11134201-821em-mgyuvczkq13j8a@resize_w900_nl.webp',3,200,NOW(),NOW()),
('Dụng cụ tháo mắt dây đồng hồ',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytczozbvnxba',3,200,NOW(),NOW()),
('Giày nam sneakers thể thao',9.99,'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lrzxvn7yi6ska1@resize_w900_nl.webp',4,200,NOW(),NOW()),
('Giày Adidas Samba',9.99,'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mgytif4rmjnu68',4,200,NOW(),NOW()),
('Giày Thời Trang Nam Mũi Tròn',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lr252mc12jkp23@resize_w900_nl.webp',4,200,NOW(),NOW()),
('Giày Thể Thao Nam Thời Trang',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-medyswmr5iisf9@resize_w900_nl.webp',4,200,NOW(),NOW()),
('Giày thể thao Sneaker SB Force',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-meyg784gh2pvb8@resize_w900_nl.webp',4,200,NOW(),NOW()),
('Giày Thể Thao Thông Dụng Nam',9.99,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly99xc68h1e523@resize_w900_nl.webp',4,200,NOW(),NOW());


INSERT INTO product_images (product_id, image_url) VALUES
(1,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m129glggfztnab.webp'),
(1,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mdjzjxkt77sff3.webp'),
(2,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lox1feqbt8i6bf.webp'),
(2,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lox1feqlstvy87.webp'),
(3,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4u6ppdwysjnf4@resize_w900_nl.webp'),
(3,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-maiaskbjay8o1a@resize_w900_nl.webp'),
(4,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6yx324ehx7c99.webp'),
(4,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6yx419n2ed405.webp'),
(5,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lppar2ndikzdd0.webp'),
(5,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lppar2ndjzjta0.webp'),
(6,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-loj8gu7uccdz19.webp'),
(6,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-loj8gu7v78vr3b.webp'),
(7,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwtsdthdrx7fc7.webp'),
(7,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6xs7iy392l423.webp'),
(8,'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lxth7k5wnfhffa.webp'),
(8,'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvf-lxth25127fyi68.webp'),
(9,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wm40p8e00ff0.webp'),
(9,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wm1uw88x6527.webp'),
(10,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m87xj8z0ab9jd3.webp'),
(10,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7dovdy9uxyu5f.webp'),
(11,'https://down-vn.img.susercontent.com/file/1b8625fd4c19eee0b362b652b2bee164.webp'),
(11,'https://down-vn.img.susercontent.com/file/9eb4cd685dbee2fac7d24d9eafc51142.webp'),
(12,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lpcj5l06rmfvf7.webp'),
(12,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lscx01fv9lms04.webp'),
(13,'https://down-vn.img.susercontent.com/file/0f65dc8f2343cc06c54f6589fa6d0ffe.webp'),
(13,'https://down-vn.img.susercontent.com/file/afee66f070acd23a61944685b68d00cb.webp'),
(14,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnzw6l3ft9x65c.webp'),
(14,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lu6jbm6qgf8f11.webp'),
(15,'https://down-vn.img.susercontent.com/file/68937213750847088fcf34e6858759d3.webp'),
(15,'https://down-vn.img.susercontent.com/file/1e96e6b9335c69bcd2aa153148553476.webp'),
(16,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m134s9n0t38f6f.webp'),
(16,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-maf3alpphhohcc.webp'),
(17,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma0b2sux84tq1d.webp'),
(17,'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma0b2x6awr5a32.webp'),
(18,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4gyi5hhdjfk81.webp'),
(18,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4digbcp2ovk64.webp'),
(19,'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfdxlkky0fic7d.webp'),
(19,'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfe2n0timyysa3.webp'),
(20,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llolyv97hfbzf6.webp'),
(20,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llolyv983wf3f4.webp'),
(21,'https://down-vn.img.susercontent.com/file/f0805502f3f8d9218cda16331311e5d1.webp'),
(21,'https://down-vn.img.susercontent.com/file/ec82009768ca78a3abd6d90428430615.webp'),
(22,'https://down-vn.img.susercontent.com/file/f79df7b667239e16b8e4ef21efa92957.webp'),
(22,'https://down-vn.img.susercontent.com/file/e1d3d18b7acb7ec1cb839c29c258da98.webp'),
(23,'https://down-vn.img.susercontent.com/file/5473f65ab58577f5d7a9e379e6397e8a.webp'),
(23,'https://down-vn.img.susercontent.com/file/49055e360e5379b628ce55d88abd8584.webp'),
(24,'https://down-vn.img.susercontent.com/file/sg-11134201-22100-wpvgqb1y3mivdc@resize_w900_nl.webp'),
(24,'https://down-vn.img.susercontent.com/file/sg-11134201-22100-xhh12j1y3mivd9.webp'),
(25,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwmluodf4kbd2b@resize_w900_nl.webp'),
(25,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwgyg6hca3tn95.webp'),
(26,'https://down-vn.img.susercontent.com/file/sg-11134201-22110-tibt8ct4eqjvb0.webp'),
(26,'https://down-vn.img.susercontent.com/file/sg-11134201-22110-cf4s5fv4eqjvd0.webp'),
(27,'https://down-vn.img.susercontent.com/file/273ea34524a0720b85347606cf70e218@resize_w900_nl.webp'),
(27,'https://down-vn.img.susercontent.com/file/99ac0de12e04a9278285cf504e5bd515@resize_w900_nl.webp'),
(28,'https://down-vn.img.susercontent.com/file/74d80a441a8df417430764360d8f2e74.webp'),
(28,'https://down-vn.img.susercontent.com/file/f5c25d91c6d80fb10e6858e4e003aa44.webp'),
(29,'https://down-vn.img.susercontent.com/file/cn-11134301-7r98o-lmgwmzll55b680@resize_w900_nl.webp'),
(29,'https://down-vn.img.susercontent.com/file/cn-11134301-7r98o-lmgwmzll6jvm07@resize_w900_nl.webp'),
(30,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llrygxhw5iov4d@resize_w900_nl.webp'),
(30,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llrygxhmmsbja9.webp'),
(31,'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lrzxvosk7d3m1d@resize_w900_nl.webp'),
(31,'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lrzxvpz0h8ww2c@resize_w900_nl.webp'),
(32,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-md2m23l1leb1d5@resize_w900_nl.webp'),
(32,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-md2m23lbl07wd8@resize_w900_nl.webp'),
(33,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lr252mc15cpl19@resize_w900_nl.webp'),
(33,'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2ajoti7wo1g59.webp'),
(34,'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-medyoc3ntb0i0b@resize_w900_nl.webp'),
(34,'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-medyswxbjkzr07@resize_w900_nl.webp'),
(35,'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-meyg15vtpret74@resize_w900_nl.webp'),
(35,'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-meygcg667k7b25@resize_w900_nl.webp'),
(36,'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly99xc68ifyl00@resize_w900_nl.webp');





INSERT INTO comments (product_id, user_id, content, created_at, updated_at) VALUES
(1,1,'Great phone for the price',NOW(),NOW()),
(2,2,'Very informative book',NOW(),NOW());

INSERT INTO coupons (code, active) VALUES
('HEAVEN',1),
('DISCOUNT20',1);

INSERT INTO coupon_conditions (coupon_id, attribute, operator, value, discount_amount) VALUES
(1,'minimum_amount','>','100',10.00),
(1,'applicable_date','BETWEEN','2023-12-25',5.00),
(2,'minimum_amount','>','200',20.00);

INSERT INTO orders (user_id, fullname, email, phone_number, address, note, order_date, status, total_money, shipping_method, shipping_address, shipping_date, tracking_number, payment_method, active, vnp_txn_ref, coupon_id, created_at, updated_at)
VALUES
(1,'Alice Nguyen','alice@example.com','0123456789','123 Tran Phu','Please deliver between 9-5',NOW(),'pending',319.98,'Standard','123 Tran Phu',NULL,'TRK123','VNPay',1,NULL,1,NOW(),NOW());

INSERT INTO order_details (order_id, product_id, price, number_of_products, total_money, color, coupon_id) VALUES
(1,1,299.99,1,299.99,'Black',NULL),
(1,3,9.99,2,19.98,'Blue',NULL);

INSERT INTO notifications (user_id, message, icon, link, is_read, created_at) VALUES
(1,'Your order #1 has been placed','🛒','/orders/1',0,NOW());

INSERT INTO social_accounts (provider, provider_id, email, name, user_id) VALUES
('google','google-123','alice@example.com','Alice',1);

INSERT INTO tokens (token, refresh_token, token_type, expiration_date, refresh_expiration_date, is_mobile, revoked, expired, user_id) VALUES
('fake.jwt.token','fake.refresh.token','Bearer',DATE_ADD(NOW(), INTERVAL 1 DAY),DATE_ADD(NOW(), INTERVAL 30 DAY),0,0,0,1);
