// External Dependencies
import { Request, Response } from 'express';
import BluebirdRequest from 'request-promise';
import Bluebird from 'bluebird';

// Secrets
const untappdClientID = process.env.UNTAPPD_CLIENT_ID;
const untappdClientSecret = process.env.UNTAPPD_CLIENT_SECRET;

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
                value: `${theBeerRating}/5 from ${theBeerNumRatings} reviews`
            },
            {
                title: 'Style',
                value: theBeer.beer.beer_style
            }
        ],
        image_url: theBeer.beer.beer_label
    };
};

const searchBeers = (req, res) => {
    let searchNum = 0;
    if (req.body.text.indexOf('SEARCHNUMBER') > -1) {
        searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
        searchNum = searchNum * 3;
    }
    const numBeers = 0;
    const attachments = [];
    const searchURL = 'https://api.untappd.com/v4/search/beer'
    const queryParams = {
        q: req.body.text,
        client_id: untappdClientID,
        client_secret: untappdClientSecret,
    };
    const requestOptions = {
        url: searchURL,
        qs: queryParams,
    };
    return BluebirdRequest(requestOptions).then((body) => {
        const numBeers = body.beers.count;
        const beers = body.beers.items;
        const attachments = [];

        return Bluebird.map(beers, (thisBeer) => {
            const beerInfoURL = `https://api.untappd.com/v4/beer/info/${thisBeer.beer.bid}`;
            const beerInfoQueryParams = {
                client_id: untappdClientID,
                client_secret: untappdClientSecret,
            }
            const beerInfoRequestOptions = {
                url: beerInfoURL,
                qs: beerInfoQueryParams,
            }
            return BluebirdRequest(beerInfoRequestOptions).then((beerInfoBody) => {
                const beerRating = beerInfoBody.beer.rating_score;
                const beerNumRatings = beerInfoBody.beer.rating_count;
                const beerAttachment = createBeerAttachment(thisBeer, beerRating, beerNumRatings);
                attachments.push(beerAttachment);
            }).catch((beerInfoErr) => {
                console.log(`Unable to get beer info for ${thisBeer.beer.beer_name}`);
                console.log(beerInfoErr);
            })
        }).then(() => {
            const payload = {
                response_type: "in_channel",
                text: `${numBeers} beers found, first three shown below`,
                attachments: attachments,
            };
            res.send(payload);
        });
    }).catch((err) => {
        res.send('Error! Unable to connect to Untappd at this time');
        return;
    });
};

export default {
    searchBeers
};
