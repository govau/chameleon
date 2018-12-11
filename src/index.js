/**
 * index.js - Chameleon tongues to the sky
 */

// Dependencies
const Express = require( 'express' );
const Helmet = require( 'helmet' );

const Settings = require( './settings' );
const Cli = require( './cli' );
const Html = require( './html' );

// We are using express for our server
const App = Express();

// Use helmet to add secure headers
App.use( Helmet() );

// Link static assets like images to the generated HTML
App.use( '/chameleon/assets', Express.static( Settings.path.assets ) );

// Handle requests to server on route Settings.serverLocation
App.get( `${ Settings.endpoint }*`, ( request, response ) => {
	// Removed XSS sameorigin policy for local testing
	if( process.env.NODE_ENV !== 'production' ) {
		response.removeHeader( 'X-Frame-Options' );
	}

	// Generate HTML to send back to user
	const html = Html.GenerateHTML( request._parsedUrl.pathname, request.query, Settings.endpoint, Settings.path.templates );

	// Send back the HTML to the user
	response.send( html );
});

// Start the server on the PORT
App.listen( Settings.PORT, () => {
	Cli.RainbowMessage( 'Chameleon' );
	Cli.CFonts.say(
		`🦎 Started at http://localhost:${ Settings.PORT }${ Settings.endpoint } 🦎`,
		{
			align: 'center',
			font:  'console',
		},
	);
});

module.exports = App;
