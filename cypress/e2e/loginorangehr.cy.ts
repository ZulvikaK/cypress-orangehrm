/// <reference types="cypress" />

describe('OrangeHRM Login Tests', () => {
  const WAIT_TIMEOUT = { timeout: 10000 };

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Cannot read properties of undefined')) {
        return false;
      }
      return true;
    });
  });

  context('Positive Tests', () => {
    it('should redirect to dashboard after successful login', () => {
      cy.login();
      cy.url().should('include', '/dashboard');
      cy.screenshot('dashboard-after-login');
    });

    it('should display user dropdown with correct interactions', () => {
      cy.login();

      cy.get('.oxd-userdropdown-tab', WAIT_TIMEOUT)
        .should('be.visible')
        .click();

      cy.contains('.oxd-userdropdown-link', 'About')
        .should('be.visible')
        .click();

      cy.get('.oxd-dialog-sheet', WAIT_TIMEOUT)
        .should('be.visible')
        .and('contain', 'OrangeHRM');

      cy.screenshot('about-dialog-visible');
    });
  });

  context('Negative Tests', () => {
    it('should show error for invalid credentials', () => {
      cy.login('invalidUser', { validateLogin: false });

      cy.get('.oxd-alert-content')
        .should('be.visible')
        .and('contain', 'Invalid credentials');

      cy.screenshot('invalid-credentials-error');
    });

    it('should validate required fields', () => {
      cy.visit('/auth/login');
      cy.get('button[type="submit"]').click();

      cy.get('.oxd-input-field-error-message')
        .should('have.length.at.least', 2)
        .each(($el) => {
          cy.wrap($el).should('contain', 'Required');
        });
      
      cy.screenshot('required-fields-validation');
    });

    it('should prevent login with empty password', () => {
      cy.fixture('users').then((users) => {
        cy.visit('/auth/login');
        cy.get('input[name="username"]').type(users.validUser.username);
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
          .should('contain', 'Required');
        
        cy.screenshot('empty-password-error');
      });
    });

    it('Forgot your password link on the login page should work correctly', () => {
        cy.visit('/auth/login');

        cy.contains('Forgot your password?').click();
        cy.url().should('include', '/requestPasswordResetCode');
        cy.get('input[placeholder="Username"][name="username"]').should('be.visible');

        cy.get('button.orangehrm-forgot-password-button--cancel')
          .should('be.visible')
          .and('contain', 'Cancel');

        cy.get('button.orangehrm-forgot-password-button--reset')
          .should('be.visible')
          .and('contain', 'Reset Password');

        cy.get('button.orangehrm-forgot-password-button--cancel').click();

        cy.url().should('include', '/auth/login');
      });

    it('Verify all hyperlinks on the Login Page are not broken', () => {
      const EXCLUDED_DOMAINS = ['facebook.com', 'x.com', 'twitter.com'];

      cy.visit('/auth/login');

      cy.get('a').each($el => {
        const href = $el.prop('href');

        if (
          href &&
          href.startsWith('http') &&
          !EXCLUDED_DOMAINS.some(domain => href.includes(domain))
        ) {
          cy.request({
            url: href,
            failOnStatusCode: false,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
          }).then((response) => {
            cy.log(`Checked ${href} - status: ${response.status}`);
            expect(response.status, `Broken link: ${href}`).to.be.lt(400);
          });
        } else {
          cy.log(`⚠️ Skipped check for ${href}`);
    }
  });
});

    });
  });

