import { delayPromise } from '@apify/utilities';
import type { FakeMongoReplica } from './fake_mongo_replica';
import type { Document } from './types';

const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * DO NOT EDIT THIS CLASS!
 */
export class FakeMongoPrimary {
    private data = new Map<string, Map<string, Document>>();
    private subscribers: FakeMongoReplica[] = [];
    private changes: { operation: 'UPSERT' | 'DELETE', collection: string, documentId: string, document?: Document }[] = [];
    private changesInterval: NodeJS.Timeout;

    constructor() {
        this.changesInterval = setInterval(async () => {
            try {
                const changesCopy = [...this.changes];
                this.changes = [];
                await Promise.all(this.subscribers.map(async (subscriber) => {
                    await delayPromise(randomInteger(5, 20)); // Simulate network latency
                    subscriber.handlePrimaryChanges(changesCopy);
                }));
            } catch (err) {
                console.error('Error while publishing changes. This should not happen.', err);
            }
        }, 10);
    }

    /**
     * Inserts or updates a document in the collection.
     */
    public async upsert(collection: string, document: Document): Promise<void> {
        if (!this.data.has(collection)) {
            this.data.set(collection, new Map());
        }

        this.data.get(collection)!.set(document._id, document);
        this.changes.push({ operation: 'UPSERT', collection, documentId: document._id, document });

        await delayPromise(10); // Simulate network latency
    }

    /**
     * Deletes a document from the collection.
     */
    public async delete(collection: string, documentId: string): Promise<void> {
        if (this.data.has(collection)) {
            this.data.get(collection)!.delete(documentId);
            this.changes.push({ operation: 'DELETE', collection, documentId });
        }

        await delayPromise(10); // Simulate network latency
    }

    /**
     * Subscribe to changes from the primary.
     * This is required for the replication to work.
     */
    public subscribeToChanges(fakeMongoReplica: FakeMongoReplica): void {
        this.subscribers.push(fakeMongoReplica);
    }

    /**
     * Clean up the resources.
     */
    public destroy(): void {
        clearTimeout(this.changesInterval);
    }
}
