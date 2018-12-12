/**
 * slack.js - ♥ Heartbeat messages to slack
 */

const { IncomingWebhook } = require('@slack/client');

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
	let colors = "";

	if ( Object.keys( requestQuery ).length > 0 ) {
		for ( const [key, value] of Object.entries( requestQuery ) ) {
			colors += `${key}: ${value}, `
		}
	
		// Trim trailing comma
		colors = colors.replace(/,\s*$/g, "")

		return colors;
	}
	else {
		return "no colors :("
	}
}

module.exports.SendSlackMessage = SendSlackMessage;
module.exports.ColorMapToString = ColorMapToString;
