const inquirer = require("inquirer");
const db = require("./config/connection");
const cTable = require('console.table');

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});

const getEmployeeNames = () => {
  const sql = `
    SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name
    FROM employee`;
  return db.promise().query(sql)
}

const getEmployeeByName = (name) => {
  const sql = `
    SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name
    FROM employee
    WHERE CONCAT(employee.first_name, " ", employee.last_name) = ?`;
  return db.promise().query(sql, name)
}

const getDepartmentByName = (department) => {
  const sql = `
    SELECT department.id
    FROM department
    WHERE department.name = ?`;
  return db.promise().query(sql, department)
}

const getDepartmentNames = () => {
  const sql = `
    SELECT department.name
    FROM department`;
  return db.promise().query(sql) 
}

const getRoleTitles = () => {
  const sql_role = `
    SELECT role.title AS title
    FROM role`;
  return db.promise().query(sql_role) 
}

const getRoleId = (role) => {
  const sql_role_id = `
    SELECT role.id
    FROM role
    WHERE role.title = ?`;
  return db.promise().query(sql_role_id, role)
}

const viewAllEmployees = () => {
  const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager  
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log(" ");
    console.table(result);
    promptUser();
  });
}

const viewAllRoles = () => {
  const sql = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
    ORDER BY role.id ASC`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log(" ");
    console.table(result);
    promptUser();
  });
}

const viewAllDepartments = () => {
  const sql = `
    SELECT department.id, department.name AS department 
    FROM department`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log(" ");
    console.table(result);
    promptUser();
  });
}

const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "What is the name of the department to add?"
    }
  ])
  .then(departmentName => {
    const sql =  `INSERT INTO department (name) VALUES (?)`;
    const params = departmentName.newDepartment;
    db.query(sql, params, (err, result) => {
      if (err) throw err; 
      console.log(`Added ${params} to the database`);
      promptUser();
    });
  });  
}

const addRole = () => {
  getDepartmentNames()
    .then(([rows]) => {
      let departmentArray = [];
      rows.forEach(row => {
        departmentArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role to add?"
        }, 
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?"
        },{
          type: "list",
          name: "departmentId",
          message: "What is the role's department?",
          choices: departmentArray
        }
      ])
      .then(results => {
        getDepartmentByName(results.departmentId)
          .then(([rows]) => {
            results.departmentId = rows[0].id;
            const sql =  `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            const params = [results.title, results.salary, results.departmentId];
            db.query(sql, params, (err, result) => {
              if (err) throw err; 
              console.log(`Added ${results.title} to the database`);
              promptUser();
            })
          })
      })
    })
}

const addEmployee = () => {
  getEmployeeNames()
    .then(([rows]) => {
      let managerArray = ["None"];
      rows.forEach(row => {
        managerArray.push(row.name);
      })
  getRoleTitles()
    .then(([rows]) => {
      let roleArray = [];
      rows.forEach(row => {
        roleArray.push(row.title);
      })
      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleArray
        },
        {
          type: "list",
          name: "managerId",
          message: "Who is the employee's manager?",
          choices: managerArray
        }
      ])
      .then(results => {
        let firstName = results.firstName.trim();
        let lastName = results.lastName.trim();
        
        getEmployeeByName(results.managerId)
          .then(([managers]) => {
            results.managerId = managers[0].id;
            getRoleId(results.roleId)
              .then(([roles]) => {
                results.roleId = roles[0].id;
                const sql_insert_employee = `
                  INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                const params = [firstName, lastName, results.roleId, results.managerId];
                db.query(sql_insert_employee, params, (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${firstName} ${lastName} to the database`);
                  promptUser();
                })
              })
              
          })
          .catch(() => {
            getRoleId(results.roleId)
              .then(([roles]) => {
                results.roleId = roles[0].id;
                const sql_insert_employee = `
                  INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,NULL)`;
                const params = [firstName, lastName, results.roleId];
                db.query(sql_insert_employee, params, (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${firstName} ${lastName} to the database`);
                  promptUser();
                })
              })
          })
        })  
    })
  })
}

const updateEmployeeRole = () => {
  getEmployeeNames()
  .then(([rows]) => {
    let employeesArray = [];
    rows.forEach(row => {
      employeesArray.push(row.name);
    })
  getRoleTitles()
    .then(([rows]) => {
      let roleArray = [];
      rows.forEach(row => {
        roleArray.push(row.title);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee would you like to update?",
          choices: employeesArray
        },
        {
          type: "list",
          name: "roleId",
          message: "Pick the selected employee's new role:",
          choices: roleArray
        }
      ])
      .then(results => {
        getEmployeeByName(results.employeeId)
          .then(([employees]) => {
            results.employeeId = employees[0].id;
          const sql_new_role_id = `
            SELECT role.id, role.title as title
            FROM role
            WHERE role.title = ?`;
              db.promise().query(sql_new_role_id, results.roleId)
                .then(([roles]) => {
                  results.roleId = roles[0].id;
                  const sql_update_employee_role = `
                    UPDATE employee SET role_id = ? WHERE id = ?`;
                  const params = [results.roleId, results.employeeId];
                  db.query(sql_update_employee_role, params, (err, result) => {
                    if (err) throw err; 
                    console.log(`Updated ${employees[0].name}'s role to ${roles[0].title}`);
                    promptUser();
                  })
                })
            })  
      })
    })
    })
}



