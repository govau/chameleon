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
const { GenerateHTML, CreateStyles } = require( '../../index' );


/**
 * CreateStyles tests
 */
Describe( 'CreateStyles()', () => {
	It( 'Given a valid query and variable map the styles should change the sass', ( done ) => {
		const sass = 'body {  background-color: $AU-color-action; }';
		const { styles } = CreateStyles(
			{ action: '#f00' },
			sass,
			{ action: '$AU-color-action' },
		);

		Expect( styles ).to.equal( '<style>body{background-color:red}\n</style>' );
		done();
	});


	It( 'With no query styles or map it should return undefined', ( done ) => {
		const { styles } = CreateStyles({}, '', {});

		Expect( styles ).to.equal( undefined );
		done();
	});


	It( 'When given broken sass, it should throw an error', ( done ) => {
		Expect( () => CreateStyles({ a: '#a' }, 'body { broken }', { a: '$a' }) )
			.to.throw( 'property "broken" must be followed by a \':\'' );
		done();
	});


	It( 'When given an invalid color, it should add to the errors array', ( done ) => {
		const sass = 'body {  background-color: red}';
		const { styles, errors } = CreateStyles({ action: '#cabbage' }, sass, { action: '$AU-color-action' });
		Expect( errors[ 0 ] ).to.equal( 'Invalid colour #cabbage for $AU-color-action' );
		Expect( styles ).to.equal( '<style>body{background-color:red}\n</style>' );
		done();
	});
});


/**
 * GenerateHTML tests
 */
Describe( 'GenerateHTML()', () => {
	It( 'It should generate a HTML file with custom styles given valid data', ( done ) => {
		const html = GenerateHTML(
			'/zerella/basic',
			{ action: 'red' },
			'/zerella', 'test/unit/fixtures',
			{
				data:      'body { background: $AU-action; }',
				variables: { action: '$AU-action' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/basic/fixture-background-red.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
		done();
	});


	It( 'It should generate a HTML page with an alert when gvien an invalid color', ( done ) => {
		const html = GenerateHTML(
			'/zerella/basic',
			{ action: '#cabbage' },
			'/zerella',
			'test/unit/fixtures',
			{
				data:      'body { background: $AU-action; }',
				variables: { action: '$AU-action' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/basic/fixture-error.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
		done();
	});


	It( 'It should update styles fo valid colours and add errors to page alerts', ( done ) => {
		const html = GenerateHTML(
			'/zerella/basic',
			{ action: 'red', text: '#cabbage' },
			'/zerella',
			'test/unit/fixtures',
			{
				data:      'body { background: $AU-action; }',
				variables: { action: '$AU-action', text: '$AU-text' },
			},
		);

		const fixture = Fs.readFileSync(
			'test/unit/fixtures/basic/fixture-styles-with-error.html',
			'utf-8',
		);

		Expect( html ).to.equal( fixture );
		done();
	});


	It( 'It should return the default template given no query', ( done ) => {
		const html = GenerateHTML(
			'/zerella/basic',
			{},
			'/zerella',
			'test/unit/fixtures',
			{},
		);

		Expect( html ).to.equal( html );
		done();
	});
});
