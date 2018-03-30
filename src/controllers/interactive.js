import createMessageAdapter from '@slack/interactive-messages';

const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);

slackMessages.action('interactive_beer_search', (payload) => {
  // `payload` is JSON that describes an interaction with a message.
  console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed the load more button`);

  // The `actions` array contains details about the specific action (button press, menu selection, etc.)
  const action = payload.actions[0];
  console.log(`The button had name ${action.name} and value ${action.value}`);
});

const logMessages = slackMessages.expressMiddleware();

export default{
  logMessages,
}