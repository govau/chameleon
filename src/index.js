/**
 * index.js - Chameleon tongues to the sky
 */


// Dependencies
const Express = require( 'express' );
const CFonts = require( 'cfonts' );
const Fs = require( 'fs' );

// Local dependencies
const Settings = require( './settings' );
const GenerateHTML = require( './html' );
const Cli = require( './cli' );
const SendChameleonMessage = require( './slack' );


// We are using express for our server
const App = Express();

// Link static assets like images to the generated HTML
App.use( `${ Settings.endpoint }/assets`, Express.static( Settings.path.assets ) );

// Handle requests to server on route Settings.serverLocation
App.get( `${ Settings.endpoint }*`, async ( request, response ) => {
	// Generate HTML to send back to user
	try {
		const html = await GenerateHTML(
			request._parsedUrl.pathname,
			request.query,
			Settings.endpoint,
			Settings.path.templates,
		);
	
		// Notify Slack!
		if( process.env.VCAP_SERVICES ) {
			SendChameleonMessage( request.path, request.query );
		}
	
		// Send back the HTML to the user
		response.send( html );
	}
	catch ( error ) {
		throw new Error( error );
	}
});


// Wildcard endpoint to capture all requests other than /chameleon
App.get( '*', ( request, response ) => {
	Fs.readFile( 'assets/html/404.html', 'utf-8', ( error, data ) => {
		if( error ) {
			console.error ( error );
		}

		response.send( data );
	});
});


// Start the server on the PORT
App.listen( Settings.PORT, () => {
	Cli.RainbowMessage( 'Chameleon' );
	CFonts.say(
		`🦎 Started at http://localhost:${ Settings.PORT }${ Settings.endpoint } 🦎`,
		{
			align: 'center',
			font:  'console',
		},
	);
});

module.exports = App;
