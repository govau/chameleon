const Gradient = require( 'gradient-string' );
const CFonts = require( 'cfonts' );

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

module.exports.RainbowMessage = RainbowMessage;
module.exports.CFonts = CFonts;