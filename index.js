/**
 * Dependecies
 */
const Express = require( 'express' );
const Helmet = require( 'helmet' );
const Sass = require( 'node-sass' );
const Fs = require( 'fs' );


// Global settings
const SETTINGS = {
	path: {
		server: '/chameleon',
		assets: 'templates/assets',
		templates: 'templates',
		sass: 'templates/sass/main.scss',
	},
	sassVariables: {
		text:           '$AU-color-foreground-text',
		action:         '$AU-color-foreground-action',
		focus:          '$AU-color-foreground-focus',
		background:     '$AU-color-background',
		textDark:       '$AU-colordark-foreground-text',
		actionDark:     '$AU-colordark-foreground-action',
		focusDark:      '$AU-colordark-foreground-focus',
		backgroundDark: '$AU-colordark-background',
	},
	styleReplace: '<link rel="stylesheet" href="/assets/css/main.css">',
	errorReplace: '<!-- ERROR -->',
	PORT: process.env.PORT || 3000,
};


/**
 * CreateStyles - Create CSS string from the request query
 *
 * @param   {object} query    - The request.query
 * @param   {string} sassFile - The path to the sass file
 * @param   {object} colorMap - Match keys in query to sass variables
 *
 * @returns {string}          - The CSS
 */
const CreateStyles = (
	query,
	sassFile = SETTINGS.path.sass,
	colorMap = SETTINGS.sassVariables,
) => {
	try {
		// Read the sass file
		const sass = Fs.readFileSync( sassFile, 'utf-8' );

		// Create a SASS string to add above the sass
		let customStyles = '';
		Object.keys( query ).forEach( colorType => {
			const colorValue = query[ colorType ];

			if( colorValue ) {
				customStyles += `${ colorMap[ colorType ] }: ${ query[ colorType ] };\n`;
			}
		});

		const { css } = Sass.renderSync({
			data:         customStyles + sass,
			outputStyle: 'compressed',
		});

		return `<style>${ css }</style>`;
	}
	catch( error ){
		throw new Error( error );
	}
}



/**
 * GetHTML - Gets the HTML file from the request URL
 *
 * @param   {string} url              - The url the user requested
 * @param   {string} serverLocation   - The location of the server
 * @param   {string} templateLocation - The template files location
 *
 * @returns {string}                  - The HTML file
 */
const GetHTML = (
	url,
	serverLocation = SETTINGS.path.server,
	templateLocation = SETTINGS.path.templates
) => {
	return Fs.readFileSync(
		`${ url.replace( serverLocation, templateLocation ) }/index.html`,
		'utf-8'
	);
};


/**
 * GenerateHTML - Create the HTML file
 *
 * @param {*} url   - The url of the template file
 * @param {*} query - Any query paramaters
 *
 * @returns         -
 */
const GenerateHTML = ( url, query ) => {
	// Get the HTML
	const template = GetHTML( url );

	// Try compile SASS into CSS
	let styles;
	let alert;
	try {
		styles = CreateStyles( query );
	}
	catch( error ){
		alert = `<div class="au-body sass-error">
			<div class="au-page-alerts au-page-alerts--error">
				${ error.message }
			</div>
		</div>`;
	}

	// Add the styles or an error message
	const html = alert
		? template.replace( SETTINGS.errorReplace, alert )
		: template.replace( SETTINGS.styleReplace, styles );

	return html;
};


// We are using express for our server
const App = Express();

// Use helmet to add secure headers
App.use( Helmet() );

// Link static assets like images to the generated HTML
App.use( '/assets', Express.static( SETTINGS.path.assets ) );

// Handle requests to server on route SETTINGS.serverLocation
App.get( `${ SETTINGS.path.server }*`, ( request, response ) => {
	// Generate HTML to send back to user
	const html = GenerateHTML( request._parsedUrl.pathname, request.query );

	// Send back the HTML to the user
	response.send( html );
});

// Start the server on the PORT
App.listen( SETTINGS.PORT, () => {
	console.log( `Listening at http://localhost:${ SETTINGS.PORT }` );
});

module.exports = App;
