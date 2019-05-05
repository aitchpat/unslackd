// Internal Dependencies

// Operations
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

const searchBeersByName = async (req, res) => {
  try {
    let searchNum = 0;
    let searchStart = searchNum;
    if (req.body.text.indexOf('SEARCHNUMBER') > -1) {
      searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
      searchStart = searchNum * 3;
    }
    searchNum += 1;

    // Search for a beer on Untappd by name
    const beerName = req.body.text;
    const { attachments, numBeers } = await UntappdOperations.testProcessSearchResults(beerName);
    const theAttachments = attachments.slice(searchStart, searchStart + 3);
    const buttonAttachment = buildButtonAttachment(beerName, searchNum);
    theAttachments.push(buttonAttachment);

    // We have processed the search results, send back the info
    const payload = {
      response_type: 'ephemeral',
      text: `${numBeers} beers found, ${searchStart + 1} through ${searchStart + 3} shown below`,
      attachments: theAttachments,
    };
    res.send(payload);
  } catch (err) {
    console.log(`Error processing results: ${err}`);
    res.send('Error! Unable to connect to Untappd at this time');
  }
};

export default {
  searchBeersByName,
};
