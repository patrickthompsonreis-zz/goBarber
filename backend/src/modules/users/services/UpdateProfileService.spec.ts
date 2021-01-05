import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile data', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'testPassword',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'James Bond',
      email: 'jamesbond@mi6.co.uk',
    });

    expect(updatedUser.name).toBe('James Bond');
    expect(updatedUser.email).toBe('jamesbond@mi6.co.uk');
  });

  it('should not be able to update the profile from a non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email with an already used adress', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'testPassword',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe Fake',
      email: 'johndoefake@email.com',
      password: 'fakeTestPassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe Fake',
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without provinding the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'testPassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'James Bond',
        email: 'jamesbond@mi6.co.uk',
        password: 'jb007',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password provinding a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'testPassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'James Bond',
        email: 'jamesbond@mi6.co.uk',
        old_password: 'wrong-old-password',
        password: 'jb007',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
