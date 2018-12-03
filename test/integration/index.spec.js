const Server = require("../../index");
const Chai = require("chai");
const Request = require("supertest");
const Fs = require("fs");
const Path = require("path");
const Md5 = require("md5");

const expect = Chai.expect;

describe( "Server", () => {
	describe( "GET /", () => {
		it( "Should return a 404", ( done ) => {
			Request( Server )
				.get("/")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 404 );
					done();
				});
		})
	})

	describe( "GET /chameleon", () => {
		it( "Should return a 200", ( done ) => {
			Request( Server )
				.get("/chameleon")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			Request( Server )
				.get("/chameleon")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});
	});

	describe( "GET /chameleon?text=red", () => {
		it( "Should return a 200", ( done ) => {
			Request( Server )
				.get("/chameleon?text=red")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			Request( Server )
				.get("/chameleon")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});

		it( "Should assert page response style is correct", ( done ) => {
			Request( Server )
				.get("/chameleon?text=red")
				.end( ( error, response ) => {
					let html = Fs.readFileSync( Path.join(__dirname, "/fixtures/text=red.html" ), "utf-8" );
					expect( Md5( response.text ) ).to.equal( Md5( html ) );
					done();
				});
		});
	});

	describe( "GET /chameleon?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=", () => {
		it( "Should return a 200", ( done ) => {
			Request( Server )
				.get("/chameleon?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			Request( Server )
				.get("/chameleon?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});

		it( "Should assert page response style is correct", ( done ) => {
			Request( Server )
				.get("/chameleon?text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=")
				.end( ( error, response ) => {
					let html = Fs.readFileSync( Path.join(__dirname, "/fixtures/text=&action=&focus=&background=&textDark=&actionDark=&focusDark=&backgroundDark=.html" ), "utf-8" );
					expect( Md5( response.text ) ).to.equal( Md5( html ) );
					done();
				});
		});
	});

	describe( "GET /chameleon?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red", () => {
		it( "Should return a 200", ( done ) => {
			Request( Server )
				.get("/chameleon?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		});

		it( "Should return a html file", ( done ) => {
			Request( Server )
				.get("/chameleon?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		});

		it( "Should assert page response style is correct", ( done ) => {
			Request( Server )
				.get("/chameleon?text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red")
				.end( ( error, response ) => {
					let html = Fs.readFileSync( Path.join(__dirname, "/fixtures/text=red&action=red&focus=red&background=red&textDark=red&actionDark=red&focusDark=red&backgroundDark=red.html" ), "utf-8" );
					expect( Md5( response.text ) ).to.equal( Md5( html ) );
					done();
				});
			});
	});

	describe( "GET /templates/full-page/index.html", () => {
		it( "Should return a 200", ( done ) => {
			Request( Server )
				.get("/templates/full-page/index.html")
				.end( ( error, response ) => {
					expect( response.status ).to.equal( 200 );
					done();
				});
		})

		it( "Should return a html file", ( done ) => {
			Request( Server )
				.get("/templates/full-page/index.html")
				.end( ( error, response ) => {
					expect( response.type ).to.equal( "text/html" );
					done();
				});
		})
	})
});
