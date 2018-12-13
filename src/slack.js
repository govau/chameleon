/**
 * slack.js - ♥ Heartbeat messages to slack
 */

const { IncomingWebhook } = require('@slack/client');
const ColorString = require( 'color-string' );

/**
 * Send a slack message to #chameleon
 * @param {string} message - Message to send to Slack
 */
const SendSlackMessage = ( message ) => {
	const envVars = process.env.VCAP_SERVICES 
		? JSON.parse( process.env.VCAP_SERVICES ) 
		: {};

	if ( Object.keys( envVars ).length > 0 ) {
		const URL = envVars[ 'user-provided' ][ 0 ].credentials.SLACK_WEBHOOKS[ 0 ].url
		const SlackWebhook = new IncomingWebhook( URL );
		
		SlackWebhook.send( message, ( error, response ) => {
			if ( error ) {
				console.error( 'Error:', error );
			} 
			else {
				console.log( 'Slack message sent: ', response );
			}
		});
	}
}


/**
 * Generate a string of colours from an express.js request.query
 * e.g 'action: red, background: black'
 * @param {object} request - Express.js request.query
 */
const ColorMapToString = ( requestQuery ) => {
	let darkColors = ``;
	let defaultColors = ``;

	if ( Object.keys( requestQuery ).length > 0 ) {
		for ( const [ key, value ] of Object.entries( requestQuery ) ) {
			if ( key.includes( 'dark' ) || key.includes( 'Dark' ) ) {
				darkColors += `\n\`${key}\`: ${ColorString.to.hex( ColorString.get.rgb( value ) )}`
			}
			else {
				defaultColors += `\n\`${key}\`: ${ColorString.to.hex( ColorString.get.rgb( value ) )}`
			}
		}
		
		if ( darkColors ) {
			return `${defaultColors}\n*Dark Palette:*${darkColors}`;
		}
		else {
			return `${defaultColors}`;
		}
	}
	else {
		return "the default palette."
	}
}

/**
 * Return the template name given a request.path
 * @param {string} requestPath - Express.js request.path string
 */
const ParseRequestPath = ( requestPath ) => {
	if ( requestPath.split( '/' ).length == 2 || requestPath.split( '/' )[2] == '' ) {
		return 'homepage'
	}
	else {
		return requestPath.split( '/' )[2]
	}
}

/**
 * Return the template name given a request.path
 * @param {string} requestPath - Express.js request.path string
 */
const ParseRequestPath = ( requestPath ) => {
	if ( requestPath.split( '/' ).length == 2 || requestPath.split( '/' )[2] == '' ) {
		return 'homepage'
	}
	else {
		return requestPath.split( '/' )[2]
	}
}

module.exports.SendSlackMessage = SendSlackMessage;
module.exports.ColorMapToString = ColorMapToString;
module.exports.ParseRequestPath = ParseRequestPath;
