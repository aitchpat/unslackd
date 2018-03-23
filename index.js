// External Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Internal Dependencies
// Routes
import Router from './src/routes';

// Configure ENV
dotenv.config({ silent: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mount Routes
Router.mountRoutes(app);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`UnSlackd listening on port: ${PORT}`);
});
