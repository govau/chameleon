/**
 * index.spec.js - Unit tests for index.js
 */


// Dependencies
const Chai = require( 'chai' );
const Mocha = require( 'mocha' );
const Fs = require( 'fs' );

// Functions from Chai and Mocha
const Expect = Chai.expect;
const Describe = Mocha.describe;
const It = Mocha.it;


// Local dependencies
const CreateStyles = require( '../../src/style' );
const GenerateHTML = require( '../../src/html' );
const { Autoprefix } = require( '../../src/style' );
const { ColorMapToString, ParseRequestPath} = require( '../../src/slack' );

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
		catch( error ){
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
		const sass = 'body {  background-color: $AU-color-action; color: $AU-color-background; } h1 { color: $AU-color-focus; }';
		const { styles } = await CreateStyles(
			{ action: '#f00', background: 'green', focus: 'pink' },
			sass,
			{ action: '$AU-color-action', background: '$AU-color-background', focus: '$AU-color-focus' },
		);

		Expect( styles ).to.equal( '<style>body{background-color:red;color:green}h1{color:pink}\n</style>' );
	});
});


/**
 * GenerateHTML tests
 */
Describe( 'GenerateHTML()', () => {
	It( 'It should generate a HTML file with custom styles given valid data', async () => {
		const html = await GenerateHTML(
			'/zerella',
			{ action: 'red' },
			'/zerella', 'test/unit/fixtures',
			{
				data:      'body { background: $AU-action; }',
				variables: { action: '$AU-action' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/fixture-background-red.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
	});


	It( 'It should generate a HTML page with an alert when gvien an invalid color', async () => {
		const html = await GenerateHTML(
			'/zerella',
			{ action: '#cabbage' },
			'/zerella',
			'test/unit/fixtures',
			{
				data:      'body { background: $AU-action; }',
				variables: { action: '$AU-action' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/fixture-error.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
	});


	It( 'It should update styles for valid colours and add errors to page alerts', async () => {
		const html = await GenerateHTML(
			'/zerella',
			{ action: 'red', text: '#cabbage' },
			'/zerella',
			'test/unit/fixtures',
			{
				data:      'body { background: $AU-action; }',
				variables: { action: '$AU-action', text: '$AU-text' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/fixture-styles-with-error.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
	});


	It( 'It should escape charaters', async () => {
		const html = await GenerateHTML(
			'/zerella',
			{
				action: '<script>alert("hello world");</script>',
				text:   '<p>yo</p>',
			},
			'/zerella',
			'test/unit/fixtures',
			{
				data:      'body { background: red; }',
				variables: { action: '$AU-action', text: '$AU-text' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/fixture-xss.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
	});

	It( 'It should escape charaters with an advanced XSS query', async () => {
		const html = await GenerateHTML(
			'/zerella',
			{
				action: 'purple</style>.%20<a%20href="https://evil.com"%20target="_blank">Click%20here%20to%20read%20more</a>',
				text:   '<p>yo</p>',
			},
			'/zerella',
			'test/unit/fixtures',
			{
				data:      'body { background: red; }',
				variables: { action: '$AU-action', text: '$AU-text' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/fixture-xss-advanced.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
	});


	It( 'It should return the default template given no query', async () => {
		const html = await GenerateHTML(
			'/zerella',
			{},
			'/zerella',
			'test/unit/fixtures',
			{},
		);

		Expect( html ).to.equal( html );
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


/**
 * Slack tests
 */
Describe( 'ColorMapToString()', () => {
	It( 'Should return the correct string given a valid request query', ( done ) => {
		const expressRequestQuery = {
			action: 'purple',
			background: 'red'
		}
		Expect( ColorMapToString( expressRequestQuery ) ).to.equal( '\n`action`: #800080\n`background`: #FF0000' )
		done();
	});

	It( 'Should return "no colors :(" given empty request query', ( done ) => {
		Expect( ColorMapToString( {} ) ).to.equal( 'no colors :(' )
		done();
	});
});

Describe( 'ParseRequestPath()', () => {
	It( 'Should return the homepage template when requesting /chameleon', ( done ) => {
		Expect( ParseRequestPath( '/chameleon' ) ).to.equal( 'homepage' )
		done();
	});

	It( 'Should return the homepage template when requesting /chameleon/', ( done ) => {
		Expect( ParseRequestPath( '/chameleon/' ) ).to.equal( 'homepage' )
		done();
	});

	It( 'Should return the basic template when requesting /chameleon/basic', ( done ) => {
		Expect( ParseRequestPath( '/chameleon/basic' ) ).to.equal( 'basic' )
		done();
	});
});