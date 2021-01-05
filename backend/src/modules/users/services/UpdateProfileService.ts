import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const userWithAnUpdatedEmail = await this.usersRepository.findByEmail(
      email,
    );

    if (userWithAnUpdatedEmail && userWithAnUpdatedEmail.id !== user_id) {
      throw new AppError('Este e-mail já é utilizado.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('Você deve informar a senha anterior.');
    }

    if (password && old_password) {
      const checkingOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkingOldPassword) {
        throw new AppError('A senha anterior não confere.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
