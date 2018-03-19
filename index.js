// External Dependencies
const express = require('express');
const bluebirdRequest = require('request-promise');
const bodyParser = require('body-parser');

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
