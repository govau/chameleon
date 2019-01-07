/**
 * helpers.js - Helper functions.
 */


// Dependencies
const Sass = require( 'node-sass' );


/**
 * RenderSass - Promisfiy node-sass Sass.render
 * 
 * @see node-sass https://github.com/sass/node-sass#usage
 * @param {object} options - node-sass options object
 * 
 */
const RenderSass = ( options ) => {
    return new Promise ( ( resolve, reject ) => {
        Sass.render( options, ( error, result ) => {
            error ? reject( error) : resolve( result );
        } )
    })
}


module.exports.RenderSass = RenderSass;