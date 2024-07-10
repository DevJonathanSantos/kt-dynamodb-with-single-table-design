import { IUserRepository } from '../../repositories/user-repository';

export class ListUsersUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute() {
        const users = await this.userRepository.listAll();

        return users;
    }
}
