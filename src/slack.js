/**
 * slack.js - ♥ Heartbeat messages to slack
 */


// Depedencies
const { IncomingWebhook } = require( '@slack/client' );
const ColorString = require( 'color-string' );


/**
 * SendSlackMessage - Send a slack message to #chameleon
 *
 * @param {string} message - Message to send to Slack
 */
const SendSlackMessage = ( message ) => {
	const envVars = process.env.VCAP_SERVICES
		? JSON.parse( process.env.VCAP_SERVICES )
		: {};

	if( Object.keys( envVars ).length > 0 ) {
		const URL = envVars[ 'user-provided' ][ 0 ].credentials.SLACK_WEBHOOKS[ 0 ].url;
		const SlackWebhook = new IncomingWebhook( URL );

		SlackWebhook.send( message, ( error, response ) => {
			if( error ) {
				console.error( 'Error:', error );
			}
			else {
				console.log( 'Slack message sent: ', response );
			}
		});
	}
};


/**
 * QueryToHex - Get hex values of colours
 *
 * @param   {object} query  - Query parameters in URL
 *
 * @returns {object}        - Sends back an object with hexadecimals
 */
const QueryToHexString = ( query ) => {
	let hexString = '';

	// For each item in query
	Object.entries( query )
		.forEach( ( [ colorName, color ] ) => {
			const rgbColor = ColorString.get.rgb( color );

			// If a valid colour add it to object and return hex value
			if( rgbColor ) {
				const hexColor = ColorString.to.hex( rgbColor );
				hexString += `\`${ colorName }\`: ${ hexColor }\n`;
			}
		});

	return hexString;
};


/**
 * GetTemplateFromURL - Return the template name given a request.path
 *
 * @param   {string} url - Express.js request.path string
 *
 * @returns {string}     - The template
 */
const GetTemplateFromURL = ( url ) => {
	const baseUrl = url.split( '/' )[ 2 ];

	// If it is not the home page
	if( baseUrl && baseUrl !== '' ) {
		return baseUrl;
	}

	return 'homepage';
};


/**
 * GenerateChameleonMessage - Creates a formatted message
 *
 * @param   {string} path  - The URL path
 * @param   {object} query - The queries that hit the API
 *
 * @returns {string}       - The formatted message
 */
const GenerateChameleonMessage = ( path, query ) => {
	let message = '>>> _*Karma-Karma-Karma-Karma-Karma-Chameleon!*_\n\n';

	const template = GetTemplateFromURL( path );
	
	if( path ) {
		message += `Generating *${ template }* page template\n\n`;
	}

	if( query !== {}) {
		message += `${ QueryToHexString( query ) }`;
	}

	// Append a preview URL to message.
	console.log(query);
	
	message += `https://designsystem.gov.au/templates/${ template }/customise${ query }`;

	return message;
};


/**
 * SendChameleonMessage - Send a slack message to #chameleon
 *
 * @param {string} path   - The URL path
 * @param {object} query - The queries that hit the API
 */
const SendChameleonMessage = ( path, query ) => {
	const message = GenerateChameleonMessage( path, query );
	SendSlackMessage( message );
};


module.exports = SendChameleonMessage;
module.exports.GenerateChameleonMessage = GenerateChameleonMessage;
module.exports.SendSlackMessage = SendSlackMessage;
module.exports.QueryToHexString = QueryToHexString;
module.exports.GetTemplateFromURL = GetTemplateFromURL;
