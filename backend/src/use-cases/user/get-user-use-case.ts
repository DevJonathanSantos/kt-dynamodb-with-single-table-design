import { User } from '../../core/user';
import { IUserRepository } from '../../repositories/user-repository';

export class GetUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string) {
        const { pk, sk } = User.getKey(userId);

        const users = await this.userRepository.get(pk, sk);

        return users;
    }
}
