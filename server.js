const inquirer = require("inquirer");
const db = require("./config/connection");
const cTable = require('console.table');

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});

const viewAllEmployees = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log("------------------------------------------");
    console.table(result);
    promptUser();
  });
}

const viewAllRoles = () => {
  const sql = `
    SELECT role.id, role.title AS role, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`;
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
    
  })
}

// async function viewAllEmployees()


  

