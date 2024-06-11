describe('Main app', () => {

    beforeEach(() => {
        cy.intercept('GET', 'https://www.swapi.tech/api/people', {
            delay: 2000,
            fixture: "people.json"
        }).as('peoplePrefetch')
        cy.intercept('GET', 'https://www.swapi.tech/api/starships', {fixture: "starships.json"}).as('starshipsPrefetch')
        cy.visit('/')
    });

    it('should visits the initial project page and wait for prefetch', () => {
        cy.contains('Fetching data...')
        cy.wait(['@peoplePrefetch', '@starshipsPrefetch']).then(() => {
            cy.get('h1', {timeout: 5000}).should('contain', 'Press Play to start')
        })
    });

    it('should change application mode', () => {
        cy.get('mat-slide-toggle button').should('exist').and('have.attr', 'aria-checked', 'false').click();
        cy.get('mat-slide-toggle button').should('exist').and('have.attr', 'aria-checked', 'true').click();
        cy.get('mat-slide-toggle button').should('exist').and('have.attr', 'aria-checked', 'false')
    });

    describe('Gameplay ', () => {

        beforeEach(() => {
            interceptCardsRequests();
            cy.wait(['@peoplePrefetch', '@starshipsPrefetch']).then(() => {
                cy.get('button#play').should('exist').and('not.be.disabled').click();
            })
        });

        it('should render cards', () => {
            renderCards()
        });

        it('should update points', () => {
            testCounter(1);
        });

        it('should repeat duel on play button click', () => {
            renderCards()
            interceptCardsRequests();
            cy.get('button#play').should('exist').and('not.be.disabled').click();
            renderCards();
            testCounter(2)
        });
    })

    describe('Draw ', () => {
        it('should display draw', () => {
            cy.intercept({method: 'GET', url: 'https://www.swapi.tech/api/people/*', times: 2}, {
                delay: 2000,
                fixture: "personCardTwo.json"
            }).as('cardTwo')
            cy.get('button#play').should('exist').and('not.be.disabled').click();
            cy.wait('@cardTwo').then(() => {
                cy.get('mat-spinner').should('not.exist');
                testDrawCards();
                cy.get(`app-card p:contains('WINNER')`).should('have.length', 2).and('exist')
            })
        });
    })
})

function renderCards() {
    cy.get('mat-spinner').should('exist');
    cy.wait(['@cardOne', '@cardTwo'], {timeout: 5000}).then(() => {
        cy.get('mat-spinner').should('not.exist');
        testCard(0);
        cy.get(`app-card p:contains('WINNER')`).should('have.length', 1).and('exist')
    })
}

function testCard(cardIndex: number) {
    cy.get('app-card').should('have.length', 2).and('exist')
    cy.get('app-card').eq(cardIndex).within(() => {
        cy.get('mat-card').should('be.visible').and('have.class', 'winner')
        cy.get('mat-card-title').should('be.visible').and('contain', 'Obi-Wan Kenobi');
        cy.get('mat-card-subtitle').should('be.visible').and('contain', 'Mass: 77');
        cy.get(`p:contains('A person within the Star Wars universe')`).should('be.visible');
        cy.get('app-card-detail').should('have.length', 6).and('be.visible').and('not.be.empty');
    })
}

function testDrawCards() {
    cy.get('app-card').should('have.length', 2).and('exist')
    testCard(0);
    testCard(1);
}

function interceptCardsRequests() {
    cy.intercept({method: 'GET', url: 'https://www.swapi.tech/api/people/*', times: 1}, {
        fixture: "personCardOne.json"
    }).as('cardOne')
    cy.intercept({method: 'GET', url: 'https://www.swapi.tech/api/people/*', times: 1}, {
        delay: 2000,
        fixture: "personCardTwo.json"
    }).as('cardTwo')
}

function testCounter(iteration: number) {
    cy.get('app-counter').should('exist')
    cy.get(`app-counter p:contains('${iteration}')`).should('have.length', 1).and('exist');
    cy.get(`app-counter p:contains('0')`).should('have.length', 1).and('exist');
}


