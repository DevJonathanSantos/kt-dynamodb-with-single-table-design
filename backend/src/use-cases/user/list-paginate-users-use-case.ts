import { IUserRepository } from '../../repositories/user-repository';

export class ListPaginateUsersUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(pageSize: number, paginationToken: string) {
        const users = await this.userRepository.listPaginate(pageSize, paginationToken);

        return users;
    }
}
