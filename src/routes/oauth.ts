
import type { Router } from 'express';

import OAuthController from '~/controllers/oauth';

const createOAuthRoutes = (router: Router) => {
  router.get('/oauth', OAuthController.getOAuth);
};

export default createOAuthRoutes;

