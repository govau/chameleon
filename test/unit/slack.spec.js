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
		const url = '/chameleon/form/';
		const message = GenerateChameleonMessage( url, query );

		let fixture = '---\n_Karma-Karma-Karma-Chameleon!_\n\nGenerating *form* page template\n\n';
		fixture += '`action`: #800080\n`background`: #FF0000\n';

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
		Expect( QueryToHexString( query ) ).to.equal( '`action`: #800080\n`background`: #FF0000\n' );
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

	It( 'Should return the basic template when requesting /chameleon/basic', () => {
		Expect( GetTemplateFromURL( '/chameleon/basic' ) ).to.equal( 'basic' );
	});

	It( 'Should return the basic template when requesting /chameleon/basic/', () => {
		Expect( GetTemplateFromURL( '/chameleon/basic/' ) ).to.equal( 'basic' );
	});
});
