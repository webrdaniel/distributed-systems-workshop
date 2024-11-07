import type { FakeMongoPrimary } from './fake_mongo_primary';
import type { Document, IFakeMongoReplica } from './types';

/**
 * TODO: Implement a replication algorithm that synchronizes data from the primary.
 * See README.md for more details.
 * Run `npm test:replication` to test your implementation.
 */
export class FakeMongoReplica implements IFakeMongoReplica {
    // TODO: Implement

    constructor(fakeMongoPrimary: FakeMongoPrimary) {
        // TODO: Implement
    }

    public async get(collection: string, documentId: string) {
        // TODO: Implement
    }

    public async upsert(collection: string, document: Document) {
        // TODO: Implement
    }

    public async delete(collection: string, documentId: string) {
        // TODO: Implement
    }

    public handlePrimaryChanges(changes: { operation: 'UPSERT' | 'DELETE', collection: string, documentId: string, document?: Document}[]) {
        // TODO: Implement
    }
}