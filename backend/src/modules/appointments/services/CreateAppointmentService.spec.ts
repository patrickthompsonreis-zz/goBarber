import AppError from '@shared/errors/AppError';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1234Pg',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments at the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 11, 12, 10);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1234Pg',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1234Pg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
