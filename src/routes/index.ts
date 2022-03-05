import { Router } from 'express';
import type { Application, Request, Response, NextFunction } from 'express';

import OAuthRoutes from './oauth';
import BeerRoutes from './beer';
import TestBeerSearchRoutes from './testbeersearch';
import InteractiveRoutes from './interactive';

export default class UnslackdRoutes {
  static mountRoutes(app: Application) {
    // Generate routes
    const router: Router = Router();

    OAuthRoutes(router);
    BeerRoutes(router);
    InteractiveRoutes(router);
    TestBeerSearchRoutes(router);

    app.use('/', router);
    app.use(this.defaultErrorHandler);
  }

  /**
   * Express default error handler.
   * See: http://expressjs.com/en/guide/error-handling.html
   */
  static defaultErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('Internal Error. Uncaught error in handlers: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
