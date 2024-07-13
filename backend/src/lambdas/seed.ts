import { AssetRepository } from '../repositories/asset-repository';
import { BalanceRepository } from '../repositories/balance-repository';
import { UserRepository } from '../repositories/user-repository';
import { WalletRepository } from '../repositories/wallet-repository';
import { GeneralSeedUseCase } from '../use-cases/general/seed-users-use-case';

export async function seed() {
    const userRepository = new UserRepository();
    const assetRepository = new AssetRepository();
    const walletRepository = new WalletRepository();
    const balanceRepository = new BalanceRepository();

    const useCase = new GeneralSeedUseCase(userRepository, assetRepository, walletRepository, balanceRepository);

    await useCase.execute();
}
