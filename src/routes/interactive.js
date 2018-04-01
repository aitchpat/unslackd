// Controller
import InteractiveController from '../controllers/interactive';

const createInteractiveRoutes = (router) => {
  router.post('/interactive', InteractiveController.reSearch);
};

export default createInteractiveRoutes;