const updateEmployeeManager = () => {
  getEmployeeNames()
    .then(([rows]) => {
      let employeesArray = [];
      rows.forEach(row => {
        employeesArray.push(row.name);
      })
  getEmployeeNames()
    .then(([rows]) => {
      let managerArray = [];
      rows.forEach(row => {
        managerArray.push(row.name);
      }) 
      inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee would you like to update?",
          choices: employeesArray
        },
        {
          type: "list",
          name: "managerId",
          message: "Pick the selected employee's new manager:",
          choices: managerArray
        }
      ])
      .then(results => {
        getEmployeeByName(results.employeeId)
          .then(([employees]) => {
            results.employeeId = employees[0].id;
            getEmployeeByName(results.managerId)
              .then(([managers]) => {
                results.managerId = managers[0].id;
                const sql_update_employees_manager = `
                  UPDATE employee SET manager_id = ? WHERE id = ?`;
                const params = [results.managerId, results.employeeId];
                db.query(sql_update_employees_manager, params, (err, result) => {
                  if (err) throw err;
                  console.log(`Updated ${employees[0].name}'s manager to ${managers[0].name}`);
                  promptUser();
                })
              })
          })
      })
  })
  })
}

const viewEmployeesByDepartment = () => {
  getDepartmentNames()
    .then(([rows]) => {
      let departmentArray = [];
      rows.forEach(row => {
        departmentArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select a department to view employees:",
          choices: departmentArray
        }
      ])
      .then(results => {
        getDepartmentByName(results.departmentId)
          .then(([departments]) => {
            results.departmentId = departments[0].id;
            const sql = `
              SELECT department.name AS department, CONCAT(employee.first_name, " ", employee.last_name) AS employee
              FROM employee
              LEFT JOIN role ON employee.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              WHERE department.id = ?`;
            const params = [results.departmentId];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log(" ");
              console.table(result);
              promptUser();
            })
          })
      })
    })
}

const viewEmployeesByManager = () => {
  getEmployeeNames()
    .then(([rows]) => {
      let managerArray = [];
      rows.forEach(row => {
        managerArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "managerId",
          message: "Select a manager to view employees:",
          choices: managerArray
        }
      ])
      .then(results => {
        const sql_manager_id = `
          SELECT employee.id
          FROM employee
          WHERE CONCAT(employee.first_name, " ", employee.last_name) = ?`;
        db.promise().query(sql_manager_id, results.managerId)
          .then(([managers]) => {
            results.managerId = managers[0].id;
            const sql = `
              SELECT CONCAT(manager.first_name, " ", manager.last_name) AS manager, CONCAT(employee.first_name, " ", employee.last_name) AS employee
              FROM employee
              LEFT JOIN employee AS manager ON employee.manager_id = manager.id
              WHERE manager.id = ?`;
            const params = [results.managerId];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log(" ");
              console.table(result);
              promptUser();
            })
          })
      })
    })
}

