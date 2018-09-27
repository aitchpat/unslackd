/* eslint-disable consistent-return */
// External Dependencies
import express from 'express'
import BluebirdRequest from 'request-promise'

// Internal Dependencies

// Secrets
const slackClientID = process.env.SLACK_CLIENT_ID
const slackClientSecret = process.env.SLACK_CLIENT_SECRET

const getOAuth = async (req: express.Request, res: express.Response) => {
	// When a user authorizes an app, a code query parameter is passed on the oAuth endpoint.
	// If that code is not there, we respond with an error message
	if (!req.query.code) {
		console.log('Looks like we are not getting code.')
		res.status(500).send({ Error: 'Looks like we are not getting the code.' })
		return
	}

	// GET call to Slack's `oauth.access` endpoint, passing our app's client ID,
	// client secret, and the code we just got as query parameters.
	const queryParams = {
		code: req.query.code,
		client_id: slackClientID,
		client_secret: slackClientSecret,
	}
	const requestOptions = {
		url: 'https://slack.com/api/oauth.access',
		qs: queryParams,
	}

	try {
		const body = await BluebirdRequest(requestOptions)
		console.log(body)
		if (JSON.parse(body).ok) {
			res.redirect(200, '../views/success/success.html')
		} else {
			res.json(body)
		}
	} catch (err) {
		console.log(err)
	}
}

export default {
	getOAuth,
}
