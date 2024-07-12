import { AttributeValue } from '@aws-sdk/client-dynamodb';

export abstract class Item<Props> {
    protected props: Props;

    abstract get pk(): string;
    abstract get sk(): string;

    protected constructor(props: Props) {
        this.props = props;
    }

    public keys(): Record<string, AttributeValue> {
        return {
            pk: { S: `${this.pk}` },
            sk: { S: `STATUS#ACTIVE#${this.sk}` },
        };
    }
}
