DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  -- role_id INTEGER,
  -- manager_id INTEGER
);

