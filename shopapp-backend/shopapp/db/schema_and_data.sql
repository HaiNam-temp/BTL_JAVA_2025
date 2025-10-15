-- Schema and fake data for Shopapp (generated from Java model classes)
-- Run with: mysql -u root -p shopapp < schema_and_data.sql

DROP DATABASE IF EXISTS shopapp;
CREATE DATABASE shopapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopapp;

-- Table: roles
CREATE TABLE roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Table: users
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100),
  phone_number VARCHAR(10),
  email VARCHAR(255),
  address VARCHAR(200),
  profile_image VARCHAR(255),
  password VARCHAR(200) NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  date_of_birth DATE,
  facebook_account_id VARCHAR(255),
  google_account_id VARCHAR(255),
  role_id BIGINT,
  created_at DATETIME,
  updated_at DATETIME,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Table: categories
CREATE TABLE categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Table: products
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(350) NOT NULL,
  price FLOAT,
  thumbnail VARCHAR(350),
  description TEXT,
  category_id BIGINT,
  quantity_in_stock INT,
  created_at DATETIME,
  updated_at DATETIME,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table: product_images
CREATE TABLE product_images (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT,
  image_url VARCHAR(300),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table: comments
CREATE TABLE comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT,
  user_id BIGINT,
  content TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  CONSTRAINT fk_comments_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: coupons
CREATE TABLE coupons (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL UNIQUE,
  active TINYINT(1) NOT NULL DEFAULT 0
);

-- Table: coupon_conditions
CREATE TABLE coupon_conditions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  coupon_id BIGINT NOT NULL,
  attribute VARCHAR(255) NOT NULL,
  operator VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  discount_amount DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_coupon_conditions_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

-- Table: orders
CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  fullname VARCHAR(100),
  email VARCHAR(100),
  phone_number VARCHAR(20) NOT NULL,
  address VARCHAR(100) NOT NULL,
  note VARCHAR(100),
  order_date DATETIME,
  status VARCHAR(255),
  total_money FLOAT,
  shipping_method VARCHAR(255),
  shipping_address VARCHAR(255),
  shipping_date DATE,
  tracking_number VARCHAR(255),
  payment_method VARCHAR(255),
  active TINYINT(1),
  vnp_txn_ref VARCHAR(255),
  coupon_id BIGINT,
  created_at DATETIME,
  updated_at DATETIME,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

-- Table: order_details
CREATE TABLE order_details (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  product_id BIGINT,
  price FLOAT NOT NULL,
  number_of_products INT NOT NULL,
  total_money FLOAT NOT NULL,
  color VARCHAR(255),
  coupon_id BIGINT,
  CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_order_details_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

-- Table: notifications
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  message VARCHAR(1000) NOT NULL,
  icon VARCHAR(50),
  link VARCHAR(255),
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: social_accounts
CREATE TABLE social_accounts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,
  provider_id VARCHAR(50),
  email VARCHAR(150),
  name VARCHAR(100),
  user_id BIGINT,
  CONSTRAINT fk_social_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: tokens
CREATE TABLE tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255),
  refresh_token VARCHAR(255),
  token_type VARCHAR(50),
  expiration_date DATETIME,
  refresh_expiration_date DATETIME,
  is_mobile TINYINT(1),
  revoked TINYINT(1),
  expired TINYINT(1),
  user_id BIGINT,
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Simple fake data
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');

-- Users
INSERT INTO users (fullname, phone_number, email, address, profile_image, password, is_active, date_of_birth, facebook_account_id, google_account_id, role_id, created_at, updated_at)
VALUES
('Alice Nguyen','0123456789','alice@example.com','123 Tran Phu','/images/profiles/alice.jpg','$2a$10$fakehashedpassword',1,'1990-05-12',NULL,NULL,1,NOW(),NOW()),
('Bob Tran','0987654321','bob@example.com','456 Le Loi','/images/profiles/bob.jpg','$2a$10$fakehashedpassword',1,'1985-08-20',NULL,NULL,2,NOW(),NOW());

-- Categories
INSERT INTO categories (name) VALUES ('Electronics'), ('Books'), ('Clothing');

-- Products
INSERT INTO products (name, price, thumbnail, description, category_id, quantity_in_stock, created_at, updated_at)
VALUES
('Smartphone A',299.99,'/images/products/smartphone_a.jpg','A mid-range smartphone',1,50,NOW(),NOW()),
('Java Programming',19.99,'/images/products/java_book.jpg','Comprehensive Java guide',2,120,NOW(),NOW()),
('T-Shirt Blue',9.99,'/images/products/tshirt_blue.jpg','Comfortable cotton t-shirt',3,200,NOW(),NOW());

-- Product images
INSERT INTO product_images (product_id, image_url) VALUES
(1,'/images/products/smartphone_a_1.jpg'),
(1,'/images/products/smartphone_a_2.jpg'),
(2,'/images/products/java_book_1.jpg');

-- Comments
INSERT INTO comments (product_id, user_id, content, created_at, updated_at) VALUES
(1,1,'Great phone for the price',NOW(),NOW()),
(2,2,'Very informative book',NOW(),NOW());

-- Coupons
INSERT INTO coupons (code, active) VALUES
('HEAVEN',1),
('DISCOUNT20',1);

-- Coupon conditions
INSERT INTO coupon_conditions (coupon_id, attribute, operator, value, discount_amount) VALUES
(1,'minimum_amount','>','100',10.00),
(1,'applicable_date','BETWEEN','2023-12-25',5.00),
(2,'minimum_amount','>','200',20.00);

-- Orders
INSERT INTO orders (user_id, fullname, email, phone_number, address, note, order_date, status, total_money, shipping_method, shipping_address, shipping_date, tracking_number, payment_method, active, vnp_txn_ref, coupon_id, created_at, updated_at)
VALUES
(1,'Alice Nguyen','alice@example.com','0123456789','123 Tran Phu','Please deliver between 9-5',NOW(),'pending',319.98,'Standard','123 Tran Phu',NULL,'TRK123','VNPay',1,NULL,1,NOW(),NOW());

-- Order details
INSERT INTO order_details (order_id, product_id, price, number_of_products, total_money, color, coupon_id) VALUES
(1,1,299.99,1,299.99,'Black',NULL),
(1,3,9.99,2,19.98,'Blue',NULL);

-- Notifications
INSERT INTO notifications (user_id, message, icon, link, is_read, created_at) VALUES
(1,'Your order #1 has been placed','🛒','/orders/1',0,NOW());

-- Social accounts
INSERT INTO social_accounts (provider, provider_id, email, name, user_id) VALUES
('google','google-123','alice@example.com','Alice',1);

-- Tokens
INSERT INTO tokens (token, refresh_token, token_type, expiration_date, refresh_expiration_date, is_mobile, revoked, expired, user_id) VALUES
('fake.jwt.token','fake.refresh.token','Bearer',DATE_ADD(NOW(), INTERVAL 1 DAY),DATE_ADD(NOW(), INTERVAL 30 DAY),0,0,0,1);

-- End of file
