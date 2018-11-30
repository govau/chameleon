const server = require("../../src/index");
const chai = require("chai");
const request = require("supertest");
const fs = require("fs");
const path = require("path");

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
	});

	describe( "GET /frame?text=red", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/frame?text=red")
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

		it( "Should assert page response style is correct", ( done ) => {
			request( server )
				.get("/frame?text=red")
				.end( ( error, response ) => {
					let html = fs.readFileSync( path.join(__dirname, "/fixtures/text=red.html" ), "utf-8" );
					expect( md5( response.text ) ).to.equal( md5( html ) );
					done();
				});
		});
	});

	describe( "GET /frame?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/frame?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			request( server )
				.get("/frame?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});

		it( "Should assert page response style is correct", ( done ) => {
			request( server )
				.get("/frame?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					let html = fs.readFileSync( path.join(__dirname, "/fixtures/text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=.html" ), "utf-8" );
					expect( md5( response.text ) ).to.equal( md5( html ) );
					done();
				});
		});
	});

	describe( "GET /frame?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/frame?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			request( server )
				.get("/frame?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});

		it( "Should assert page response style is correct", ( done ) => {
			request( server )
				.get("/frame?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					let html = fs.readFileSync( path.join(__dirname, "/fixtures/text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red.html" ), "utf-8" );
					expect( md5( response.text ) ).to.equal( md5( html ) );
					done();
				});
			});
	});

	describe( "GET /templates/full-page/index.html", () => {
		it( "Should return a 200", ( done ) => {
			request( server )
				.get("/templates/full-page/index.html")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		})

		it( "Should return a html file", ( done ) => {
			request( server )
				.get("/templates/full-page/index.html")
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
