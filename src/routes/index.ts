// External Dependencies
import express from 'express'

// Internal Dependencies
// Routes
import OAuthRoutes from './oauth'
import BeerRoutes from './beer'
import TestBeerSearchRoutes from './testbeersearch'
import InteractiveRoutes from './interactive'

export default class UnslackdRoutes {
	public static mountRoutes(app: express.Application) {
		// Generate routes
		const router = express.Router()

		OAuthRoutes(router)
		BeerRoutes(router)
		InteractiveRoutes(router)
		TestBeerSearchRoutes(router)

		app.use('/', router)
		app.use(this.defaultErrorHandler)
	}

	/**
	 * Express default error handler.
	 * See: http://expressjs.com/en/guide/error-handling.html
	 */
	// eslint-disable-next-line
	public static defaultErrorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
		console.error('Internal Error. Uncaught error in handlers: ', err)
		res.status(500).json({ error: 'Internal server error' })
	}
}
