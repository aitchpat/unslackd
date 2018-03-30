/* eslint-disable no-console */
// Internal Dependencies

// Operations
import UntappdOperations from '../operations/untappd';

const searchBeersByName = (req, res) => {
  let searchNum = 0;
  let searchStart = searchNum;
  if (req.body.text.indexOf('SEARCHNUMBER') > -1) {
    searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
    searchStart = searchNum * 3;
  }
  searchNum += 1;
  // Search for a beer on Untappd by name
  const beerName = req.body.text;
  return UntappdOperations.processSearchResults(beerName).then((results) => {
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
      response_type: 'in_channel',
      text: `${numBeers} beers found, first three shown below`,
      attachments: theAttachments,
      actions: [
        {
          name: "nextSearch",
          text: "Next",
          type: "button",
          value: searchNum,
        }
      ]
    };
    res.send(payload);
  }).catch((err) => {
    console.log(`Error processing results: ${err}`);
    res.send('Error! Unable to connect to Untappd at this time');
  });
};

export default {
  searchBeersByName,
};
