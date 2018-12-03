const { GenerateHTML, CreateStyles } = require("../../index");

const Chai = require("chai");
const Fs = require("fs");

const expect = Chai.expect;

describe(" CreateStyles() ", () => {
	it("It should change color based on query #f00", done => {
		const sass = "body {  background-color: $AU-color-action; }";
		const { styles } = CreateStyles({ action: "#f00" }, sass, {
			action: "$AU-color-action"
		});

		expect(styles).to.equal(`<style>body{background-color:red}\n</style>`);
		done();
	});

	it("It should return default styles given NO query", done => {
		const { styles }  = CreateStyles({}, "", {});

		expect( styles ).to.equal(`<style></style>`);
		done();
	});

	it("It should throw an error given malformed sass", done => {
		const sass = "body {  background-color: }";

		expect(() =>
			CreateStyles({ action: "#f" }, sass, { action: "$AU-color-action" })
		).to.throw(`Invalid CSS after "...ckground-color:": expected expression (e.g. 1px, bold), was "}`);
		done();
	});

	it("It should add to the errors object if a given color value is invalid", done => {
		const sass = "body {  background-color: red}";
		const { styles, errors }  = CreateStyles({ action: "#cabbage" }, sass, { action: "$AU-color-action" });
		expect( errors[ 0 ] ).to.equal( `Invalid colour #cabbage for $AU-color-action` );
		expect( styles ).to.equal(`<style>body{background-color:red}\n</style>`);
		done();
	});
});

describe(" GenerateHTML() ", () => {
	it( "It should return the correct file given valid colors", ( done ) => {
		const html = GenerateHTML(`/zerella/basic`, {action: "red"}, `/zerella`, `test/unit/fixtures`, { data: "body { background: $AU-action; }", variables: { action: "$AU-action"} } )
		const fixture =  Fs.readFileSync( 'test/unit/fixtures/basic/fixture-background-red.html', 'utf-8' );
		expect( html ).to.equal( fixture );
		done();
	});

	it( "It should replace a page alert if CSS is invalid", ( done ) => {
		const html = GenerateHTML(`/zerella/basic`, {action: "%asdas"}, `/zerella`, `test/unit/fixtures`, { data: "body { background: $AU-action; }", variables: { action: "$AU-action"} } )
		const fixture =  Fs.readFileSync( 'test/unit/fixtures/basic/fixture-error.html', 'utf-8' );
		expect( html ).to.equal( fixture );
		done();
	});

	it( "It should return a html with the valid styles and page alert with the invalid", ( done ) => {
		const html = GenerateHTML(`/zerella/basic`, {action: "red", text: '$#cabbage'}, `/zerella`, `test/unit/fixtures`, { data: "body { background: $AU-action; }", variables: { action: "$AU-action", text: "$AU-text"} } )
		const fixture =  Fs.readFileSync( 'test/unit/fixtures/basic/fixture-styles-with-error.html', 'utf-8' );
		expect( html ).to.equal( fixture );
		done();
	});

	it( "It should return the default template given no query", ( done ) => {
		const html = GenerateHTML(`/zerella/basic`, {}, `/zerella`, `test/unit/fixtures`, {} )
		expect( html ).to.equal( html );
		done();
	});
});
