// External Dependencies
import express from 'express'

// Controller
import InteractiveController from '../controllers/interactive'

const createInteractiveRoutes = (router: express.Router) => {
	router.post('/interactive', InteractiveController.reSearch)
}

export default createInteractiveRoutes
