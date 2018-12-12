/**
 * slack.js - ♥ Heartbeat messages to slack
 */

const envVars = process.env.VCAP_SERVICES ? JSON.parse( process.env.VCAP_SERVICES ) : {};
const { IncomingWebhook } = require( '@slack/client' ).IncomingWebhook;


const SendMessage = ( data, URL, isPrivateChannel = true ) => {
	console.log( `Sending slack message to ${ URL }` );

	return new Promise( ( resolve, reject ) => {

		if( URL && URL.length > 0 ) {
			const Webhook = new IncomingWebhook( URL );

			const clientInfo = isPrivateChannel
				? {
						'title': 'Client',
						'value': '' +
							'_IP_: `' + data.ip + '`',
						'short': false,
					}
				: {};

			const message = {
				text: `*Chamaleon*:\n\n`,
				attachments: [{
					'fallback': 'Chama-chama-chama-chameleon!',
					'pretext': 'Chama-chama-chama-chameleon!',
					'color': `#ff4500`,
					'mrkdwn_in': [
						`text`,
						`pretext`,
						`fields`,
					],
					'fields': [
						{
							'title': 'Components',
							'value': '' +
								'_Selected_: `' + data.components.length + '`\n' +
								'_Modules_: `' + data.components.join( '` , `') + '`\n\n\n',
							'short': false,
						},
						{
							'title': 'Options',
							'value': '' +
								'_JS Output_: `' + data.jsOutput + '`\n' +
								'_Style Output_: `' + data.styleOutput + '`\n\n\n',
							'short': false,
						},
						clientInfo,
					],
					'footer': ':gold:',
				}]
			}

			Webhook.send( message, ( error, header, statusCode, body ) => {
				if( error ) {
					reject( error );
				}
				else {
					console.log( `Slack received: ${ statusCode }` );
					console.log( `Slack message sent:\n ${ message }` );
					resolve();
				}
			});
		}
		else {
			console.info( `Failed to send slack message, SLACK_WEBHOOKS (${ URL }) environment variable not found.` );
			resolve();
		}
	});
};


module.exports.SendSlackMessage = ( messageData ) => {
	const CHANNELS = envVars[ 'user-provided' ]
		? envVars[ 'user-provided' ][ 0 ].credentials.SLACK_WEBHOOKS
		: [];
	const allMessages = [];

	return new Promise( ( resolve, reject ) => {

		CHANNELS.forEach( CHANNEL => allMessages.push(
			SendMessage( messageData, CHANNEL.url, CHANNEL.isPrivateChannel )
		) );

		Promise.all( allMessages )
			.catch( error => reject(error) )
			.then( resolve );
	});
}
