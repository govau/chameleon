const server = require("../../src/index");
const chai = require("chai");
const chaiHTTP = require("chai-http");

chai.use( chaiHTTP );
chai.should();

describe( "Server", () => {
	describe( "GET /", () => {
		it( "Should return a 404", ( done ) => {
			chai.request( server )
				.get("/")
				.end( ( error, response ) => {
					response.should.have.status(404);
					done();
				});
		})
	})

	describe( "GET /main.js", () => {
		it( "Should return a 200", ( done ) => {
			chai.request( server )
				.get("/main.js")
				.end( ( error, response ) => {
					response.should.have.status(200);
					done();
				});
		})
	})
	
	describe( "GET /frame", () => {
		it( "Should return a 200", ( done ) => {
			chai.request( server )
				.get("/frame")
				.end( ( error, response ) => {
					response.should.have.status(200);
					done();
				});
		})
	})

	describe( "GET /templates", () => {
		it( "Should return a 200", ( done ) => {
			chai.request( server )
				.get("/templates")
				.end( ( error, response ) => {
					response.should.have.status(200);
					done();
				});
		})
	})

	describe( "GET /test", () => {
		it( "Should return a 200 if NODE_ENV isn't set to prod", ( done ) => {
			chai.request( server )
				.get("/test")
				.end( ( error, response ) => {
					response.should.have.status(200);
					done();
				});
		})
	})
});

// process.exit(0);