const removeEmployee = () => {
  getEmployeeNames()
    .then(([rows]) => {
      let employeesArray = [];
      rows.forEach(row => {
        employeesArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee you want to delete:",
          choices: employeesArray
        }
      ])
      .then(results => {
        getEmployeeByName(results.employeeId)
          .then(([employees]) => {
            results.employeeId = employees[0].id;
            const sql_delete_employee = `
              DELETE FROM employee WHERE id = ?`;
            const params = [results.employeeId];
            db.query(sql_delete_employee, params, (err, result) => {
              if (err) throw err;
              console.log(`Deleted ${employees[0].name} from database.`);
              promptUser();
            })
          })
    })
  })
}

const removeDepartment = () => {
  getDepartmentNames()
    .then(([rows]) => {
      let departmentArray = [];
      rows.forEach(row => {
        departmentArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select the department you want to delete:",
          choices: departmentArray
        }
      ])
      .then(results => {
        getDepartmentByName(results.departmentId)
          .then(([departments]) => {
            results.departmentId = departments[0].id;
            const sql_delete_department = `
              DELETE FROM department WHERE id = ?`;
            const params = [results.departmentId];
            db.query(sql_delete_department, params, (err, result) => {
              if (err) throw err;
              console.log(`Deleted ${departments[0].name} from database.`);
              promptUser();
            })
          })
      })
    })
}

const removeRole = () => {
  const sql = `
    SELECT role.title
    FROM role`;
  db.promise().query(sql)
    .then(([rows]) => {
      let roleArray = [];
      rows.forEach(row => {
        roleArray.push(row.title)
      })
      inquirer.prompt([
        {
          type: "list",
          name: "roleId",
          message: "Select the role you want to delete:",
          choices: roleArray
        }
      ])
      .then(results => {
        const sql_role_id = `
          SELECT role.id, role.title
          FROM role
          WHERE role.title = ?`;
        db.promise().query(sql_role_id, results.roleId)
          .then(([roles]) => {
            results.roleId = roles[0].id;
            const sql_delete_role = `
              DELETE FROM role WHERE id = ?`;
            const params = [results.roleId];
            db.query(sql_delete_role, params, (err, result) => {
              if (err) throw err;
              console.log(`Deleted ${roles[0].title} from database.`);
              promptUser();
            })
          })
      })
    })
}

const viewTotalUtilizedDeptBudget = () => {
  getDepartmentNames()
    .then(([rows]) => {
      let departmentArray = [];
      rows.forEach(row => {
        departmentArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select a department to see the utilized budget:",
          choices: departmentArray
        }
      ])
      .then(results => {
        getDepartmentByName(results.departmentId)
          .then(([departments]) => {
            results.departmentId = departments[0].id;
            const sql_utilized_budgets = `
              SELECT department.name AS department, SUM(role.salary) AS 'utilized budget'
              FROM employee
              LEFT JOIN role ON employee.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              WHERE department.id = ?
              GROUP BY department.name`;
            const params = [results.departmentId];
            db.query(sql_utilized_budgets, params, (err, result) => {
              if (err) throw err;
              console.log(" ");
              console.table(result);
              promptUser();
            })
          })
        })
      })  
}

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "pickOption",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Remove Employee",
        "Remove Department",
        "Remove Role",
        "View Total Utilized Budget of a Department",
        "Quit"
      ] 
    }
  ])
  .then(userChoice => {
    let answer = userChoice.pickOption;
    if (answer === "View All Departments") {
      viewAllDepartments();
    }
    
    if (answer === "View All Roles") {
      viewAllRoles();
    }

    if (answer === "View All Employees") {
      viewAllEmployees();
    }
    
    if (answer === "Add Department") {
      addDepartment();
    }

    if (answer === "Add Role") {
      addRole();
    }

    if (answer === "Add Employee") {
      addEmployee();
    }

    if (answer === "Update Employee Role") {
      updateEmployeeRole();
    }

    if (answer === "Update Employee Manager") {
      updateEmployeeManager();
    }

    if (answer === "View All Employees by Department") {
      viewEmployeesByDepartment();
    }

    if (answer === "View All Employees by Manager") {
      viewEmployeesByManager();
    }

    if (answer === "Remove Employee") {
      removeEmployee();
    }

    if (answer === "Remove Department") {
      removeDepartment();
    }

    if (answer === "Remove Role") {
      removeRole();
    }

    if (answer === "View Total Utilized Budget of a Department") {
      viewTotalUtilizedDeptBudget();
    }

    if (answer === "Quit") {
      db.end();
    }
  })
}
