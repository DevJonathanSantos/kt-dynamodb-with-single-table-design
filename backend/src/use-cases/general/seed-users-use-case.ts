import { randomUUID } from 'crypto';
import { User } from '../../core/user';
import { Wallet } from '../../core/wallet';
import { IAssetRepository } from '../../repositories/asset-repository';
import { IBalanceRepository } from '../../repositories/balance-repository';
import { IUserRepository } from '../../repositories/user-repository';
import { IWalletRepository } from '../../repositories/wallet-repository';
import { Asset } from '../../core/asset';
import { Balance } from '../../core/balance';

export class GeneralSeedUseCase {
    constructor(
        private userRepository: IUserRepository,
        private assetRepository: IAssetRepository,
        private walletRepository: IWalletRepository,
        private balanceRepository: IBalanceRepository,
    ) {}

    async execute() {
        try {
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

            const assets = [
                {
                    name: 'Banco do Brasil',
                    code: 'BBAS3',
                    type: 'ação',
                    price: 55.5,
                },
                {
                    name: 'Banco do Brasil',
                    code: 'B3SA3',
                    type: 'ação',
                    price: 12.4,
                },
                {
                    name: 'Klabin',
                    code: 'KLBN11',
                    type: 'ação',
                    price: 10,
                },
                {
                    name: 'Weg',
                    code: 'WEGE3',
                    type: 'ação',
                    price: 5,
                },
            ];

            let count = 0;

            for (const { name, email, address } of users) {
                const userId = randomUUID();
                const user = User.create({ id: userId, name, email, address });
                await this.userRepository.create(user);

                const walletId = randomUUID();
                const wallet = Wallet.create({
                    id: walletId,
                    name: 'Carteira de ações',
                    userId,
                    totalConsolidate: 10,
                });
                await this.walletRepository.create(wallet);

                const { code, price, type } = assets[count];

                const assetId = randomUUID();
                const asset = Asset.create({ id: assetId, name: assets[count].name, code, price, type });

                await this.assetRepository.create(asset);

                const balance = Balance.create({ walletId, assetId, consolidate: 10 });

                await this.balanceRepository.create(balance);

                count++;
            }
        } catch (error) {
            console.error(error);
        }
    }
}
