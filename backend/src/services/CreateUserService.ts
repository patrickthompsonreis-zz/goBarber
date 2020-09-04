import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkingUser = await usersRepository.findOne({
      where: { email },
    });

    if (checkingUser) {
      throw new AppError(
        'Este e-mail foi vinculado a uma outra conta já existente.',
      );
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    delete user.password;

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
