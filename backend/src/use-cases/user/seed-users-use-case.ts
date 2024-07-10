import { User } from '../../core/user';
import { IUserRepository } from '../../repositories/user-repository';

export class SeedUsersUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute() {
        const users = [
            {
                name: 'Jonathan',
                email: 'jonathan@gmail.com',
                address: { state: 'SP', city: 'Taboão da Serra', street: 'Rua' },
            },
            {
                name: 'João',
                email: 'joao@gmail.com',
                address: { state: 'SP', city: 'Taboão da Serra', street: 'House white' },
            },
            {
                name: 'Lucas',
                email: 'lucas@gmail.com',
                address: { state: 'SP', city: 'Taboão da Serra', street: 'Rua' },
            },
            {
                name: 'Simão',
                email: 'simao@gmail.com',
                address: { state: 'SP', city: 'Taboão da Serra', street: 'Rua' },
            },
        ];

        for (const { name, email, address } of users) {
            const user = User.create({ name, email, address });

            await this.userRepository.create(user);
        }
    }
}
