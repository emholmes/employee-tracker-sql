const inquirer = require("inquirer");
const db = require("./config/connection");
const cTable = require('console.table');

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});

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
    console.log("------------------------------------------");
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
    console.log(departmentName);
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
  const sql = `
    SELECT department.name
    FROM department`;
  db.promise().query(sql) 
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
        const sql = `
          SELECT department.id
          FROM department
          WHERE department.name = ?`;
        db.promise().query(sql, results.departmentId)
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
    
  })
}

// async function viewAllEmployees()


  

