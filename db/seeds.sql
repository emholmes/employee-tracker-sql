INSERT INTO department (name)
VALUES 
  ("Technology"),
  ("Marketing"),
  ("Purchasing"),
  ("Finance")
;

INSERT INTO role (title, salary, department_id)
VALUES
  ("Designer", 70000, 2),
  ("Engineer", 90000, 1),
  ("Buyer", 75000, 3),
  ("Accountant", 100000, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
  ("Ronald", "Firbank", 1, NULL),
  ("Virginia", "Woolf", 1, NULL),
  ("Piers", "Gaveston", 2, 2),
  ("Charles", "LeRoi", 3, 3),
  ("Katherine", "Mansfield", 4, 2)
;