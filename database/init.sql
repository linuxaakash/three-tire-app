CREATE DATABASE IF NOT EXISTS companydb;

USE companydb;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL
);

INSERT INTO employees (name, role)
SELECT 'Sneha', 'DevOps Trainer'
WHERE NOT EXISTS (
    SELECT 1 FROM employees WHERE name = 'Sneha'
);
