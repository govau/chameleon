# Chameleon 🦎  [![CircleCI](https://circleci.com/gh/govau/chameleon.svg?style=svg)](https://circleci.com/gh/govau/chameleon)

> Interactive colour template previews for the Design System.

Chameleon allows users to change and share different colour palettes using the Australian Government Design System. It is an express server that takes query parameters altering the apperance of the template. 

You can access it through a user interface at [https://designsystem.gov.au/templates/home/customise](https://designsystem.gov.au/templates/home/customise) if you want to use it locally you can follow the instructions below. 


## Install


Clone chameleon into a local directory:
```
git clone git@github.com:govau/chameleon.git
```

Make sure you are in your cloned directory and install the dependencies:

```node
npm install
```

Then run `npm start` or `npm watch`.


## Getting started

Once the server is running you should be able to connect to it with [http://localhost:3000/chameleon](http://localhost:3000/chameleon).

Chameleon looks like a full page template using the Australian Government Design System. It has multiple templates in the `/templates` directory. You can access the templates by navigating to the url [http://localhost:3000/chameleon/content](http://localhost:3000/chameleon/content).

To change the colours you can add a query parameter. [http://localhost:3000/chameleon/content?action=red&background=#eee](http://localhost:3000/chameleon/content?action=red&background=#eee).

The supported query parameters are `text`, `action`, `focus`, `background` and `textDark`, `actionDark`, `focusDark`, `backgroundDark`. Using these queries you can modify the templates and share them.


## How it works

The express server reads the data from the HTML files based on the URL. If there are valid query parameters it generates a new stylesheet and replaces the `<link rel="stylesheet" href="/chameleon/assets/css/main.css">` with the new styles. If there is an invalid colour entered it will log errors in the page template returned to the user.

We then serve the API to our users in an iframe, allowing users to modify the user interface with a form on the frontend. As we use query parameters the custom templates can be shared with peers.


## Contributing

Wuhuu thanks for considering contributing! We are always looking to make chameleon better, please have a look at our [issues](issues) and use the above documentation to make changes and create a pull request.


## Release history

- v1.0.0 - 🎉 Initial release


# Contributors:
<div style="display:inline;">
  <a href="https://github.com/adamzerella"><img width="64" height="64" src="https://avatars0.githubusercontent.com/u/1501560?s=460&v=4" alt="Adam A. Zerella"/></a>
  <a href="https://github.com/alex-page"><img width="64" height="64" src="https://avatars0.githubusercontent.com/u/19199063?s=460&v=4" alt="Alex Page"/></a>
  <a href="href="https://github.com/sukhrajghuman"><img width="64" height="64" src="https://avatars1.githubusercontent.com/u/20184809?s=460&v=4" alt="Sukhraj Ghuman"/></a>
</div>

