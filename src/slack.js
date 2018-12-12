/**
 * slack.js - ♥ Heartbeat messages to slack
 */

const envVars = process.env.VCAP_SERVICES 
	? JSON.parse( process.env.VCAP_SERVICES ) 
	: {};
const { IncomingWebhook } = require('@slack/client');

/**
 * Send a slack message to #chameleon
 * @param {string} message - Message to send to Slack
 */
const SendSlackMessage = ( message ) => {
	const URL = envVars[ 'user-provided' ][ 0 ].credentials.SLACK_WEBHOOKS[ 0 ].url
	const SlackWebhook = new IncomingWebhook( URL );

	SlackWebhook.send( message, ( error, response ) => {
		if ( error ) {
			console.error( 'Error:', error );
		} 
		else {
			console.log( 'Message sent: ', response );
		}
	});
}

module.exports.SendSlackMessage = SendSlackMessage;