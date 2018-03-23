// External Dependencies
import express from 'express';
import bodyParser from 'body-parser';

// Internal Dependencies
// Routes
import Router from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mount Routes
Router.mountRoutes(app);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`UnSlackd listening on port: ${PORT}`);
});
