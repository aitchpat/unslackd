import UntappdOperations from '../operations/untappd';
const { createMessageAdapter } = require('@slack/interactive-messages');

// Initialize using verification token from environment variables
const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);

slackMessages.action('interactive_beer_search', (payload) => {
  // `payload` is JSON that describes an interaction with a message.
  console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed the load more button`);

  // The `actions` array contains details about the specific action (button press, menu selection, etc.)
  const action = payload.actions[0];
  console.log(`The button had name ${action.name} and value ${action.value}`);

  let searchNum = 0;
  let searchStart = searchNum;
  let beerName = action.value;
  if (beerName.indexOf('SEARCHNUMBER') > -1) {
    searchNum = beerName.substring(beerName.indexOf('SEARCHNUMBER'));
    searchStart = searchNum * 3;
    beerName = beerName.substring(0,beerName.indexOf('SEARCHNUMBER'));
  }
  searchNum += 1;
  // Search for a beer on Untappd by name
  let nextSearch = UntappdOperations.processSearchResults(beerName).then((results) => {
    const { attachments, numBeers } = results;
    var theAttachments = attachments.slice(searchStart, searchStart + 3);
    const buttonAttachment = {
      text: "Not these beers? Load some more",
      fallback: "You are unable to load more beers",
      callback_id: "interactive_beer_search",
      color: "#ffcc00",
      attachment_type: "default",
      actions: [
          {
              name: "nextButton",
              text: "Next",
              type: "button",
              value: beerName + "SEARCHNUMBER" + searchNum
          }
      ]
    }
    theAttachments.push(buttonAttachment);
    // We have processed the search results, send back the info
    const payload = {
      response_type: 'ephemeral',
      text: `${numBeers} beers found, ${searchStart + 1} through ${searchStart + 3} shown below`,
      attachments: theAttachments
    };
    return payload;
    res.send(payload);
  }).catch((err) => {
    console.log(`Error processing results: ${err}`);
    return 'Error! Unable to connect to Untappd at this time';
  });
});

const reSearch = slackMessages.expressMiddleware();

export default{
  reSearch,
}