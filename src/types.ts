/**
 * DO NOT EDIT THE EXISTING TYPES!
 */
export type Document = Record<string, unknown> & { _id: string };

export interface IFakeMongoReplica {
    get(collection: string, documentId: string): Promise<Document | undefined>;
    upsert(collection: string, document: Document): Promise<void>;
    delete(collection: string, documentId: string): Promise<void>;
    handlePrimaryChanges(changes: { operation: 'UPSERT' | 'DELETE', collection: string, documentId: string, document?: Document}[]): void;
}

export interface IFakeRedisCluster {
    get(key: string): unknown;
    set(key: string, value: unknown): void;
    del(key: string): void;
}
