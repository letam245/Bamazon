DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

-- DELETE from products WHERE item_id BETWEEN 1 AND 9;
-- DELETE from products WHERE item_id = 10;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("sock", "Clothing", 5.5, 10),
  ("mini black dress", "Clothing", 30.00, 40),
  ("levi jean", "Clothing", 24.50, 50),
  ("cake", "Food", 6.50, 10),
  ("macaron", "Food", 20.50, 72),
  ("banh mi", "Food", 8.50, 20),
  ("brownie", "Food", 5.50, 30),
  ("soul surfer", "Movie", 15.00, 10),
  ("school of rock", "Movie", 15.00, 5),
  ("the boss baby", "Movie", 20.50, 15);
