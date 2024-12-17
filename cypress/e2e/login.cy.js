describe('Login Tests', () => {
    it('should successfully log in with valid credentials', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('valid@example.com');
        cy.get('input[name="password"]').type('ValidPassword123.');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', 'http://localhost:3000/');
    });

    it('should show an error message for invalid credentials', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('invalidUser');
        cy.get('input[name="password"]').type('invalidPassword');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/login');
    });
    it('should show an error message for empty fields', () => {
        cy.visit('/login');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/login');
    });
});