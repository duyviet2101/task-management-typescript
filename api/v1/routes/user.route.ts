import {Router} from 'express';
const router = Router();

import * as controller from '../controllers/user.controller';

router.post('/register', controller.register);

export const userRoutes: Router = router;