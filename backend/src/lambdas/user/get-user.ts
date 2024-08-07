import { UserRepository } from './../../repositories/user-repository';
import { GetUserUseCase } from '../../use-cases/user/get-user-use-case';

export async function getUser(request: any) {
    const { userId } = request;

    const repository = new UserRepository();

    const useCase = new GetUserUseCase(repository);

    const user = await useCase.execute(userId);

    return user;
}
