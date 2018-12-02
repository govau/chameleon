/* eslint-disable */

/**
 * ParseParameters - Turns the url Parameters into an object
 */
function ParseParameters( paramString = window.location.search ) {
	var paramObject = {};

	if ( Object.keys( paramString ).length > 0 ) {
		paramString.substr( 1 ).split( '&' ).map( value => {
			const keyValue = value.split( '=' );
			paramObject[ keyValue[ 0 ] ] = decodeURIComponent( keyValue[ 1 ] ).split( '+' ).join( '' );
		});
	}

	return paramObject;
}


/**
 * ApplyColors - Applies the colours to the iframe
 */
function ApplyColours( paramString = window.location.search ){
	document.getElementById( 'myIframe' ).src = `http://localhost:3000/chameleon${ paramString }`;
}


/**
 * FillForm - Fills the form with the parameters in the URL
 */
function FillForm( paramObject = ParseParameters() ){
	Object.entries( paramObject ).map( value => {
        var input = document.querySelector( `input[ name="${ value[ 0 ]}"]` );
        input.value = value[ 1 ];
	})
}


// Set the default form input equal to the querystring
FillForm();

// Apply the colours
ApplyColours();
