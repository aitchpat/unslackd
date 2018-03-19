// External Dependencies
import { Request, Response } from 'express';
import BluebirdRequest from 'request-promise';

const searchBeers = (req, res) => {
    let searchNum = 0;
    if(req.body.text.indexOf('SEARCHNUMBER') > -1){
        searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
        searchNum = searchNum * 3;
    }
    var numBeers = 0;
    var attachments = [];
    const searchURL = `https://api.untappd.com/v4/search/beer?q=${req.body.text}&client_id=${untappdClientId}&client_secret=${untappdClientSecret}`

    return BluebirdRequest(searchURL).then((body) => {
        const numBeers = body.beers.count;
        const beers = body.beers.items;
        const attachments = [];

        for (const i = 0; i < searchNum + 3; i++) {
            const thisBeer = beers[i];
            let beerRating = 0;
            let beerNumRatings = 0;
            const beerInfoURL = `https://api.untappd.com/v4/beer/info/${thisBeer.beer.bid}&client_id=${untappdClientId}&client_secret=${untappdClientSecret}`;
            BluebirdRequest(beerInfoURL).then((beerInfoBody) => {
                beerRating = beerInfoBody.beer.rating_score;
                beerNumRatings = beerInfoBody.beer.rating_score;
                console.log(`${beerRating} out of ${beerNumRatings}`)
            }).catch((beerInfoErr) => {
                console.log(`Unable to get beer info for ${thisBeer.beer.beer_name}`);
                console.log(beerInfoErr);
            });
            const thisAttachment = {
                color: '#ffcc00',
                author_name: thisBeer.brewery.brewery_name,
                author_link: `https://untappd.com/w/${thisBeer.brewery.brewery_slug}/${thisBeer.brewery.brewery_id}`,
                author_icon: thisBeer.brewery.brewery_label,
                title: thisBeer.beer.beer_name,
                title_link: `https://untappd.com/b/${thisBeer.beer.beer_slug}/${thisBeer.beer.bid}`,
                text: thisBeer.beer.beer_description,
                fields: [
                    {
                        title: 'Rating',
                        value: `${beer_Rating}/5 from ${beer_RateCount} reviews`
                    },
                    {
                        title: "Style",
                        value: thisBeer.beer.beer_style
                    }
                ],
                image_url: thisBeer.beer.beer_label
            };
            attachments.push(thisAttachment);
        }

        const payload = {
            response_type: "in_channel",
            text: `${numBeers} beers found, first three shown below`,
            attachments: attachments
        };
        res.send(payload);
    }).then((err) => {
        res.send('Error! Unable to connect to Untappd at this time');
        return;
    });
};

export default {
    searchBeers
};
