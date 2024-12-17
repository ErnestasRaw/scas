describe('Logout Functionality', () => {
    it('should log in and logout successfully', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('valid@example.com');
        cy.get('input[name="password"]').type('ValidPassword123.');
        cy.get('button[type="submit"]').click();
        cy.get('button#logout-button').click();
        cy.url().should('include', '/login');
    });
   
});