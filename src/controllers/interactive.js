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
      if(searchNum * 3 < numBeers) {
        const buttonAttachment = buildButtonAttachment(beerName, searchNum);
        theAttachments.push(buttonAttachment);
      }

      // We have processed the search results, send back the info
      let beerS = numBeers > 1 ? 'beers' : 'beer';
      const processedResults = {
        replace_original: true,
        response_type: 'ephemeral',
        text: `${numBeers} ${beerS} found, ${searchStart + 1} through ${searchStart + theAttachments.length} shown below`,
        attachments: theAttachments,
      };
      console.log(`${theAttachments.length} attachments ready representing beers ${searchStart + 1} through ${searchStart + theAttachments.length}`);
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
    console.log(payload);

    const sharedAttachments = [await UntappdOperations.createSharedAttachment(action.value)];

    const result = {
      replace_original: false,
      response_type: 'in_channel',
      attachments: sharedAttachments,
    };
    console.log('Attachment ready to share');

    return result;
  });

const reSearch = slackMessages.expressMiddleware();


export default{
  reSearch,
};
