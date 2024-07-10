import { UserRepository } from './../../repositories/user-repository';
import { ListUsersUseCase } from '../../use-cases/user/list-users-use-case';

export async function listUsers() {
    const repository = new UserRepository();

    const useCase = new ListUsersUseCase(repository);

    const users = await useCase.execute();

    return users;
}
