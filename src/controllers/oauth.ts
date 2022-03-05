import type { Request, Response } from 'express';
import fetch from 'node-fetch';

// Secrets
const slackClientID = process.env.SLACK_CLIENT_ID;
const slackClientSecret = process.env.SLACK_CLIENT_SECRET;

const getOAuth = async (req: Request, res: Response) => {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint.
  // If that code is not there, we respond with an error message
  if (!req.query.code) {
    console.log('Looks like we are not getting code.');
    res.status(500).send({ Error: 'Looks like we are not getting the code.' });
    return;
  }

  // GET call to Slack's `oauth.access` endpoint, passing our app's client ID,
  // client secret, and the code we just got as query parameters.
  const queryParams = new URLSearchParams({
    code: req.query.code as string,
    client_id: slackClientID,
    client_secret: slackClientSecret,
  });
  const url = 'https://slack.com/api/oauth.access';

  try {
    const body = await fetch(`${url}?${queryParams}`);
    console.log(body);
    if (body.ok) {
      res.redirect(200, '../views/success/success.html');
    } else {
      res.json(body);
    }
  } catch (err) {
    console.log(err);
  }
};

export default {
  getOAuth,
};
