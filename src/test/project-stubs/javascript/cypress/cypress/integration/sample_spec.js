/**
 * @see https://docs.cypress.io/guides/getting-started/writing-your-first-test#Write-your-first-test
 */
describe("My first test", () => {
  it("Does not do much!", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
    cy.url().should("include", "/commands/actions");
  });
});
