import type { Request, Response } from 'express';

import UntappdOperations from '~/operations/untappd';

const buildResultsPayload = (searchAttachments: unknown[], numBeers: number, searchNum: number) => {
  const beerS = numBeers > 1 ? 'beers' : 'beer';
  const attachments = searchAttachments.slice(searchNum, searchNum + 3);
  return {
    response_type: 'in_channel',
    text: `${numBeers} ${beerS} found, first ${attachments.length} shown below`,
    attachments,
  };
};

const searchBeersByName = async (req: Request, res: Response) => {
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
