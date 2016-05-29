// When the app is built for development, DHIS_CONFIG is replaced with the config read from $DHIS2_HOME/config.js[on]
// When the app is built for production, process.env.NODE_ENV is replaced with the string 'production', and
// DHIS_CONFIG is replaced with an empty object
const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

// This code will only be included in non-production builds of the app
// It sets up the Authorization header to be used during CORS requests
// This way we can develop using webpack without having to install the application into DHIS2.
if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ headers: { Authorization: dhisDevConfig.authorization } }); // eslint-disable-line
}

import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import { init, config, getManifest } from 'd2/lib/d2';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

// The react-tap-event-plugin is required by material-ui to make touch screens work properly with onClick events
import 'react-tap-event-plugin';

import App from './components/app.component';
import './app.scss';

// import userSettingsActions from './userSettingsActions';
// import userSettingsStore from './userSettingsStore';

// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
render(<LoadingMask />, document.getElementById('app'));

/**
 * Renders the application into the page.
 *
 * @param d2 Instance of the d2 library that is returned by the `init` function.
 */
function startApp(d2) {

    d2.models.organisationUnits.list({ paging: false, level: 1, fields: 'id,displayName,children::isNotEmpty' })
        .then(rootLevel => rootLevel.toArray()[0])
        .then(rootUnit => {
            render(<App d2={d2} root={rootUnit} />, document.getElementById('app'));
        })
        .catch(err => console.log('failed to initialise d2'+err));
}


// Load the application manifest to be able to determine the location of the Api
// After we have the location of the api, we can set it onto the d2.config object
// and initialise the library. We use the initialised library to pass it into the app
// to make it known on the context of the app, so the sub-components (primarily the d2-ui components)
// can use it to access the api, translations etc.
getManifest('./manifest.webapp')
    .then(manifest => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api`;
    })
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));
