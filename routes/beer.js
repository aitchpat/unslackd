// External Dependencies
import { Router } from 'express';

// Controller
import BeerController from '../controllers/beer';

export default createBeerRoutes = (router) => {
    router.post('/beer', BeerController.searchBeers);
}