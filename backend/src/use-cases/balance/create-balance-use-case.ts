import { Balance } from '../../core/balance';
import { IBalanceRepository } from '../../repositories/balance-repository';

export class CreateBalanceUseCase {
    constructor(private balanceRepository: IBalanceRepository) {}

    async execute(walletId: string, assetId: string, consolidate: number) {
        const balance = Balance.create({ walletId, assetId, consolidate });

        await this.balanceRepository.create(balance);
    }
}
