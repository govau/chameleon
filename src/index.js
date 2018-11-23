const express = require('express')
const helmet = require('helmet');
const path = require("path");
const sass = require("node-sass");
const fs = require("fs");
const urldecode = require('urldecode')

const app = express();

const port = process.env.PORT || 3000
const uikitSass = fs.readFileSync( './pancake.scss', 'utf-8' );

app.use(helmet());

// Static endpoint for clientside scripts
app.use('/', express.static(path.join(__dirname, '/../public')))

// Static endpoint for developer testing
process.env.NODE_ENV === "production" ? undefined : app.use('/test', express.static(path.join(__dirname, '/../test/system')))

// Static endpoint for templates
app.use('/templates', express.static(path.join(__dirname, '/../templates/full-page')))

app.get("/frame",  async ( req, res ) => {
    const colors = req.query;

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
        const colorValue = colors[ urldecode(colorType) ];

        if( colorValue ) {
            customStyles += `${ colorMap[ colorType ] }: ${ colors[ colorType ] };\n`;
        }
    });

    const css = sass.renderSync({
        data:         customStyles + uikitSass,
        outputStyle: 'compressed',
    });

    /**
     * @todo Take me to the page I was on, not index.html 
     */
    const html = (await fs.readFileSync(path.join(__dirname, "/../templates/full-page/index.html"), "utf-8"))
        .replace("<!--INJECTED STYLES-->",`<style>${css.css}</style>`);

    res.send(html);
});

app.listen(port, () => console.log(`Listening on http://localhost:${port} ...`))

module.exports = app;