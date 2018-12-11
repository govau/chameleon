const Sass = require( 'node-sass' );
const ColorString = require( 'color-string' );

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

module.exports = CreateStyles;