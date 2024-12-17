describe('Registration Process', () => {
    it('should register a user with valid credentials', () => {
        cy.visit('/register');
        cy.get('input[name="name"]').type('validUser');
        cy.get('input[name="email"]').type('valid@example.com');
        cy.get('input[name="phone"]').type('+37061234205');
        cy.get('input[name="password"]').type('ValidPassword123.');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/login');
    });

    it('should show an error for invalid email', () => {
        cy.visit('/register');
        cy.get('input[name="name"]').type('invalidUser');
        cy.get('input[name="email"]').type('invalidEmail');
        cy.get('input[name="phone"]').type('+37061234205');
        cy.get('input[name="password"]').type('ValidPassword123.');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/register');
    });
    it('should show an error for invalid number', () => {
        cy.visit('/register');
        cy.get('input[name="name"]').type('invalidUser');
        cy.get('input[name="email"]').type('tarak@tarak.com');
        cy.get('input[name="phone"]').type('370612342');
        cy.get('input[name="password"]').type('ValidPassword123.');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/register');
    });
    it('should show an error for invalid password', () => {
        cy.visit('/register');
        cy.get('input[name="name"]').type('invalidUser');
        cy.get('input[name="email"]').type('tarak@tarak.com');
        cy.get('input[name="phone"]').type('370612342');
        cy.get('input[name="password"]').type('ValidPassword123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/register');
    });
});