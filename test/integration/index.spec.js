const server = require("../../src/index");
const chai = require("chai");
const request = require("supertest");
const fs = require("fs");

const expect = chai.expect;

describe( "Server", () => {
	describe( "GET /", () => {
		it( "Should return a 404", ( done ) => {
			request( server )
				.get("/")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 404 );
					done();
				});
		})
	})

	describe( "GET /main.js", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/main.js")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		})

		it( "Should return a javascript file", ( done ) => {
			request( server )
				.get("/main.js")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "application/javascript" );
					done();
				});
		});
	})

	describe( "GET /frame", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/frame")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			request( server )
				.get("/frame")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});

		it( "Should return a 200 with text colour red", ( done ) => {
			request( server )
				.get("/frame?text=red")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					/**
					 * @todo CHECK COLOUR IS RED ??
					 */
					done();
				});
		});

		it( "Should return a 200 with full empty query string", ( done ) => {
			request( server )
				.get("/frame?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					/**
					 * @todo CHECK COLOUR IS RED ??
					 */
					done();
				});
		});

		it( "Should return a 200 with full query string", ( done ) => {
			request( server )
				.get("/frame?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					/**
					 * @todo CHECK COLOUR IS RED ??
					 */
					done();
				});
		});

		it( "Should return a 200 from malformed querystring to /frame", ( done ) => {
			request( server )
				.get("/frame?texABCD")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});
	})

	describe( "GET /templates/index.html", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/templates/index.html")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		})

		it( "Should return a html file", ( done ) => {
			request( server )
				.get("/templates/index.html")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		})
	})

	describe( "GET /test", () => {
		it( "Should return a 200 if NODE_ENV isn't set to 'production'", ( done ) => {
			request( server )
				.get("/test/")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		})
	})
});