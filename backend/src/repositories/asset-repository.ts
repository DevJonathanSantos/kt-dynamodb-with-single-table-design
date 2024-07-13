import { AttributeValue, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { Asset } from '../core/asset';
import { decrypt, encrypt } from '../utils/encrypt-pagination';

export interface IAssetRepository {
    create(wallet: Asset): Promise<void>;
    listAll(): Promise<Asset[] | undefined>;
    listPaginate(
        pageSize: number,
        paginationToken: string,
    ): Promise<{ items: Asset[]; paginationToken: string } | undefined>;
    get(pk: string, sk: string): Promise<Asset | undefined>;
}

export class AssetRepository implements IAssetRepository {
    private client: DynamoDBClient;
    private tableName: string;

    constructor() {
        this.client = new DynamoDBClient({ region: process.env.AWS_REGION as string });
        this.tableName = process.env.DATABASE_NAME as string;
    }

    async create(asset: Asset): Promise<void> {
        try {
            const command = new PutItemCommand({
                TableName: this.tableName,
                Item: asset.toDynamoItem(),
            });

            const { $metadata } = await this.client.send(command);

            if (!$metadata || $metadata.httpStatusCode != 200) throw Error('Failed to create.');
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async listAll(): Promise<Asset[] | undefined> {
        try {
            const query = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'PK = :pk ',
                ExpressionAttributeValues: {
                    ':pk': { S: `USER` },
                },
            });

            let lastKey: Record<string, AttributeValue> | undefined;

            let result: Asset[] = [];

            do {
                query.input.ExclusiveStartKey = lastKey;

                const { Items, LastEvaluatedKey } = await this.client.send(query);

                lastKey = LastEvaluatedKey;

                const items = Items?.map((item) => Asset.fromDynamoItem(item));

                if (items) result = result.concat(items);
            } while (lastKey);

            return result;
        } catch (error) {
            throw error;
        }
    }

    async listPaginate(
        pageSize: number,
        paginationToken: string,
    ): Promise<{ items: Asset[]; paginationToken: string } | undefined> {
        try {
            const query = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': { S: `USER` },
                },
            });

            let lastKey: Record<string, AttributeValue> | undefined;

            let result: Asset[] = [];

            do {
                query.input.ExclusiveStartKey = JSON.parse(decrypt(paginationToken));

                const { Items, LastEvaluatedKey } = await this.client.send(query);

                lastKey = LastEvaluatedKey;

                const items = Items?.map((item) => Asset.fromDynamoItem(item));

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

    async get(pk: string, sk: string): Promise<Asset | undefined> {
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

            return Asset.fromDynamoItem(Item);
        } catch (error) {
            throw error;
        }
    }
}
