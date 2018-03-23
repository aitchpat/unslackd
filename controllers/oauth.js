// External Dependencies
import { Request, Response } from 'express';
import BluebirdRequest from 'request-promise';

// Internal Dependencies

// Secrets
const slackClientID = process.env.SLACK_CLIENT_ID;
const slackClientSecret = process.env.SLACK_CLIENT_SECRET;

const getOAuth = (req, res) => {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint.
  // If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500).send({ Error: 'Looks like we are not getting the code.' });
    console.log('Looks like we are not getting code.');
    return;
  }

  // GET call to Slack's `oauth.access` endpoint, passing our app's client ID,
  // client secret, and the code we just got as query parameters.
  const queryParams = {
    code: req.query.code,
    client_id: slackClientID,
    client_secret: slackClientSecret,
  };
  const requestOptions = {
    url: 'https://slack.com/api/oauth.access',
    qs: queryParams,
  };
  return BluebirdRequest(requestOptions).then(body => res.json(body)).catch((err) => {
    console.log(err);
    throw err;
  });
};

export default {
  getOAuth,
};
