/**
 * index.js - Chameleon tongues to the sky
 */

// Dependencies
const Express = require( 'express' );
const Helmet = require( 'helmet' );
const Sass = require( 'node-sass' );
const Fs = require( 'fs' );
const ColorString = require( 'color-string' );
const Gradient = require( 'gradient-string' );
const CFonts = require( 'cfonts' );
const Escape = require( 'escape-html' );


// Global settings
const SETTINGS = {
	sass: {
		data:      Fs.readFileSync( 'assets/sass/main.scss', 'utf-8' ),
		variables: {
			text:           '$AU-color-foreground-text',
			action:         '$AU-color-foreground-action',
			focus:          '$AU-color-foreground-focus',
			background:     '$AU-color-background',
			textDark:       '$AU-colordark-foreground-text',
			actionDark:     '$AU-colordark-foreground-action',
			focusDark:      '$AU-colordark-foreground-focus',
			backgroundDark: '$AU-colordark-background',
		},
	},
	replace: {
		styles: '<link rel="stylesheet" href="/assets/css/main.css">',
		errors: '<!-- ERROR -->',
	},
	path: {
		assets:    'assets',
		templates: 'templates',
	},
	endpoint: '/chameleon',
	PORT:     process.env.PORT || 3000,
};


/**
 * CreateStyles - Creates a HTML style tag with generated css
 *
 * @param   {object} query     - An object containing the queries
 * @param   {string} data      - The default sass to add the variables to
 * @param   {object} variables - An object that maps queries to sass variables
 *
 * @returns {string}           - The <style>...</style> with css in the middle
 */
const CreateStyles = ( query, data, variables ) => {
	try {
		// Create a SASS string to add above the sass
		let customStyles = '';
		let styles;
		const errors = [];

		// If the user has a query, map them to variables
		if( query ) {
			Object.keys( query ).forEach( ( colorType ) => {
				// Check if the color inputted comes out as a valid rgb
				const color = ColorString.get.rgb( query[ colorType ] );

				// If there is a valid colour add it to custom styles
				if( color ) {
					customStyles += `${ variables[ colorType ] }: rgba( ${ color.toString() } );\n`;
				}
				// If there is not a color value add to the errors
				else if( query[ colorType ] !== '' ) {
					errors.push( `Invalid colour ${ query[ colorType ] } for ${ variables[ colorType ] }` );
				}
			});
		}

		// Add any additional styles below the custom styles
		customStyles += data;

		// If there are custom styles turn them into an inline <style> tag
		if( customStyles ) {
			const { css } = Sass.renderSync({ data: customStyles, outputStyle: 'compressed' });
			styles = `<style>${ css }</style>`;
		}

		// Send back the styles and errors
		return { styles, errors };
	}
	catch( error ) {
		throw new Error( error.message );
	}
};


/**
 * RainbowMessage - A chameleon themed start message
 *
 * @param {*} string - The string to rainbowify
 */
const RainbowMessage = ( string ) => {
	const { array } = ( CFonts.render( string, { align: 'center' }) );
	console.log( '\n\n\n' );
	array.forEach( line => console.log( Gradient.rainbow( line ) ) );
};


/**
 * GenerateHTML - Create the HTML file
 *
 * @param   {string} url         - The url the user is on
 * @param   {object} query       - The query parameters
 * @param   {string} endpoint    - The API endpoint
 * @param   {string} templateDir - The location of the template files
 * @param   {object} sass        - The sass data and variable map
 *
 * @returns {string}             - The HTML to send back to the user
 */
const GenerateHTML = ( url, query, endpoint, templateDir, { data, variables } = SETTINGS.sass ) => {
	// Location of the index.html file relative to URL.
	const templateLocation = `${ url.replace( endpoint, templateDir ) }/index.html`;

	// Get the HTML
	let template = Fs.readFileSync( templateLocation, 'utf-8' );

	// If the user doesn't provide a query just send the normal html
	if( Object.keys( query ).length === 0 ) {
		return template;
	}

	// Try compile SASS into CSS
	let errorMessages = [];
	try {
		const { styles, errors } = CreateStyles( query, data, variables );
		errorMessages.push( ...errors );

		// If there are styles add them to the template
		if( styles ) {
			template = template.replace( SETTINGS.replace.styles, styles );
		}
	}
	catch( error ) {
		errorMessages.push( error.message );
	}

	errorMessages = errorMessages.map( message => `<li>${ Escape( message ) }</li>` ).join( '' );

	// Page alert HTML for invalid colours
	const alert = errorMessages
		? 	`<div class="sass-error au-body au-page-alerts au-page-alerts--error">
					<h1 class="au-display-md">Error</h1>
					<ul>${ errorMessages }</ul>
				</div>`
		: '';

	// Add any errors
	const html = template.replace( SETTINGS.replace.errors, alert );

	// Send HTML back
	return html;
};
// We are using express for our server
const App = Express();

// Use helmet to add secure headers
App.use( Helmet() );

// Link static assets like images to the generated HTML
App.use( '/assets', Express.static( SETTINGS.path.assets ) );

// Create a static path for the template files
App.use( '/templates', Express.static( 'templates' ) );

// Handle requests to server on route SETTINGS.serverLocation
App.get( `${ SETTINGS.endpoint }*`, ( request, response ) => {
	// Generate HTML to send back to user
	const html = GenerateHTML( request._parsedUrl.pathname, request.query, SETTINGS.endpoint, SETTINGS.path.templates );

	// Send back the HTML to the user
	response.send( html );
});

// Start the server on the PORT
App.listen( SETTINGS.PORT, () => {
	RainbowMessage( 'Chameleon' );
	CFonts.say(
		`Started at http://localhost:${ SETTINGS.PORT }${ SETTINGS.endpoint }`,
		{
			align: 'center',
			font:  'console',
		},
	);
});

module.exports = App;
module.exports.GenerateHTML = GenerateHTML;
module.exports.CreateStyles = CreateStyles;
