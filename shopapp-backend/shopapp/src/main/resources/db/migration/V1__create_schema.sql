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
