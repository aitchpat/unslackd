// External Dependencies
import express from 'express'

// Internal Dependencies
// Controller
import OAuthController from '../controllers/oauth'

const createOAuthRoutes = (router: express.Router) => {
	router.get('/oauth', OAuthController.getOAuth)
}

export default createOAuthRoutes
