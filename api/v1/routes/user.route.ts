import {Router} from 'express';
const router = Router();

import * as controller from '../controllers/user.controller';

router.post('/register', controller.register);

router.post('/login', controller.login);

export const userRoutes: Router = router;