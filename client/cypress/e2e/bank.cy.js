/// <reference types="cypress" />
describe('Игра в пары', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it(`Авторизация.
      Возможность просмотреть список счетов.
      Создание нового счета.`, () => {

    cy.get('input[name="login"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('button').click();
    cy.get('.account-card').should('be.visible');

    cy.get('.main').children('.account-card').its('length').then((length) => {
      cy.get('button.info-section__btn').click();
      cy.get('.main').children('.account-card').should('have.length', length + 1);
    });
  });

  it(`Перевод из исходного счета в новый.
      Перевод из нового счета в исходный`, () => {
      cy.get('[name="login"]').type('developer');
      cy.get('[name="password"]').type('skillbox');
      cy.get('button').click();

      cy.get('.account-card').last().find('.account-card__number').invoke('text').then((text) => {
        cy.get('.account-card').first().find('button').click();
        cy.get('input[name="sender"]').type(text);
        cy.get('input[name="amount"]').type('100');
        cy.get('.transaction__btn').click();
        cy.get('.info-section__btn').click();
        cy.get('.account-card').last().find('.account-card__balance').should('have.text', '100 ₽');
      });

      cy.get('.account-card').first().find('.account-card__number').invoke('text').then((number) => {
        cy.get('.account-card').last().find('.account-card__number').invoke('text').then((sender) => {
          cy.get('.account-card').last().find('button').click();
          cy.get('input[name="sender"]').type(number).click();
          cy.get('input[name="amount"]').type('100');
          cy.get('.transaction__btn').click();
          cy.get('.info-section__btn').click();
          cy.get('.account-card').first().find('button').click();
          cy.get('.table__col-sum.buy').contains('+ 100 ₽').parents('tr').find('.table__col-sender').should('have.text', sender);
        });
      });
  });
});
