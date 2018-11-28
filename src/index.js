const express = require( 'express' );
const helmet = require( 'helmet' );
const path = require( 'path' );
const sass = require( 'node-sass' );
const fs = require( 'fs' );
const urldecode = require( 'urldecode' )
const isColor = require( 'is-color' )

const app = express();

const port = process.env.PORT || 3000;
const uikitSass = fs.readFileSync( path.join( __dirname, '/../templates/pancake.scss' ), 'utf-8' ) ;

app.use( helmet() );

// Static endpoint for developer testing
process.env.NODE_ENV === 'production'
	? undefined
	: app.use( '/test', express.static( path.join( __dirname, '/../test/system' ) ) );

/**
 * Static endpoint for the full-page template, 
 * this will resolve the index.html in the folder.
*/ 
app.use( '/templates/full-page', express.static( path.join( __dirname, '/../templates/full-page') ) );

app.get( '/frame',  async ( request, response ) => {
	const colors = request.query;

	console.log(colors);

	const colorMap = {
		text:           '$AU-color-foreground-text',
		action:         '$AU-color-foreground-action',
		focus:          '$AU-color-foreground-focus',
		background:     '$AU-color-background',
		textDark:       '$AU-colordark-foreground-text',
		actionDark:     '$AU-colordark-foreground-action',
		focusDark:      '$AU-colordark-foreground-focus',
		backgroundDark: '$AU-colordark-background',
	};

	let customStyles = '';

	Object.keys( colors ).map( ( colorType ) => {
		const colorValue = colors[ urldecode( colorType ) ];

		// Not empty value and isn't a color ?
		if( colorValue !== '' && !isColor( colorValue ) ) {
			response.send(`<h1>THAT'S NOT A COLOUR! ${colorValue}</h1>`);
			response.status(500)
			response.end();
		}
		// Not undefined but probably empty ? What am i even doing at this point
		else if ( colorValue ) {
			customStyles += `${ colorMap[ colorType ] }: ${ colors[ colorType ] };\n`;
		}
	});
	
	console.log(customStyles);

	const css = sass.renderSync({
		data:         customStyles + uikitSass,
		outputStyle: 'compressed',
	});

	/**
	 * @todo Take me to the page I was on, not index.html
	 */
	const templateLocation = path.join( __dirname, '/../templates/full-page/index.html' );
	const template = fs.readFileSync( templateLocation, 'utf-8' );
	const html = template.replace( '<!--INJECTED STYLES-->', `<style>${ css.css }</style>` );

	response.send( html );
});

app.listen( port, () => { console.log( `Listening at http://localhost:${port}`)} );

module.exports = app;
