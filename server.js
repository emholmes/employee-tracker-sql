const inquirer = require("inquirer");
const db = require("./config/connection");

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});


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
  .then(userPick => {
    if (userPick === "View all Employees") {
      viewAllEmployees();
    }
    console.log(userPick);
  })
}

// async function viewAllEmployees()


  

