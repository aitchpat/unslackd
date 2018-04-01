/* eslint-disable arrow-body-style */
// External Dependencies
import Bluebird from 'bluebird';

// Internal Dependencies

// Services
import UntappdService from '../services/untappd';

const createBeerAttachment = (theBeer, theBeerRating, theBeerNumRatings) => {
  const thisAttachment = {
    color: '#ffcc00',
    author_name: theBeer.brewery.brewery_name,
    author_link: `https://untappd.com/w/${theBeer.brewery.brewery_slug}/${theBeer.brewery.brewery_id}`,
    author_icon: theBeer.brewery.brewery_label,
    title: theBeer.beer.beer_name,
    title_link: `https://untappd.com/b/${theBeer.beer.beer_slug}/${theBeer.beer.bid}`,
    text: theBeer.beer.beer_description,
    fields: [
      {
        title: 'Rating',
        value: `${theBeerRating}/5 from ${theBeerNumRatings} reviews`,
      },
      {
        title: 'Style',
        value: theBeer.beer.beer_style,
      },
    ],
    image_url: theBeer.beer.beer_label,
  };
  return thisAttachment;
};

const processBeer = async (beerToProcess) => {
  const beerID = beerToProcess.beer.bid;

  try {
    const beerInfoRes = await UntappdService.beerInfo(beerID);
    const beerInfoBody = beerInfoRes.response;

    // Create an object to send back to Slack with the info
    const beerRating = beerInfoBody.beer.rating_score.toFixed(2);
    const beerNumRatings = beerInfoBody.beer.rating_count;
    const beerAttachment = createBeerAttachment(beerToProcess, beerRating, beerNumRatings);
    return beerAttachment;
  } catch (err) {
    console.log(`Unable to get beer info for ${beerToProcess.beer.beer_name}`);
    console.log(err);
    return null;
  }
};

const processSearchResults = async (beerName) => {
  let res;
  let body;
  let beers;
  let numBeers;

  // Search for a beer by name
  try {
    res = await UntappdService.beerSearch(beerName);
    body = res.response;
    beers = body.beers.items;
    numBeers = body.beers.items.length - 1;
  } catch (searchErr) {
    console.log(`Error searching for beer: ${beerName}`);
    console.log(searchErr);
  }

  // Get the information for each of the beers in the search results
  const attachments = await Bluebird.map(beers, processBeer);

  // Return the information
  return {
    attachments,
    numBeers,
  };
};

export default {
  processSearchResults,
  createBeerAttachment,
};
