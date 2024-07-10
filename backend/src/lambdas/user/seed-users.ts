import { UserRepository } from './../../repositories/user-repository';
import { SeedUsersUseCase } from '../../use-cases/user/seed-users-use-case';

export async function seedUsers() {
    const repository = new UserRepository();

    const useCase = new SeedUsersUseCase(repository);

    await useCase.execute();
}
