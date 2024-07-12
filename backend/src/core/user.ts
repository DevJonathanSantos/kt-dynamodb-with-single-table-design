import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { Item } from './item';

export interface UserProps {
    id?: string;
    name: string;
    email: string;
    address: {
        state: string;
        city: string;
        street: string;
    };
}

export class User extends Item<UserProps> {
    get pk(): string {
        return `USER`;
    }
    get sk(): string {
        return this.props.id!;
    }
    get data(): UserProps {
        return this.props;
    }

    static getKey(id: string) {
        return {
            pk: `USER`,
            sk: id,
        };
    }

    toDynamoItem(): Record<string, AttributeValue> {
        const item: Record<string, AttributeValue> = {
            ...this.keys(),
            id: { S: this.props.id! },
            name: { S: this.props.name },
            email: { S: this.props.email },
            address: { S: JSON.stringify(this.props.address) },
        };

        return item;
    }

    static fromDynamoItem(item: Record<string, AttributeValue>): User {
        const { id, name, email, address } = item;

        return new User({ id: id.S!, name: name.S!, email: email.S!, address: JSON.parse(address?.S ?? '{}') });
    }

    static create({ name, email, address }: UserProps): User {
        const id = randomUUID();

        return new User({ id, name, email, address });
    }
}
