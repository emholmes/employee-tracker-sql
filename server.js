const inquirer = require("inquirer");
const db = require("./config/connection");
const cTable = require('console.table');

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});

const viewAllEmployees = () => {
  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log("------------------------------------------");
    console.table(result);
    promptUser();
  });
}

const viewAllRoles = () => {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log("------------------------------------------");
    console.table(result);
    promptUser();
  });
}

const viewAllDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log("------------------------------------------");
    console.table(result);
    promptUser();
  });
}

const addDepartment = (userChoice) => {
  const sql =  `INSERT INTO departments (name) VALUES (?)`;
  const departmentName = userChoice.newDepartment;
  db.query(sql, departmentName, (err, result) => {
    if (err) throw err; 
    console.log(`Added ${departmentName} to the database`);
    promptUser();
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
    },
    {
      type: "input",
      name: "newDepartment",
      message: "What is the name of the department to add?",
      when: ({pickOption}) => {
        if (pickOption === "Add Department") {
          return true;
        } else {
          return false;
        }
      }
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
      addDepartment(userChoice);
    }
    
  })
}

// async function viewAllEmployees()


  

