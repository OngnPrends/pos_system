CREATE DATABASE pos_db;
USE pos_db;

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(50),
    quantity INT
);

CREATE TABLE sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity_sold INT,
    sale_date DATE,
    total_profit DECIMAL(10,2)
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

// Random Products

INSERT INTO products (name, description, price, category, quantity)
VALUES 
    ('Milk', '1 Gallon of Whole Milk', 3.99, 'Dairy', 100),
    ('Bread', 'White Bread Loaf', 2.49, 'Bakery', 150),
    ('Eggs', 'Dozen Large Eggs', 2.79, 'Dairy', 200),
    ('Bananas', '1 lb of Bananas', 0.59, 'Produce', 300),
    ('Cereal', '12 oz Box of Corn Flakes', 3.49, 'Breakfast', 100),
    ('Bottled Water', '1 Gallon of Spring Water', 1.29, 'Beverages', 200),
    ('Chips', 'Family Size Bag of Potato Chips', 2.99, 'Snacks', 120),
    ('Toilet Paper', '12 Roll Pack of Toilet Paper', 8.99, 'Household', 80),
    ('Shampoo', '16 oz Bottle of Shampoo', 4.99, 'Personal Care', 100),
    ('Toothpaste', '6 oz Tube of Toothpaste', 2.49, 'Personal Care', 150);

// Random Sales

INSERT INTO sales (product_id, quantity_sold, sale_date)
VALUES 
    (1, 5, '2024-05-01'),
    (2, 3, '2024-05-01'),
    (3, 2, '2024-05-02'),
    (4, 4, '2024-05-02'),
    (5, 1, '2024-05-03'),
    (6, 6, '2024-05-03'),
    (7, 2, '2024-05-04'),
    (8, 1, '2024-05-04'),
    (9, 3, '2024-05-05'),
    (10, 2, '2024-05-05');
