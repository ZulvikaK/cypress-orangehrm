/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/commands.ts

// cypress/support/commands.ts

// cypress/support/commands.ts

// 1. Deklarasi tipe sebagai modul
export {}; // Ini membuat file menjadi modul ES

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> { // Perhatikan generic type ditambahkan
      /**
       * Custom login command
       * @param userKey - Predefined user key ('validUser' | 'invalidUser')
       * @param options - Configuration options
       * @example
       * cy.login()
       * cy.login('invalidUser', { validateLogin: false })
       */
      login(
        userKey?: 'validUser' | 'invalidUser',
        options?: { validateLogin: boolean }
      ): Chainable<Subject>; // Menggunakan generic type
    }
  }
}

// 2. Implementasi command
Cypress.Commands.add('login', (userKey = 'validUser', options = { validateLogin: true }) => {
  cy.fixture('users').then((users) => {
    const user = users[userKey];

    if (!user) {
      throw new Error(`User with key "${userKey}" not found in fixtures`);
    }

    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password, { log: false });
    cy.get('button[type="submit"]').click();

    if (options.validateLogin) {
      if (userKey === 'validUser') {
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
        cy.get('.oxd-topbar-header-breadcrumb')
          .should('be.visible')
          .and('contain', 'Dashboard');
      } else {
        cy.get('.oxd-alert-content')
          .should('be.visible')
          .and('contain', 'Invalid credentials');
      }
    }
  });
});
