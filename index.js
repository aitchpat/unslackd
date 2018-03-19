// External Dependencies
const express = require('express');
const bluebirdRequest = require('request-promise');
const bodyParser = require('body-parser');

// Secrets
const slackClientId = process.env.SLACK_CLIENT_ID;
const slackClientSecret = process.env.SLACK_CLIENT_SECRET;
const untappdClientId = process.env.UNTAPPD_CLIENT_ID;
const untappdClientSecret = process.env.UNTAPPD_CLIENT_SECRET;

// Routes
import Router from './routes'

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Mount Routes
Router.mountRoutes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`UnSlackd listening on port: ${PORT}`);
});
