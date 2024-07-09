import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { Item } from './item';

export interface AssetProps {
    id: string;
    name: string;
    code: string;
    type: string;
    price: number;
}

export class Asset extends Item<AssetProps> {
    get pk(): string {
        return `ASSET`;
    }
    get sk(): string {
        return this.props.id;
    }

    toDynamoItem(): Record<string, AttributeValue> {
        const item: Record<string, AttributeValue> = {
            ...this.keys(),
            id: { S: this.props.id },
            name: { S: this.props.name },
            userId: { S: this.props.code },
            type: { S: this.props.type },
            price: { N: this.props.price.toString() },
        };

        return item;
    }

    static fromDynamoItem(item: Record<string, AttributeValue>): Asset {
        const { id, name, code, type, price } = item;

        return new Asset({ id: id.S!, name: name.S!, code: code.S!, type: type.S!, price: Number(price.N) });
    }

    static create({ name, code, type, price }: AssetProps): Asset {
        const id = randomUUID();

        return new Asset({ id, name, code, type, price });
    }
}
