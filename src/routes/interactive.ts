import type { Router } from 'express';

import InteractiveController from '~/controllers/interactive';

const createInteractiveRoutes = (router: Router) => {
  router.post('/interactive', InteractiveController.reSearch);
};

export default createInteractiveRoutes;
