import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgottenPasswordEmailService from '@modules/users/services/SendForgottenPasswordEmailService';

export default class ForgottenPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgottenPasswordEmail = container.resolve(
      SendForgottenPasswordEmailService,
    );

    await sendForgottenPasswordEmail.execute({
      email,
    });

    // delete user.password;

    return response.status(204).json();
  }
}
