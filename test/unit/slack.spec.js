/**
 * slack.spec.js - Unit tests for slack.js
 */


// Dependencies
const Chai = require( 'chai' );
const Mocha = require( 'mocha' );

// Functions from Chai and Mocha
const Expect = Chai.expect;
const Describe = Mocha.describe;
const It = Mocha.it;


// Local dependencies
const {
	GenerateChameleonMessage,
	GetTemplateFromURL,
	QueryToHexString,
} = require( '../../src/slack' );


/**
 * GenerateChameleonMessage tests
 */
Describe( 'GenerateChameleonMessage()', () => {
	It( 'Should create a chameleon message', () => {
		const query = {
			action:     'purple',
			background: 'red',
		};

		const path = '/chameleon/form/';
		const message = GenerateChameleonMessage( path, query );

		let fixture = '> _*Karma-Karma-Karma-Karma-Karma-Chameleon!*_\n\n> Generating *form* page template\n\n';
		fixture += '> `action`: #800080\n> `background`: #FF0000\n';
		fixture += `> https://designsystem.gov.au/templates/form/customise/${ query }`;

		Expect( message ).to.equal( fixture );
	});
});


/**
 * QueryToHexString tests
 */
Describe( 'QueryToHexString()', () => {
	It( 'Should return the correct string given a valid request query', () => {
		const query = {
			action:     'purple',
			background: 'red',
		};
		Expect( QueryToHexString( query ) ).to.equal( '> `action`: #800080\n> `background`: #FF0000\n' );
	});

	It( 'Should return "the default palette." given empty request query', () => {
		Expect( QueryToHexString({}) ).to.equal( '' );
	});
});


/**
 * GetTemplateFromURL tests
 */
Describe( 'GetTemplateFromURL()', () => {
	It( 'Should return the homepage template when requesting /chameleon', () => {
		Expect( GetTemplateFromURL( '/chameleon' ) ).to.equal( 'homepage' );
	});

	It( 'Should return the homepage template when requesting /chameleon/', () => {
		Expect( GetTemplateFromURL( '/chameleon/' ) ).to.equal( 'homepage' );
	});

	It( 'Should return the content template when requesting /chameleon/content', () => {
		Expect( GetTemplateFromURL( '/chameleon/content' ) ).to.equal( 'content' );
	});

	It( 'Should return the content template when requesting /chameleon/content/', () => {
		Expect( GetTemplateFromURL( '/chameleon/content/' ) ).to.equal( 'content' );
	});
});
