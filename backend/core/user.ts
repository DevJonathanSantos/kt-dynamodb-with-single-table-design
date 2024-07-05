import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { Item } from './item';

export interface UserProps {
    id: string;
    name: string;
    email: string;
    address: {};
}

export class User extends Item<UserProps> {
    get pk(): string {
        return `USER`;
    }
    get sk(): string {
        return this.props.id;
    }

    toDynamoItem(): Record<string, AttributeValue> {
        const item: Record<string, AttributeValue> = {
            ...this.keys(),
            id: { S: this.props.id },
            name: { S: this.props.name },
            email: { S: this.props.email },
            address: { S: this.props.address },
        };

        return item;
    }

    static fromDynamoItem(item: Record<string, AttributeValue>): User {
        const { id, name, email, address } = item;

        return new User({ id, name, email, address });
    }

    static create({ name, email, address }: UserProps): User {
        const id = randomUUID();

        return new User({ id, name, email, address });
    }
}
