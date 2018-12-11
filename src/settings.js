const Fs = require ( 'fs' );

// Global settings
module.exports = {
	sass: {
		data:      Fs.readFileSync( 'assets/sass/main.scss', 'utf-8' ),
		variables: {
			text:           '$AU-color-foreground-text',
			action:         '$AU-color-foreground-action',
			focus:          '$AU-color-foreground-focus',
			background:     '$AU-color-background',
			textDark:       '$AU-colordark-foreground-text',
			actionDark:     '$AU-colordark-foreground-action',
			focusDark:      '$AU-colordark-foreground-focus',
			backgroundDark: '$AU-colordark-background',
		},
	},
	replace: {
		styles: '<link rel="stylesheet" href="/chameleon/assets/css/main.css">',
		errors: '<!-- ERROR -->',
	},
	path: {
		assets:    'assets',
		templates: 'templates',
	},
	endpoint: '/chameleon',
	PORT:     process.env.PORT || 3000,
};