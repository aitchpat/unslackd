import type { Router } from 'express';

import BeerController from '~/controllers/beer';

const createBeerRoutes = (router: Router) => {
  router.post('/beer', BeerController.searchBeersByName);
};

export default createBeerRoutes;

