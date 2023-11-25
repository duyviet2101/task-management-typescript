import {Router} from 'express';
const router = Router();

import * as controller from '../controllers/task.controller';

router.get('', controller.index);

router.get('/detail/:id', controller.detail);

router.patch('/change-status/:id', controller.changesStatus);

export const taskRoutes: Router = router;