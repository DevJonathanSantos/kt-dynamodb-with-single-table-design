import { IBalanceRepository } from '../../repositories/balance-repository';

export class ListBalancesByWalletUseCase {
    constructor(private balanceRepository: IBalanceRepository) {}

    async execute(walletId: string, onlyActive: boolean) {
        const balances = await this.balanceRepository.listByWalletId(walletId, onlyActive);

        return balances?.map(({ data }) => data);
    }
}
