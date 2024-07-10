import { UserRepository } from '../../repositories/user-repository';
import { ListPaginateUsersUseCase } from '../../use-cases/user/list-paginate-users-use-case';

export async function listPaginateUsers({ pageSize, paginationToken }: any) {
    const repository = new UserRepository();

    const useCase = new ListPaginateUsersUseCase(repository);

    const user = await useCase.execute(pageSize, paginationToken);

    return user;
}
