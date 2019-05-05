// Internal Dependencies

// Operations
import UntappdOperations from '../operations/untappd';

const buildResultsPayload = (searchAttachments, numBeers, searchNum) => ({
  response_type: 'in_channel',
  text: `${numBeers} beers found, first three shown below`,
  attachments: searchAttachments.slice(searchNum, searchNum + 3),
});

const searchBeersByName = async (req, res) => {
  try {
    let searchNum = 0;
    if (req.body.text.indexOf('SEARCHNUMBER') > -1) {
      searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
      searchNum *= 3;
    }

    // Search for a beer on Untappd by name
    const beerName = req.body.text;

  
    const { attachments, numBeers } = await UntappdOperations.processSearchResults(beerName);
    // We have processed the search results, send back the info
    const payload = buildResultsPayload(attachments, numBeers, searchNum);
    res.send(payload);
  } catch (err) {
    console.log(`Error processing results: ${err}`);
    res.send('Error! Unable to connect to Untappd at this time');
  }
};

export default {
  searchBeersByName,
};
