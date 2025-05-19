# Cypress Automation Testing for OrangeHRM

This repository contains automated tests for basic functionality in the OrangeHRM web application, built using [Cypress](https://www.cypress.io/)

## Features Tested
- Login
- Add Admin
- Add Employee
- Assign Leave

## Getting Started
### 1. Clone this repository

```
git clone https://github.com/ZulvikaK/cypress-orangehrm.git
cd cypress-orangehrm
```
### 2. Install dependencies
```npm install```
### 3. Run Cypress
- Open Cypress GUI:
```npx cypress open```

- Run all tests via CLI:
```npx cypress run```

## Test Scenarios
| Test Case           | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `login.cy.js`       | Verifies login functionality with valid credentials  |
| `addAdmin.cy.js`    | Adds a new admin via Admin Management page           |
| `addEmployee.cy.js` | Creates a new employee and verifies detail           |
| `assignLeave.cy.js` | Assigns leave to an employee and confirms the result |

### All test cases are located in cypress/e2e/ folder
Tested on OrangeHRM demo site: ```https://opensource-demo.orangehrmlive.com/```


