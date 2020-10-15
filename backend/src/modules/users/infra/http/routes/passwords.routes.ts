import { Router } from 'express';

import ForgottenPasswordController from '../controllers/ForgottenPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgottenPasswordController = new ForgottenPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgotten', forgottenPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
