/**
 * style.spec.js - Unit tests for style.js
 */


// Dependencies
const Chai = require( 'chai' );
const Mocha = require( 'mocha' );

// Functions from Chai and Mocha
const Expect = Chai.expect;
const Describe = Mocha.describe;
const It = Mocha.it;


// Local dependencies
const CreateStyles = require( '../../src/style' );
const { Autoprefix } = require( '../../src/style' );


/**
 * CreateStyles tests
 */
Describe( 'CreateStyles()', () => {
	It( 'Given a valid query and variable map the styles should change the sass', async () => {
		const sass = 'body {  background-color: $AU-color-action; }';
		const { styles } = await CreateStyles(
			{ action: '#f00' },
			sass,
			{ action: '$AU-color-action' },
		);

		Expect( styles ).to.equal( '<style>body{background-color:red}\n</style>' );
	});


	It( 'With no query styles or map it should return undefined', async () => {
		const { styles } = await CreateStyles({}, '', {});

		Expect( styles ).to.equal( undefined );
	});


	It( 'When given broken sass, it should throw an error', async () => {
		try {
			await CreateStyles({ a: '#a' }, 'body { broken }', { a: '$a' });
		}
		catch( error ) {
			Expect( error.message ).to.equal( 'property "broken" must be followed by a \':\'' );
		}
	});


	It( 'When given an invalid color, it should add to the errors array', async () => {
		const sass = 'body {  background-color: red}';
		const { styles, errors } = await CreateStyles({ action: '#cabbage' }, sass, { action: '$AU-color-action' });
		Expect( errors[ 0 ] ).to.equal( 'Invalid colour #cabbage for $AU-color-action' );
		Expect( styles ).to.equal( '<style>body{background-color:red}\n</style>' );
	});


	It( 'When given multiple invalid colors, it should return an array with all the errors.', async () => {
		const sass = 'body {  background-color: $AU-color-action; }';
		const { errors } = await CreateStyles(
			{ action: '#f00', background: '#yoik%', focus: '#yonk%s' },
			sass,
			{ action: '$AU-color-action', background: '$AU-color-background', focus: '$AU-color-focus' },
		);

		Expect( errors.length ).to.equal( 2 );
	});


	It( 'When given multiple valid colors, it should return valid CSS for all of them.', async () => {
		const sass = 'body { background-color: $AU-color-action; color: $AU-color-background; }';
		const { styles } = await CreateStyles(
			{ action: '#f00', background: 'green' },
			sass,
			{ action: '$AU-color-action', background: '$AU-color-background' },
		);

		Expect( styles ).to.equal( '<style>body{background-color:red;color:green}\n</style>' );
	});
});


/**
 * Autoprefixer test
 */
Describe( 'Autoprefixer()', () => {
	It( 'CSS without prefixes should be prefixed', async () => {

		const prefixedCss = 'body { -webkit-box-shadow: 3px; box-shadow: 3px; }';
		const css = await Autoprefix( 'body { box-shadow: 3px; }' );

		Expect( css ).to.equal( prefixedCss );
	});
});
