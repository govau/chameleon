/**
 * html.spec.js - Unit tests for html.js
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
const GenerateHTML = require( '../../src/html' );


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
