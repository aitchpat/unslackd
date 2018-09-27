// External Dependencies
import express from 'express'

// Controller
import TestBeerSearchController from '../controllers/testbeersearch'

const createTestBeerSearchRoutes = (router: express.Router) => {
	router.post('/testbeersearch', TestBeerSearchController.searchBeersByName)
}

export default createTestBeerSearchRoutes
