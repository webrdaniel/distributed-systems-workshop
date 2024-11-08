import type { FakeMongoPrimary } from "./fake_mongo_primary";
import type { Document, IFakeMongoReplica } from "./types";

/**
 * TODO: Implement a replication algorithm that synchronizes data from the primary.
 * See README.md for more details.
 * Run `npm test:replication` to test your implementation.
 */
export class FakeMongoReplica implements IFakeMongoReplica {
  // TODO: Implement
  private fakeMongoPrimary: FakeMongoPrimary;
  private data = new Map<string, Map<string, Document>>();

  constructor(fakeMongoPrimary: FakeMongoPrimary) {
    this.fakeMongoPrimary = fakeMongoPrimary;
    fakeMongoPrimary.subscribeToChanges(this);
  }

  public async get(collection: string, documentId: string) {
    const collectionData = this.data.get(collection);
    if (collectionData) {
      return collectionData.get(documentId);
    }
    return undefined;
  }

  public async upsert(collection: string, document: Document) {
    await this.fakeMongoPrimary.upsert(collection, document);
  }

  public async delete(collection: string, documentId: string) {
    await this.fakeMongoPrimary.delete(collection, documentId);
  }

  public handlePrimaryChanges(
    changes: {
      operation: "UPSERT" | "DELETE";
      collection: string;
      documentId: string;
      document?: Document;
    }[]
  ) {
    changes.forEach((change) => {
      if (change.operation === "UPSERT") {
        const collection = this.data.get(change.collection);
        if (!collection) {
          this.data.set(change.collection, new Map());
        }
        this.data
          .get(change.collection)!
          .set(change.documentId, change.document!);
      } else if (change.operation === "DELETE") {
        const collection = this.data.get(change.collection);
        if (!collection) {
          this.data.set(change.collection, new Map());
        }
        this.data.get(change.collection)!.delete(change.documentId);
      }
    });
  }
}
