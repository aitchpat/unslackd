// External Dependencies
import { Request, Response } from 'express';
import BluebirdRequest from 'request-promise';
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
            }
        ],
        image_url: theBeer.beer.beer_label,
    };
    return createBeerAttachment;
};

const searchBeersByName = (req, res) => {
    let searchNum = 0;
    if (req.body.text.indexOf('SEARCHNUMBER') > -1) {
        searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
        searchNum = searchNum * 3;
    }

    // Search for a beer on Untappd by name
    const beerName = req.body.text;
    return UntappdService.beerSearch(beerName).then((body) => {
        const beers = body.beers.items;
        const numBeers = body.beers.count;
        const attachments = [];

        // Get the information for each of the beers
        return Bluebird.map(beers, (thisBeer) => {
            const thisBeerID = thisBeer.beer.bid;
            return UntappdService.beerInfo(thisBeerID).then((beerInfoBody) => {
                // Create an object to send back to Slack with the info
                const beerRating = beerInfoBody.beer.rating_score;
                const beerNumRatings = beerInfoBody.beer.rating_count;
                const beerAttachment = createBeerAttachment(thisBeer, beerRating, beerNumRatings);
                attachments.push(beerAttachment);
            }).catch((beerInfoErr) => {
                console.log(`Unable to get beer info for ${thisBeer.beer.beer_name}`);
                console.log(beerInfoErr);
            })
        }).then(() => {
            // We have processed the search results, send back the info
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
    searchBeersByName
};
