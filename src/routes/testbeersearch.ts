
import type { Router } from 'express';

import TestBeerSearchController from '~/controllers/testbeersearch';

const createTestBeerSearchRoutes = (router: Router) => {
  router.post('/testbeersearch', TestBeerSearchController.searchBeersByName);
};

export default createTestBeerSearchRoutes;

