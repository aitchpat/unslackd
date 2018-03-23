// External Dependencies
import BluebirdRequest from 'request-promise';

// Secrets
const untappdClientID = process.env.UNTAPPD_CLIENT_ID;
const untappdClientSecret = process.env.UNTAPPD_CLIENT_SECRET;

const beerSearch = (beerName) => {
  const requestOptions = {
    method: 'GET',
    url: 'https://api.untappd.com/v4/search/beer',
    qs: {
      q: beerName,
      client_id: untappdClientID,
      client_secret: untappdClientSecret,
    },
    json: true,
  };
  return BluebirdRequest(requestOptions);
};

const beerInfo = (bid) => {
  const requestOptions = {
    method: 'GET',
    url: `https://api.untappd.com/v4/beer/info/${bid}`,
    qs: {
      client_id: untappdClientID,
      client_secret: untappdClientSecret,
    },
    json: true,
  };
  return BluebirdRequest(requestOptions);
};

export default {
  beerSearch,
  beerInfo,
};
