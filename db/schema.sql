DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  -- role_id INTEGER,
  -- manager_id INTEGER
);

