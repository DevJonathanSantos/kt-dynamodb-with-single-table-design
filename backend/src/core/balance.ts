import { AttributeValue } from '@aws-sdk/client-dynamodb';

import { Item } from './item';

export interface BalanceProps {
    walletId: string;
    assetId: string;
    consolidate: number;
}

export class Balance extends Item<BalanceProps> {
    get pk(): string {
        return `BALANCE#WALLET#${this.props.walletId}`;
    }
    get sk(): string {
        return `ASSET#${this.props.assetId}`;
    }

    toDynamoItem(): Record<string, AttributeValue> {
        const item: Record<string, AttributeValue> = {
            ...this.keys(),
            walletId: { S: this.props.walletId },
            assetId: { S: this.props.assetId },
            consolidate: { N: this.props.consolidate.toString() },
        };

        return item;
    }

    static fromDynamoItem(item: Record<string, AttributeValue>): Balance {
        const { walletId, assetId, consolidate } = item;

        return new Balance({ walletId: walletId.S!, assetId: assetId.S!, consolidate: Number(consolidate.N) });
    }

    static create({ walletId, assetId, consolidate }: BalanceProps): Balance {
        return new Balance({ walletId, assetId, consolidate });
    }
}
