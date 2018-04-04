// External Dependencies
import { createMessageAdapter } from '@slack/interactive-messages';

// Internal Dependencies
import UntappdOperations from '../operations/untappd';

const buildButtonAttachment = (beerName, searchNum) => ({
  text: 'Not these beers? Load some more',
  fallback: 'You are unable to load more beers',
  callback_id: 'interactive_beer_search',
  color: '#ffcc00',
  attachment_type: 'default',
  actions: [
    {
      name: 'nextButton',
      text: 'Next',
      type: 'button',
      value: `${beerName}SEARCHNUMBER${searchNum}`,
    },
  ],
});

// Initialize using verification token from environment variables
const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);

slackMessages
  .action('interactive_beer_search', async (payload) => {
    // `payload` is JSON that describes an interaction with a message.
    console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed the load more button`);

    // The `actions` array contains details about the specific
    // action (button press, menu selection, etc.)
    const action = payload.actions[0];
    console.log(`The button had name ${action.name} and value ${action.value}`);

    let searchNum = 0;
    let searchStart = searchNum;
    let beerName = action.value;
    if (beerName.indexOf('SEARCHNUMBER') > -1) {
      searchNum = parseInt(beerName.substring(beerName.indexOf('SEARCHNUMBER') + 12), 10);
      searchStart = searchNum * 3;
      beerName = beerName.substring(0, beerName.indexOf('SEARCHNUMBER'));
    }
    searchNum += 1;
    console.log(`Search #${searchNum} begins`);

    // Search for a beer on Untappd by name
    try {
      const { attachments, numBeers } = await UntappdOperations.testProcessSearchResults(beerName);
      const theAttachments = attachments.slice(searchStart, searchStart + 3);
      const buttonAttachment = buildButtonAttachment(beerName, searchNum);
      theAttachments.push(buttonAttachment);

      // We have processed the search results, send back the info
      const processedResults = {
        replace_original: true,
        response_type: 'ephemeral',
        text: `${numBeers} beers found, ${searchStart + 1} through ${searchStart + 3} shown below`,
        attachments: theAttachments,
      };
      console.log(`${theAttachments.length} attachments ready representing beers ${searchStart + 1} through ${searchStart + 3}`);
      return processedResults;
    } catch (err) {
      console.log(`Error processing results: ${err}`);
      return 'Error! Unable to connect to Untappd at this time';
    }
  })
  .action('share_to_channel', async (payload) => {
    // `payload` is JSON that describes an interaction with a message.
    console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed the share to channel button`);

    // The `actions` array contains details about the specific
    // action (button press, menu selection, etc.)
    const action = payload.actions[0];
    console.log(`The button had name ${action.name} and value ${action.value}`);

    const replacement = payload.original_message;
    let attachmentNum = 0;
    for (let a = 0; a < replacement.attachments.length; a += 1) {
      if (replacement.attachments[a].actions[0].value === action.value) {
        attachmentNum = a;
        break;
      }
    }
    let beerToShare = replacement.attachments[attachmentNum];
    const ratingField = {
      title: 'Rating',
      value: UntappdOperations.getBeerRating,
    };
    beerToShare.fields.push(ratingField);
    const result = {
      response_type: 'in_channel',
      text: `${beerToShare.title} on Untappd`,
      attachments: beerToShare,
    };
    return result;
  });

const reSearch = slackMessages.expressMiddleware();

export default{
  reSearch,
};
