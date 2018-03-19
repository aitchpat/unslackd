// Import express and request modules
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

// Slack's ID and Secret
var clientId = process.env.SLACKCLIENTID;
var clientSecret = process.env.SLACKCLIENTSECRET;
//Untappd ID and Secret
const untappdClientId = process.env.UNTAPPDCLIENTID;
const untappdClientSecret = process.env.UNTAPPDCLIENTSECRET;


var app = express();
app.use(bodyParser.urlencoded({ extended: false }));


const PORT=process.env.PORT;

app.listen(PORT, function () {
    console.log("UnSlackd listening on port " + PORT);
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
            method: 'GET',

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

app.post('/beer', function(req, res) {
    var searchNum = 0;
    if(req.body.text.indexOf('SEARCHNUMBER') > -1){
        searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
        searchNum = searchNum * 3;
    }
    var numBeers = 0;
    var attachments = [];
    var searchURL = "https://api.untappd.com/v4/search/beer?q=" + req.body.text + "&client_id=" + untappdClientId + "&client_secret=" + untappdClientSecret;
    request(searchURL,function(error,response,body){
        if(error){
            res.send("Error! Unable to connect to Untappd at this time");
        }else{
            var obj = JSON.parse(body);
            if(obj.meta.code != 200){
                res.send("Error! Unable to connect to Untappd at this time");
            }else{
                var numBeers = obj.response.beers.count;
                //res.send(numBeers + " beers found!");
                var beers = obj.response.beers.items;
                var attachments = [];
                for(var i = searchNum; i < searchNum + 3; i++){
                    var thisBeer = obj.response.beers.items[i];
                    var beer_Rating = 0;
                    var beer_RateCount = 0;
                    var beerInfoURL = "https://api.untappd.com/v4/beer/info/" + thisBeer.beer.bid + "&client_id=" + untappdClientId + "&client_secret=" + untappdClientSecret;
                    request(beerInfoURL,function(infoError,infoResponse,infoBody){
                        if(infoError){
                            console.log("Unable to get beer info for " + thisBeer.beer.beer_name);
                            console.log(infoError);
                        }else{
                            var info = JSON.parse(infoBody);
                            beer_Rating = info.response.beer.rating_score;
                            beer_RateCount = info.response.beer.rating_count;
                            console.log(beer_Rating + " out of " + beer_RateCount);
                        }
                    })
                    var thisAttachment = {
                        "color": "#ffcc00",
                        "author_name": thisBeer.brewery.brewery_name,
                        "author_link": "https://untappd.com/w/" + thisBeer.brewery.brewery_slug + "/" + thisBeer.brewery.brewery_id,
                        "author_icon": thisBeer.brewery.brewery_label,
                        "title": thisBeer.beer.beer_name,
                        "title_link": "https://untappd.com/b/" + thisBeer.beer.beer_slug + "/" + thisBeer.beer.bid,
                        "text": thisBeer.beer.beer_description,
                        "fields": [
                            {
                                "title": "Rating",
                                "value": beer_Rating + "/5 from " + beer_RateCount + " reviews"
                            },
                            {
                                "title": "Style",
                                "value": thisBeer.beer.beer_style
                            }
                        ],
                        "image_url": thisBeer.beer.beer_label
                    };
                    attachments.push(thisAttachment);
                }
                var payload = {
                    "response_type": "in_channel",
                    "text": numBeers + " beers found, first three shown below",
                    "attachments": attachments
                };
                res.send(payload);
            }
        };

    });
});

app.post('/beertest', function(req, res) {
    var searchNum = 0;
    if(req.body.text.indexOf('SEARCHNUMBER') > -1){
        searchNum = req.body.text.substring(req.body.text.indexOf('SEARCHNUMBER'));
        searchNum = searchNum * 3;
    }
    var numBeers = 0;
    var attachments = [];
    var searchURL = "https://api.untappd.com/v4/search/beer?q=" + req.body.text + "&client_id=" + untappdClientId + "&client_secret=" + untappdClientSecret;
    request(searchURL,function(error,response,body){
        if(error){
            res.send("Error! Unable to connect to Untappd at this time");
        }else{
            var obj = JSON.parse(body);
            if(obj.meta.code != 200){
                res.send("Error! Unable to connect to Untappd at this time");
            }else{
                var numBeers = obj.response.beers.count;
                //res.send(numBeers + " beers found!");
                var beers = obj.response.beers.items;
                var attachments = [];
                for(var i = searchNum; i < searchNum + 3; i++){
                    var thisBeer = obj.response.beers.items[i];
                    var beer_Rating = 0;
                    var beer_RateCount = 0;
                    var beerInfoURL = "https://api.untappd.com/v4/beer/info/" + thisBeer.beer.bid + "&client_id=" + untappdClientId + "&client_secret=" + untappdClientSecret;
                    request(beerInfoURL,function(infoError,infoResponse,infoBody){
                        if(infoError){
                            console.log("Unable to get beer info for " + thisBeer.beer.beer_name);
                        }else{
                            var info = JSON.parse(infoBody);
                            beer_Rating = info.response.beer.rating_score;
                            beer_RateCount = info.response.beer.rating_count;
                            console.log(beer_Rating + " out of " + beer_RateCount);
                            var thisAttachment = {
                                "color": "#ffcc00",
                                "author_name": thisBeer.brewery.brewery_name,
                                "author_link": "https://untappd.com/w/" + thisBeer.brewery.brewery_slug + "/" + thisBeer.brewery.brewery_id,
                                "author_icon": thisBeer.brewery.brewery_label,
                                "title": thisBeer.beer.beer_name,
                                "title_link": "https://untappd.com/b/" + thisBeer.beer.beer_slug + "/" + thisBeer.beer.bid,
                                "text": thisBeer.beer.beer_description,
                                "fields": [
                                    {
                                        "title": "Rating",
                                        "value": beer_Rating + "/5 from " + beer_RateCount + " reviews"
                                    },
                                    {
                                        "title": "Style",
                                        "value": thisBeer.beer_style
                                    }
                                ],
                                "image_url": thisBeer.beer.beer_label
                            };
                            attachments.push(thisAttachment);
                        }
                    })
                    // var thisAttachment = {
                    //     "color": "#ffcc00",
                    //     "author_name": thisBeer.brewery.brewery_name,
                    //     "author_link": "https://untappd.com/w/" + thisBeer.brewery.brewery_slug + "/" + thisBeer.brewery.brewery_id,
                    //     "author_icon": thisBeer.brewery.brewery_label,
                    //     "title": thisBeer.beer.beer_name,
                    //     "title_link": "https://untappd.com/b/" + thisBeer.beer.beer_slug + "/" + thisBeer.beer.bid,
                    //     "text": thisBeer.beer.beer_description,
                    //     "fields": [
                    //         {
                    //             "title": "Rating",
                    //             "value": beer_Rating + "/5 from " + beer_RateCount + " reviews"
                    //         },
                    //         {
                    //             "title": "Style",
                    //             "value": thisBeer.beer_style
                    //         }
                    //     ],
                    //     "image_url": thisBeer.beer.beer_label
                    // };
                    // attachments.push(thisAttachment);
                }
                // var payload = {
                //     "response_type": "in_channel",
                //     "text": numBeers + " beers found, first three shown below",
                //     "attachments": attachments
                // };
                // res.send(payload);
            }
        };

    });
    while(attachments.length < 3){
        console.log(Date.now());
        console.log(attachments.length + " of 3 ready");
    }
    var payload = {
        "response_type": "in_channel",
        "text": numBeers + " beers found, first three shown below",
        "attachments": attachments
    };
    res.send(payload);
});