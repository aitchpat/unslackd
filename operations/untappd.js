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

const processSearchResults = beerName => UntappdService.beerSearch(beerName).then((res) => {
  const body = res.response;
  const beers = body.beers.items;
  const numBeers = body.beers.count;

  // Get the information for each of the beers
  return Bluebird.map(beers, (thisBeer) => {
    const thisBeerID = thisBeer.beer.bid;
    return UntappdService.beerInfo(thisBeerID).then((beerInfoRes) => {
      const beerInfoBody = beerInfoRes.response;
      // Create an object to send back to Slack with the info
      const beerRating = beerInfoBody.beer.rating_score;
      const beerNumRatings = beerInfoBody.beer.rating_count;
      const beerAttachment = createBeerAttachment(thisBeer, beerRating, beerNumRatings);
      return beerAttachment;
    }).catch((beerInfoErr) => {
      console.log(`Unable to get beer info for ${thisBeer.beer.beer_name}`);
      console.log(beerInfoErr);
    });
  }).then(attachments => ({
    attachments,
    numBeers,
  }));
});

export default {
  processSearchResults,
  createBeerAttachment,
};
