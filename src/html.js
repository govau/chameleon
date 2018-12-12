/**
 * html.js - Generation of HTML templates
 */


// Dependencies
const Escape = require( 'escape-html' );
const Fs = require( 'fs' );


// Local dependencies
const CreateStyles = require( './style' );
const Settings = require( './settings' );


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
const GenerateHTML = async ( url, query, endpoint, templateDir, { data, variables } = Settings.sass ) => {
	// Change endpoint to template location, remove any ../
	const cleanURL = url.replace( /\.\.\//g, '' ).replace( endpoint, templateDir );

	// Location of the index.html file relative to URL.
	const templateLocation = `${ cleanURL }/index.html`;

	if( !Fs.existsSync( templateLocation ) ) {
		throw new Error( `Template not found for ${ Escape( url ) }` );
	}

	// Get the HTML
	let template = Fs.readFileSync( templateLocation, 'utf-8' );

	// If the user doesn't provide a query just send the normal html
	if( Object.keys( query ).length === 0 ) {
		return template;
	}

	// Try compile SASS into CSS
	let errorMessages = [];
	try {
		const { styles, errors } = await CreateStyles( query, data, variables );
		errorMessages.push( ...errors );

		// If there are styles add them to the template
		if( styles ) {
			template = template.replace( Settings.replace.styles, styles );
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
	const html = template.replace( Settings.replace.errors, alert );

	// Send HTML back
	return html;
};

module.exports = GenerateHTML;
