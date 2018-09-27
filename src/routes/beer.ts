// External Dependencies
import express from 'express'

// Controller
import BeerController from '../controllers/beer'

const createBeerRoutes = (router: express.Router) => {
	router.post('/beer', BeerController.searchBeersByName)
}

export default createBeerRoutes
