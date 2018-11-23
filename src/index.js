const express = require('express')
const helmet = require('helmet');
const path = require("path");
const sass = require("node-sass");
const fs = require("fs");

const app = express()

const port = 3000
const uikitSass = fs.readFileSync( './pancake.scss', 'utf-8' );

app.use(helmet());

// Load the index.html 
app.use('/', express.static(path.join(__dirname, '/../public')))

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
        const colorValue = colors[ colorType ];

        if( colorValue ) {
            customStyles += `${ colorMap[ colorType ] }: ${ colors[ colorType ] };\n`;
        }
    });

    const css = sass.renderSync({
        data:         customStyles + uikitSass,
        outputStyle: 'compressed',
    });

    const html = (await fs.readFileSync(path.join(__dirname, "/../templates/full-page/index.html"), "utf-8"))
        .replace("<!--INJECTED STYLES-->",`<style>${css.css}</style>`);

    res.send(html);
});

app.listen(port, () => console.log(`Listening on http://localhost:${port} ...`))