import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { Item } from './item';

export interface WalletProps {
    id: string;
    name: string;
    userId: string;
    totalConsolidate: string;
}

export class Wallet extends Item<WalletProps> {
    get pk(): string {
        return `WALLET#USER#${this.props.userId}`;
    }
    get sk(): string {
        return this.props.id;
    }

    toDynamoItem(): Record<string, AttributeValue> {
        const item: Record<string, AttributeValue> = {
            ...this.keys(),
            id: { S: this.props.id },
            name: { S: this.props.name },
            userId: { S: this.props.userId },
        };

        return item;
    }

    static fromDynamoItem(item: Record<string, AttributeValue>): Wallet {
        const { id, name, userId, totalConsolidate } = item;

        return new Wallet({ id: id.S!, name: name.S!, userId: userId.S!, totalConsolidate: totalConsolidate.S! });
    }

    static create({ name, userId, totalConsolidate }: WalletProps): Wallet {
        const id = randomUUID();

        return new Wallet({ id, name, userId, totalConsolidate });
    }
}
