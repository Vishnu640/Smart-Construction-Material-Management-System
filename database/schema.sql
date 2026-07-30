CREATE DATABASE IF NOT EXISTS construction_management;
USE construction_management;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','ENGINEER','STORE_MANAGER') NOT NULL
);

CREATE TABLE suppliers (
    supplier_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE materials (
    material_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    quantity INT DEFAULT 0,
    price DOUBLE,
    supplier VARCHAR(100),
    min_stock INT DEFAULT 100
);

CREATE TABLE purchases (
    purchase_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_id BIGINT,
    quantity INT,
    total_cost DOUBLE,
    purchase_date DATE,
    FOREIGN KEY (material_id) REFERENCES materials(material_id)
);

-- Default admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');


CREATE TABLE usage_records (
    usage_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_id BIGINT,
    used_quantity INT,
    used_date DATE,
    project_name VARCHAR(150),
    FOREIGN KEY (material_id) REFERENCES materials(material_id)
);

CREATE TABLE expenses (
    expense_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255),
    amount DOUBLE,
    expense_date DATE,
    category VARCHAR(50) DEFAULT 'OTHER',
    project_name VARCHAR(150)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    message VARCHAR(500),
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    material_id BIGINT
);

CREATE TABLE projects (
    project_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    engineer VARCHAR(100),
    start_date DATE,
    end_date DATE,
    progress INT DEFAULT 0,
    material_requirements TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

