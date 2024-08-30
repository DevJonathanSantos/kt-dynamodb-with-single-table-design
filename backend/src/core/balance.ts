import { AttributeValue } from '@aws-sdk/client-dynamodb';

import { Item } from './item';

export interface BalanceProps {
    walletId: string;
    assetId: string;
    consolidate: number;
    status?: string;
}

export class Balance extends Item<BalanceProps> {
    get pk(): string {
        return `BALANCE#WALLET#${this.props.walletId}`;
    }
    get sk(): string {
        return `ASSET#${this.props.assetId}`;
    }
    get data(): BalanceProps {
        return this.props;
    }
    toDynamoItem(): Record<string, AttributeValue> {
        const item: Record<string, AttributeValue> = {
            ...this.keys(),
            walletId: { S: this.props.walletId },
            assetId: { S: this.props.assetId },
            status: { S: this.props.status! },
            consolidate: { N: this.props.consolidate.toString() },
        };

        return item;
    }

    static fromDynamoItem(item: Record<string, AttributeValue>): Balance {
        const { walletId, assetId, consolidate, status } = item;

        return new Balance({
            walletId: walletId.S!,
            assetId: assetId.S!,
            consolidate: Number(consolidate.N),
            status: status.S!,
        });
    }

    static create({ walletId, assetId, consolidate }: BalanceProps): Balance {
        return new Balance({ walletId, assetId, consolidate, status: 'ACTIVE' });
    }
}
