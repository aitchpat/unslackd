/* eslint-disable no-console */
// External Dependencies
import { Router } from 'express';

// Internal Dependencies
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
    app.use(this.defaultErrorHandler);
  }

  /**
   * Express default error handler.
   * See: http://expressjs.com/en/guide/error-handling.html
   */
  // eslint-disable-next-line
  static defaultErrorHandler(err, req, res, next) {
    console.error('Internal Error. Uncaught error in handlers: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
