// External Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import createMessageAdapter from '@slack/interactive-messages';

// Internal Dependencies
// Routes
import Router from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
app.use('/interactive', slackMessages.expressMiddleware());

slackMessages.action('interactive_beer_search', (payload) => {
  // `payload` is JSON that describes an interaction with a message.
  console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed the load more button`);

  // The `actions` array contains details about the specific action (button press, menu selection, etc.)
  const action = payload.actions[0];
  console.log(`The button had name ${action.name} and value ${action.value}`);
});

// Mount Routes
Router.mountRoutes(app);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`UnSlackd listening on port: ${PORT}`);
});
