const { GenerateHTML, CreateStyles } = require("../../index");

const Chai = require("chai");
const Fs = require("fs");

const expect = Chai.expect;

describe(" CreateStyles() ", () => {
	it("It should change color based on query #f00", done => {
		const sass = "body {  background-color: $AU-color-action; }";
		const css = CreateStyles({ action: "#f00" }, sass, {
			action: "$AU-color-action"
		});

		expect(css).to.equal(`<style>body{background-color:red}\n</style>`);
		done();
	});

	it("It should return default styles given NO query", done => {
		const sass = "body {  background-color: red; }";
		const css = CreateStyles({}, "", {});

		expect(css).to.equal(`<style></style>`);
		done();
	});

	it("It should throw an error given an INVALID query", done => {
		const sass = "body {  background-color: ; }";
		expect(() =>
			CreateStyles({ action: "#f" }, sass, "", { action: "$AU-color-action" })
		).to.throw(`Invalid CSS after "u": expected 1 selector or at-rule, was "unasdasdsdefined: #f;"`);
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

	// it( "It should return print a page alert if CSS is invalid", ( done ) => {
	// 	const html = GenerateHTML(`/zerella/basic`, {action: "%asdas"}, `/zerella`, `test/unit/fixtures`, { data: "body { background: $AU-action; }", variables: { action: "$AU-action"} } )
	// 	const fixture =  Fs.readFileSync( 'test/unit/fixtures/basic/fixture-error.html', 'utf-8' );
	// 	expect( html ).to.equal( fixture );
	// 	done();
	// });
});
