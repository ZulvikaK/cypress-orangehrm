describe('Admin - Add New User', () => {
  it('should login and add a new user', () => {
    cy.login('validUser');
    cy.screenshot('01-dashboard');

    cy.contains('span', 'Admin').click();
    cy.url().should('include', '/admin/viewSystemUsers');
    cy.screenshot('02-admin-page');


    cy.get('button').contains('Add').click();
    cy.contains('h6', 'Add User').should('be.visible');
    cy.screenshot('03-add-user-form');

    // 1. Pilih User Role: Admin
    cy.get('.oxd-select-text').eq(0).click();
    cy.contains('.oxd-select-dropdown > *', 'Admin').click();

    // 2. Isi Employee Name
    cy.get('.oxd-autocomplete-text-input > input')
      .type('Naomi Lehner', { delay: 100 });

    cy.get('.oxd-autocomplete-dropdown')
      .should('be.visible')
      .find('div[role="option"]')
      .contains('Naomi Lehner')
      .click();

    // 3. Pilih Status: Enabled
    cy.get('.oxd-select-text').eq(1).click();
    cy.contains('.oxd-select-dropdown > *', 'Enabled').click();

    // 4. Isi Username: AgusSujono123
    cy.get('input').eq(2).type('AgusSujono1234');

    // 5. Isi Password
    cy.get('input[type="password"]').eq(0).type('AdminSujonoTes98##');

    // 6. Isi Confirm Password
    cy.get('input[type="password"]').eq(1).type('AdminSujonoTes98##');
    cy.screenshot('04-filled-form');

    // 7. Klik tombol Save
    cy.get('button[type="submit"]').contains('Save').click();

    // Verifikasi redirect atau notifikasi sukses
    cy.get('.oxd-toast').should('contain', 'Success');
    cy.screenshot('05-user-added-success');
  });

});
