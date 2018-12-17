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
const SendChameleonMessage = require( '../../src/slack' );
const { GetTemplateFromURL, QueryToHexString } = require( '../../src/slack' );


/**
 * SendChameleonMessage tests
 */
// Describe( 'SendChameleonMessage()', () => {



// });


/**
 * QueryToHexString tests
 */
Describe( 'QueryToHexString()', () => {
	It( 'Should return the correct string given a valid request query', ( done ) => {
		const query = {
			action:     'purple',
			background: 'red',
		};
		Expect( QueryToHexString( query ) ).to.equal( '`action`: #800080\n`background`: #FF0000\n' );
		done();
	});

	It( 'Should return "the default palette." given empty request query', ( done ) => {
		Expect( QueryToHexString({}) ).to.equal( '' );
		done();
	});
});


/**
 * GetTemplateFromURL tests
 */
Describe( 'GetTemplateFromURL()', () => {
	It( 'Should return the homepage template when requesting /chameleon', ( done ) => {
		Expect( GetTemplateFromURL( '/chameleon' ) ).to.equal( 'homepage' );
		done();
	});

	It( 'Should return the homepage template when requesting /chameleon/', ( done ) => {
		Expect( GetTemplateFromURL( '/chameleon/' ) ).to.equal( 'homepage' );
		done();
	});

	It( 'Should return the basic template when requesting /chameleon/basic', ( done ) => {
		Expect( GetTemplateFromURL( '/chameleon/basic' ) ).to.equal( 'basic' );
		done();
	});
});
