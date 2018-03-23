// Controller
import BeerController from '../controllers/beer';

const createBeerRoutes = (router) => {
  router.post('/beer', BeerController.searchBeersByName);
};

export default createBeerRoutes;

