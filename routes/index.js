// External Dependencies
import { Express, Router } from 'express'

// Routes
import OAuthRoutes from './oauth';
import BeerRoutes from './beer';

export default class UnslackdRoutes {
    static mountRoutes(app) {
        // Generate routes
        const router = new Router();

        OAuthRoutes(router);
        BeerRoutes(router);

        app.use('/', router);
        app.use(this.default);
    }

    /**
	 * Express default error handler.
	 * See: http://expressjs.com/en/guide/error-handling.html
	 */
	static defaultErrorHandler = (err, req, res, next) => {
		Logger.error('Internal Error. Uncaught error in handlers: ', err);
		res.status(500).json({ error: 'Internal server error' });
	}
}