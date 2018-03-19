// External Dependencies
import { Router } from 'express';

// Controller
import OAuthController from '../controllers/oauth';

export default createOAuthRoutes = (router) => {
    router.get('/oauth', OAuthController.getOAuth);
}