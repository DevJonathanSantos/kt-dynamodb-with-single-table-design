import { AttributeValue, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { Wallet } from '../core/wallet';
import { decrypt, encrypt } from '../utils/encrypt-pagination';

export interface IUserRepository {
    create(wallet: Wallet): Promise<void>;
    listByUserId(userId: string): Promise<Wallet[] | undefined>;
    listPaginate(
        filter: { userId: string },
        pageSize: number,
        paginationToken: string,
    ): Promise<{ items: Wallet[]; paginationToken: string } | undefined>;
    get(pk: string, sk: string): Promise<Wallet | undefined>;
}

export class UserRepository implements IUserRepository {
    private client: DynamoDBClient;
    private tableName: string;

    constructor() {
        this.client = new DynamoDBClient({ region: process.env.AWS_REGION as string });
        this.tableName = process.env.DATABASE_NAME as string;
    }

    async create(user: Wallet): Promise<void> {
        try {
            const command = new PutItemCommand({
                TableName: this.tableName,
                Item: user.toDynamoItem(),
            });

            const { $metadata } = await this.client.send(command);

            if (!$metadata || $metadata.httpStatusCode != 200) throw Error('Failed to create.');
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async listByUserId(userId: string): Promise<Wallet[] | undefined> {
        try {
            const query = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'PK = :pk ',
                ExpressionAttributeValues: {
                    ':pk': { S: `WALLET#USER#${userId}` },
                },
            });

            let lastKey: Record<string, AttributeValue> | undefined;

            let result: Wallet[] = [];

            do {
                query.input.ExclusiveStartKey = lastKey;

                const { Items, LastEvaluatedKey } = await this.client.send(query);

                lastKey = LastEvaluatedKey;

                const items = Items?.map((item) => Wallet.fromDynamoItem(item));

                if (items) result = result.concat(items);
            } while (lastKey);

            return result;
        } catch (error) {
            throw error;
        }
    }

    async listPaginate(
        filter: { userId: string },
        pageSize: number,
        paginationToken: string,
    ): Promise<{ items: Wallet[]; paginationToken: string } | undefined> {
        try {
            const query = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': { S: `WALLET#USER#${filter.userId}` },
                },
            });

            let lastKey: Record<string, AttributeValue> | undefined;

            let result: Wallet[] = [];

            do {
                query.input.ExclusiveStartKey = JSON.parse(decrypt(paginationToken));

                const { Items, LastEvaluatedKey } = await this.client.send(query);

                lastKey = LastEvaluatedKey;

                const items = Items?.map((item) => Wallet.fromDynamoItem(item));

                if (items) result = result.concat(items);
            } while (result.length == pageSize || !lastKey);

            return {
                items: result,
                paginationToken: lastKey && encrypt(JSON.stringify(lastKey)),
            };
        } catch (error) {
            throw error;
        }
    }

    async get(pk: string, sk: string): Promise<Wallet | undefined> {
        try {
            const command = new GetItemCommand({
                TableName: this.tableName,
                Key: {
                    PK: { S: pk },
                    SK: { S: sk },
                },
            });
            const { Item } = await this.client.send(command);

            if (!Item) return;

            return Wallet.fromDynamoItem(Item);
        } catch (error) {
            throw error;
        }
    }
}
