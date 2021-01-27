const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");


// Write code to use inquirer to gather information about the development team members


const buildTeam = async (employees = []) =>{
    const prompts =[
        {
            type: "list",
            name: "role",
            message: "What is the employee's role within the company?",
            choices: ['Intern', 'Engineer', 'Manager']
        },
        {
            type: "input",
            name: "name",
            message: "What is the employee's name?"
        },
        {
            type: "input",
            name: "id",
            message: "What is the employee's ID number?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the employee's email?"
        },
        {
            type: "input",
            name: "school",
            message: (answers) => `What is the ${answers.role}'s school name?`,
            when: (answers) => answers.role === 'Intern'
        },
        {
            type: "input",
            name: "github",
            message: (answers) => `What is the ${answers.role}'s Github username?`,
            when: (answers) => answers.role === 'Engineer'
        },
        {
            type: "input",
            name: "officeNumber",
            message: (answers) => `What is the ${answers.role}'s office number?`,
            when: (answers) => answers.role === 'Manager'
        }, 
        {
            type: 'confirm',
            name: 'addAnother',
            message: 'Add another employee?',
            default: true
        }
    ];
    // referenced http://www.penandpaperprogrammer.com/blog/2018/12/16/repeating-questions-with-inquirerjs 
    // referenced matthayden09
    const { addAnother, ...answers } = await inquirer.prompt(prompts);
    const newEmployees = [...employees, answers];
    return addAnother ? employeeData(newEmployees) : newEmployees;
};

const results = async () => {
    const employees = await buildTeam();
    console.log(employees)

    let constructed = employees.map(value => {

        switch (value.role) {
            case 'Intern': return new Intern(value.name, value.role, value.email, value.id, value.school)
                break;
            case 'Engineer': return new Engineer(value.name, value.role, value.email, value.id, value.github)
                break;
            case 'Manager': return new Manager(value.name, value.role, value.email, value.id, value.officeNumber)
        }
    })

    const createHtml = render(constructed)
    console.log(createHtml)
    fs.writeFile(outputPath, createHtml, function (err) {
        if (err) throw err;
    })
};
results();

