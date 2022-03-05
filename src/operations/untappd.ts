import UntappdService from '~/services/untappd';

const createBeerAttachment = (theBeer: any, theBeerRating: number, theBeerNumRatings: number) => {
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

const testCreateBeerAttachment = (theBeer: any) => {
  const thisAttachment = {
    color: '#ffcc00',
    callback_id: 'share_to_channel',
    author_name: theBeer.brewery.brewery_name,
    author_link: `https://untappd.com/w/${theBeer.brewery.brewery_slug}/${theBeer.brewery.brewery_id}`,
    author_icon: theBeer.brewery.brewery_label,
    title: theBeer.beer.beer_name,
    title_link: `https://untappd.com/b/${theBeer.beer.beer_slug}/${theBeer.beer.bid}`,
    text: theBeer.beer.beer_description,
    fields: [
      {
        title: 'Style',
        value: theBeer.beer.beer_style,
      },
    ],
    image_url: theBeer.beer.beer_label,
    actions: [
      {
        name: 'shareButton',
        text: 'Share to channel',
        type: 'button',
        value: `${theBeer.beer.bid}`,
      },
    ],
  };
  return thisAttachment;
};

const processBeer = async (beerToProcess: any) => {
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

const createSharedAttachment = async (payload) => {
  try {
    const beerID = payload.actions[0].value;
    const beerInfoRes = await UntappdService.beerInfo(beerID);
    const beerInfoBody = beerInfoRes.response;
    const theBeer = beerInfoBody.beer;
    const theBrewery = theBeer.brewery;
    // Create an object to send back to Slack with the info
    const thisAttachment = {
      color: '#ffcc00',
      callback_id: 'share_to_channel',
      author_name: theBrewery.brewery_name,
      author_link: `https://untappd.com/w/${theBrewery.brewery_slug}/${theBrewery.brewery_id}`,
      author_icon: theBrewery.brewery_label,
      title: theBeer.beer_name,
      title_link: `https://untappd.com/b/${theBeer.beer_slug}/${theBeer.bid}`,
      text: theBeer.beer_description,
      fields: [
        {
          title: 'Rating',
          value: `${theBeer.rating_score.toFixed(2)}/5 from ${theBeer.rating_count} reviews`,
        },
        {
          title: 'Style',
          value: theBeer.beer_style,
        },
        {
          title: 'Shared by',
          value: `<@${payload.user.id}>`,
        }
      ],
      image_url: theBeer.beer_label,
    };
    return thisAttachment;
  } catch (err) {
    console.log('Unable to get rating info');
    console.log(err);
    return null;
  }
};

const processSearchResults = async (beerName: string) => {
  let res;
  let body;
  let beers;
  let numBeers;

  // Search for a beer by name
  try {
    res = await UntappdService.beerSearch(beerName);
    body = res.response;
    beers = body.beers.items;
    numBeers = body.beers.items.length;
  } catch (searchErr) {
    console.log(`Error searching for beer: ${beerName}`);
    console.log(searchErr);
  }

  // Get the information for each of the beers in the search results
  const attachments = await Promise.all(beers.map(processBeer));

  // Return the information
  return {
    attachments,
    numBeers,
  };
};

const testProcessSearchResults = async (beerName: string) => {
  let res;
  let body;
  let beers;
  let numBeers;

  // Search for a beer by name
  try {
    res = await UntappdService.beerSearch(beerName);
    body = res.response;
    beers = body.beers.items;
    numBeers = body.beers.items.length;
  } catch (searchErr) {
    console.log(`Error searching for beer: ${beerName}`);
    console.log(searchErr);
  }

  // Get the information for each of the beers in the search results
  const attachments = [];
  for (let b = 0; b < beers.length; b += 1) {
    attachments.push(testCreateBeerAttachment(beers[b]));
  }

  // Return the information
  return {
    attachments,
    numBeers,
  };
};

export default {
  processSearchResults,
  createBeerAttachment,
  testProcessSearchResults,
  testCreateBeerAttachment,
  createSharedAttachment,
};
