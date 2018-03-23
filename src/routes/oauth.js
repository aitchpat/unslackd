// Internal Dependencies
// Controller
import OAuthController from '../controllers/oauth';

const createOAuthRoutes = (router) => {
  router.get('/oauth', OAuthController.getOAuth);
};

export default createOAuthRoutes;

