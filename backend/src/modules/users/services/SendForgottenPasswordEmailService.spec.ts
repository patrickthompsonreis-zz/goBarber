import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgottenPasswordEmailService from './SendForgottenPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgottenPasswordEmail: SendForgottenPasswordEmailService;

describe('SendForgottenPasswordEmail', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgottenPasswordEmail = new SendForgottenPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using a valid email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'testPassword',
    });

    await sendForgottenPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    await expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to request a password recover with an invalid email', async () => {
    await expect(
      sendForgottenPasswordEmail.execute({
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to a forgotten password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'testPassword',
    });

    await sendForgottenPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
