// Controller
import TestBeerSearchController from '../controllers/testbeersearch';

const createTestBeerSearchRoutes = (router) => {
  router.post('/testbeersearch', TestBeerSearchController.searchBeersByName);
};

export default createTestBeerSearchRoutes;

