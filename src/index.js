// External Dependencies
import express from 'express';
import bodyParser from 'body-parser';

// const { createMessageAdapter } = require('@slack/interactive-messages');

// // Initialize using verification token from environment variables
// const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
// Internal Dependencies
// Routes
import Router from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('/views'));
// Mount Routes
Router.mountRoutes(app);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`UnSlackd listening on port: ${PORT}`);
});
