-- Flyway V2: seed sample data

INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');

INSERT INTO users (fullname, phone_number, email, address, profile_image, password, is_active, date_of_birth, facebook_account_id, google_account_id, role_id, created_at, updated_at)
VALUES
('Alice Nguyen','0123456789','alice@example.com','123 Tran Phu','/images/profiles/alice.jpg','$2a$10$fakehashedpassword',1,'1990-05-12',NULL,NULL,1,NOW(),NOW()),
('Bob Tran','0987654321','bob@example.com','456 Le Loi','/images/profiles/bob.jpg','$2a$10$fakehashedpassword',1,'1985-08-20',NULL,NULL,2,NOW(),NOW());

INSERT INTO categories (name) VALUES ('Electronics'), ('Books'), ('Clothing');

INSERT INTO products (name, price, thumbnail, description, category_id, quantity_in_stock, created_at, updated_at)
VALUES
('Smartphone A',299.99,'/images/products/smartphone_a.jpg','A mid-range smartphone',1,50,NOW(),NOW()),
('Java Programming',19.99,'/images/products/java_book.jpg','Comprehensive Java guide',2,120,NOW(),NOW()),
('T-Shirt Blue',9.99,'/images/products/tshirt_blue.jpg','Comfortable cotton t-shirt',3,200,NOW(),NOW());

INSERT INTO product_images (product_id, image_url) VALUES
(1,'/images/products/smartphone_a_1.jpg'),
(1,'/images/products/smartphone_a_2.jpg'),
(2,'/images/products/java_book_1.jpg');

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
