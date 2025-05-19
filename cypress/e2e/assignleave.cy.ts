describe('Assign Leave on OrangeHRM', () => {
  it('should assign leave to an employee', () => {
    // 1. Login menggunakan custom command
    cy.login('validUser');

    // 2. Klik menu Leave
    cy.get('.oxd-main-menu-item')
    .contains('Leave')
    .click();

    // 3. Klik tab Assign Leave lewat dropdown More
    cy.get('.oxd-topbar-body-nav-tab-item').contains('More').click(); // buka dropdown
    cy.get('.oxd-topbar-body-nav-tab-link.--more').contains('Assign Leave').click(); // klik item dropdown

    // 4. Validasi sudah di halaman Assign Leave
    cy.contains('h6', 'Assign Leave').should('be.visible');
    cy.screenshot('Positive/01_assign-leave-page-loaded');

    // 5. Isi Employee Name (gunakan delay agar dropdown muncul)
    cy.get('.oxd-autocomplete-text-input > input')
      .type('Fabian Harber', { delay: 100 });

    cy.get('.oxd-autocomplete-dropdown')
      .should('be.visible')
      .find('div[role="option"]')
      .contains('Fabian Harber')
      .click();
    
    cy.screenshot('Positive/02_employee-selected')

    // 6. Pilih Leave Type: CAN - Personal
    cy.get('.oxd-select-text').eq(0).click();
    cy.get('.oxd-select-dropdown').contains('CAN - Personal').click();

    // Tunggu field tanggal muncul (recommended)
    cy.get('input[placeholder="yyyy-mm-dd"]', { timeout: 10000 }).should('have.length.at.least', 2);

    // Isi tanggal From dan To
    cy.get('input[placeholder="yyyy-mm-dd"]').eq(0)
      .clear()
      .type('2025-06-18', { delay: 100 });

    cy.get('input[placeholder="yyyy-mm-dd"]').eq(1)
      .clear()
      .type('2025-06-19', { delay: 100 });

    cy.contains('Close').click();
    cy.wait(500); // kasih waktu animasi selesai
    cy.get('textarea.oxd-textarea').type('Ada keperluan keluarga');
    cy.screenshot('Positive/03_before-assign-click');

    // 9. Klik tombol Assign
    cy.get('button[type="submit"]').contains('Assign').click();

    // Assert modal judul & pesan
    cy.contains('Confirm Leave Assignment').should('be.visible');
    cy.contains('Employee does not have sufficient leave balance for leave request. Click OK to confirm leave assignment.')
      .should('be.visible');
    cy.screenshot('Positive/04_confirm-modal');

    // Klik tombol "Ok" pada modal
    cy.get('.oxd-button--secondary').contains('Ok').click();

    // Assert pop-up / toast Success muncul
    cy.contains('Success').should('be.visible');
    cy.screenshot('Positive/05_success-toast');

  });
});
