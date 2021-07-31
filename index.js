const inquirer = require("inquirer");
const db = require("./config/connection");

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.")
});


const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "pickOption",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remvoe Employee",
        "Update Employee Role",
        "Update Employee Manager", 
        "Quit"
      ] 
    }
  ])
}

async function viewAllEmployees()

promptUser()
  .then(userPick => {
    if (userPick === "View all Employees") {
      viewAllEmployees();
    }
    console.log(userPick);
  })

