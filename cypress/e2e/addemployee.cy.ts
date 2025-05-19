import dayjs from 'dayjs';

describe('Positive Case: Add Employee on OrangeHRM', () => {
  it('should log in using custom command and add a new employee with personal details', () => {
    cy.login('validUser');
    cy.screenshot('Positive/01_Login');

    cy.get('a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.url().should('include', '/pim/viewEmployeeList');
    cy.screenshot('Positive/02_OpenEmployeeList');

    cy.get('button').contains('Add').click();
    cy.url().should('include', '/pim/addEmployee');
    cy.screenshot('Positive/03_OpenAddPage');

    const uniqueId = `EMP${Date.now().toString().slice(-6)}`;

    cy.get('input[name="firstName"]').type('Ariel');
    cy.get('input[name="middleName"]').type('Tatum');
    cy.get('input[name="lastName"]').type('Devi');
    cy.get('.orangehrm-employee-form input').eq(3).clear().type(uniqueId);
    cy.screenshot('Positive/04_FillBasicData');

    cy.get('button[type="submit"]').contains('Save').click();
    cy.url().should('include', '/pim/viewPersonalDetails');
    cy.contains('Personal Details').should('be.visible');
    cy.screenshot('Positive/05_AfterSave');

    cy.get('input[name="firstName"]').should('have.value', 'Ariel');
    cy.get('input[name="lastName"]').should('have.value', 'Devi');
    cy.contains('Employee Id')
      .parent()
      .siblings('div')
      .find('input')
      .should('have.value', uniqueId);
    cy.screenshot('Positive/06_ValidateNameID');

    cy.get('input.oxd-input--active').eq(2).type('DLN1234567');
    cy.get('.oxd-icon.bi-calendar').eq(0).click();
    cy.get('input[placeholder="yyyy-dd-mm"]').eq(1).should('exist').type('2025-11-17', { force: true });
    cy.screenshot('Positive/07_FillLicense');

    cy.get('.oxd-select-text-input').eq(0).click();
    cy.get('.oxd-select-dropdown').contains('Indonesian').click();
    cy.get('.oxd-select-text-input').eq(1).click();
    cy.get('.oxd-select-dropdown').contains('Single').click();

    const birthDate = dayjs().subtract(25, 'year').format('YYYY-MM-DD');
    cy.get('input[placeholder="yyyy-dd-mm"]').eq(1).type(birthDate);
    cy.get('input[type="radio"][value="2"]').check({ force: true });
    cy.screenshot('Positive/08_FillDemographics');

    cy.get('button[type="submit"]').contains('Save').click();
    cy.screenshot('Positive/09_FinalSave');
  });
});

describe('Negative Case: Add Employee with Long Employee ID', () => {
  it('should show validation error when Employee ID exceeds 10 characters', () => {
    cy.login('validUser');
    cy.screenshot('Negative_LongID/01_Login');

    cy.get('a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.url().should('include', '/pim/viewEmployeeList');
    cy.get('button').contains('Add').click();
    cy.url().should('include', '/pim/addEmployee');
    cy.screenshot('Negative_LongID/02_OpenAddPage');

    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="middleName"]').type('Negative');
    cy.get('input[name="lastName"]').type('Case');

    const longId = 'EMP1234567890';
    cy.get('.orangehrm-employee-form input').eq(3).clear().type(longId);
    cy.screenshot('Negative_LongID/03_FillLongID');

    cy.get('button[type="submit"]').contains('Save').click();
    cy.get('.oxd-input-group .oxd-input-group__message')
      .should('be.visible')
      .and('contain', 'Should not exceed 10 characters');
    cy.screenshot('Negative_LongID/04_ValidationError');
  });
});

describe('Negative Case: Add Employee with Required Fields Empty', () => {
  beforeEach(() => {
    cy.login('validUser');
    cy.get('a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.url().should('include', '/pim/viewEmployeeList');
    cy.get('button').contains('Add').click();
    cy.url().should('include', '/pim/addEmployee');
    cy.screenshot('Negative_EmptyFields/00_OpenAddPage');
  });

  it('should show "Required" error when First Name is empty', () => {
    cy.get('input[name="middleName"]').type('Test');
    cy.get('input[name="lastName"]').type('Case');
    cy.screenshot('Negative_EmptyFields/01_EmptyFirstName');

    cy.get('button[type="submit"]').contains('Save').click();
    cy.get('.oxd-input-group__message').should('be.visible').and('contain', 'Required');
    cy.screenshot('Negative_EmptyFields/02_RequiredErrorFirstName');
  });

  it('should show "Required" error when Last Name is empty', () => {
    cy.get('input[name="firstName"]').type('Zulvika');
    cy.get('input[name="middleName"]').type('Test');
    cy.screenshot('Negative_EmptyFields/03_EmptyLastName');

    cy.get('button[type="submit"]').contains('Save').click();
    cy.get('.oxd-input-group__message').should('be.visible').and('contain', 'Required');
    cy.screenshot('Negative_EmptyFields/04_RequiredErrorLastName');
  });

  it('should show "Required" errors when both First Name and Last Name are empty', () => {
    cy.screenshot('Negative_EmptyFields/05_EmptyAll');

    cy.get('button[type="submit"]').contains('Save').click();
    cy.get('.oxd-input-group__message')
      .should('have.length.at.least', 2)
      .each(($el) => {
        cy.wrap($el).should('contain', 'Required');
      });
    cy.screenshot('Negative_EmptyFields/06_RequiredErrorAll');
  });
});
