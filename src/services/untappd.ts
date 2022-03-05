import fetch from 'node-fetch';

// Secrets
const untappdClientID = process.env.UNTAPPD_CLIENT_ID;
const untappdClientSecret = process.env.UNTAPPD_CLIENT_SECRET;

const beerSearch = (beerName: string) => {
  const url = 'https://api.untappd.com/v4/search/beer';
  const queryParams = new URLSearchParams({
    q: beerName,
    client_id: untappdClientID,
    client_secret: untappdClientSecret,
  });
  return fetch(`${url}?${queryParams}`).then((res) => res.json());
};

const beerInfo = (bid: string) => {
  const url = `https://api.untappd.com/v4/beer/info/${bid}`;
  const queryParams = new URLSearchParams({
    client_id: untappdClientID,
    client_secret: untappdClientSecret,
  });
  return fetch(`${url}?${queryParams}`).then((res) => res.json());
};

export default {
  beerSearch,
  beerInfo,
};
