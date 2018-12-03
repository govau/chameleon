/**
 * Dependecies
 */
const Express = require( 'express' );
const Helmet = require( 'helmet' );
const Sass = require( 'node-sass' );
const Fs = require( 'fs' );
const ColorString = require( 'color-string' );

// Global settings
const SETTINGS = {
	endpoint: '/chameleon',
	path: {
		assets: 'assets',
		templates: 'templates',
	},
	sass: {
		data: Fs.readFileSync( 'assets/sass/main.scss', 'utf-8' ),
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
	PORT: process.env.PORT || 3000,
};


/**
 * CreateStyles - Creates a HTML style tag with generated css
 *
 * @param   {object} query    - The request.query
 * @param   {string} sass     - The sass that gets added to the output
 * @param   {object} colorMap - Match keys in query to sass variables
 *
 * @returns {string}          - The CSS
 */
const CreateStyles = (
	query,
	data,
	variables
) => {
	try {
		// Create a SASS string to add above the sass
		let css = '';
		let customStyles = '';
		let errors = [];
		if( query ){

			Object.keys( query ).forEach( colorType => {
				const colorValue = ColorString.get( query[ colorType ] );

				if ( colorValue === null ) {
					errors.push( `Invalid colour ${ query[ colorType ] } for ${ variables[ colorType ] }` );

					// Not throwing and error as we want to continue parsing the SASS. 
					// node-sass errors should be caught down the chain
				}
				else {
					customStyles += `${ variables[ colorType ] }: ${ query[ colorType ] };\n`;
				}
			}); 
		}

		customStyles = customStyles + data;
		
		if( customStyles !== '' ){
			css = ( Sass.renderSync({
				data:         customStyles,
				outputStyle: 'compressed',
			}) ).css;
		}

		return { styles: `<style>${ css }</style>`, errors };

	}
	catch( error ){
		throw new Error( error.message );
	}
}


/**
 * GenerateHTML - Create the HTML file
 *
 * @param {*} url   - The url of the template file
 * @param {*} query - Any query paramaters
 *
 * @returns         - Customised HTML template given the query
 */
const GenerateHTML = ( url, query, endpoint, templateDir, { data, variables } = SETTINGS.sass ) => {
	// Location of the index.html file relative to URL.
	let templateLocation = url.replace( endpoint, templateDir ) + '/index.html';

	// Get the HTML
	let template = Fs.readFileSync( templateLocation, 'utf-8' );

	// If the user doesn't provide a query just send the normal html
	if( Object.keys(query).length === 0 ){
		return template;
	}

	// Try compile SASS into CSS
	let errorMessages = [];
	try {
		const { styles, errors } = CreateStyles( query, data, variables );
		errorMessages.push(...errors);

		// If there are styles add them to the template
		if( styles ) {
			template = template.replace( SETTINGS.replace.styles, styles );
		}
	}
	catch( error ) {
		errorMessages.push(error.message);
	}

	errorMessages = errorMessages.map( message => `<li>${ message }</li>` ).join( '' );

	// Page alert HTML for invalid colours
	const alert = errorMessages
		? `<div class="sass-error au-body au-page-alerts au-page-alerts--error"><h1 class="au-display-md">Error</h1><ul>${ errorMessages }</ul></div>`
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
	console.log( `Listening at http://localhost:${ SETTINGS.PORT }${ SETTINGS.endpoint }` );
});

module.exports = App;
module.exports.GenerateHTML = GenerateHTML;
module.exports.CreateStyles = CreateStyles;