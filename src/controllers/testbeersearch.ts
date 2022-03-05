import type { Request, Response } from 'express';

import UntappdOperations from '~/operations/untappd';

const buildButtonAttachment = (beerName: string, searchNum: number) => ({
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

const searchBeersByName = async (req: Request, res: Response) => {
  try {
    let searchNum = 0;
    let searchStart = searchNum;
    if (req.body.text.indexOf('SEARCHNUMBER') > -1) {
      searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
      searchStart = searchNum * 3;
    }
    searchNum += 1;
    console.log(`Search #${searchNum} begins`);

    // Search for a beer on Untappd by name
    const beerName = req.body.text;
    const { attachments, numBeers } = await UntappdOperations.testProcessSearchResults(beerName);
    const theAttachments = attachments.slice(searchStart, searchStart + 3);
    let nextButtonAttached = false;
    console.log(`numBeers: ${numBeers}, searchStart plus 3: ${searchStart + 3}, theAttachments.length: ${theAttachments.length}`);
    if ((searchStart + 3) < numBeers) {
      const buttonAttachment = buildButtonAttachment(beerName, searchNum);
      theAttachments.push(buttonAttachment);
      console.log('Added button attachment');
      nextButtonAttached = true;
    }

    const adjustment = nextButtonAttached ? 1 : 0;

    // We have processed the search results, send back the info
    const beerS = numBeers > 1 ? 'beers' : 'beer';
    const payload = {
      response_type: 'ephemeral',
      text: `${numBeers} ${beerS} found, ${searchStart + 1} through ${searchStart + theAttachments.length - adjustment} shown below`,
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
