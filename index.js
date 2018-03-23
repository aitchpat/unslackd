// External Dependencies
import express from 'express';
import bodyParser from 'body-parser';

// Internal Dependencies
// Routes
import Router from './routes';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Mount Routes
Router.mountRoutes(app);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`UnSlackd listening on port: ${PORT}`);
});
