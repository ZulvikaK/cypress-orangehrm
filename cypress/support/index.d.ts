// cypress/support/index.d.ts

declare namespace Cypress {
    interface Chainable {
      login(
        userKey?: 'validUser' | 'invalidUser',
        options?: { validateLogin: boolean }
      ): Chainable<void>;
    }
  }