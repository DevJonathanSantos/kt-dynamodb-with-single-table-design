import { IWalletRepository } from '../../repositories/wallet-repository';

export class GetWalletUseCase {
    constructor(private walletRepository: IWalletRepository) {}

    async execute(userId: string, walletId: string) {
        const users = await this.walletRepository.get(`WALLET#USER#${userId}`, walletId);

        return users;
    }
}
