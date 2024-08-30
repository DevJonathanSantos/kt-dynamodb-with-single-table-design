import { BalanceRepository } from '../../repositories/balance-repository';
import { ListBalancesByWalletUseCase } from '../../use-cases/balance/list-balances-by-wallet-use-case';

export async function listBalancesByWallet({ walletId, onlyActive }: any) {
    const repository = new BalanceRepository();

    const useCase = new ListBalancesByWalletUseCase(repository);

    const user = await useCase.execute(walletId, onlyActive);

    return user;
}
