import { cryptoRandomObjectId, delayPromise } from '@apify/utilities';
import { FakeMongoPrimary } from '../src/fake_mongo_primary';
import { FakeMongoReplica } from '../src/fake_mongo_replica';

describe('replication', () => {
    test('works with 1 node', async () => {
        const fakeMongoPrimary = new FakeMongoPrimary();
        try {
            const fakeMongoReplica = new FakeMongoReplica(fakeMongoPrimary);
            const document = { _id: cryptoRandomObjectId(), name: 'John' };
            await fakeMongoPrimary.upsert('users', document);
            // Too early to see the document on a replica
            expect(await fakeMongoReplica.get('users', document._id)).toBe(undefined);
            await delayPromise(100);
            // It should be there now
            expect(await fakeMongoReplica.get('users', document._id)).toEqual(document);
            // Now, let's delete the document
            await fakeMongoPrimary.delete('users', document._id);
            await delayPromise(100);
            // It should be deleted now
            expect(await fakeMongoReplica.get('users', document._id)).toBe(undefined);
        } finally {
            fakeMongoPrimary.destroy();
        }
    });

    test('works with multiple nodes', async () => {
        const fakeMongoPrimary = new FakeMongoPrimary();
        try {
            const fakeMongoReplica1 = new FakeMongoReplica(fakeMongoPrimary);
            const fakeMongoReplica2 = new FakeMongoReplica(fakeMongoPrimary);
            const user1 = { _id: cryptoRandomObjectId(), name: 'John' };
            const user2 = { _id: cryptoRandomObjectId(), name: 'Jack' };
            await fakeMongoReplica1.upsert('users', user1);
            await fakeMongoReplica2.upsert('users', user2);
            await delayPromise(100);
            expect(await fakeMongoReplica2.get('users', user1._id)).toEqual(user1);
            expect(await fakeMongoReplica1.get('users', user2._id)).toEqual(user2);
            await fakeMongoPrimary.delete('users', user1._id);
            await fakeMongoPrimary.delete('users', user2._id);
            await delayPromise(100);
            expect(await fakeMongoReplica1.get('users', user1._id)).toBe(undefined);
            expect(await fakeMongoReplica1.get('users', user2._id)).toBe(undefined);
            expect(await fakeMongoReplica2.get('users', user1._id)).toBe(undefined);
            expect(await fakeMongoReplica2.get('users', user2._id)).toBe(undefined);
        } finally {
            fakeMongoPrimary.destroy();
        }
    });

    test('fast writes will not break the replication and be eventually consistent', async () => {
        const fakeMongoPrimary = new FakeMongoPrimary();
        try {
            const fakeMongoReplicas = new Array(10).fill(null).map(() => new FakeMongoReplica(fakeMongoPrimary));
            const document = { _id: cryptoRandomObjectId(), name: 'John' };
            for (let i = 0; i < 10; i++) {
                for (const fakeMongoReplica of fakeMongoReplicas) {
                    await fakeMongoReplica.upsert('users', document);
                }
            }
            const finalDocument = { _id: document._id, name: 'Jack' };
            for (const fakeMongoReplica of fakeMongoReplicas) {
                await fakeMongoReplica.upsert('users', finalDocument);
            }

            await delayPromise(100);
            for (const fakeMongoReplica of fakeMongoReplicas) {
                expect(await fakeMongoReplica.get('users', document._id)).toEqual(finalDocument);
            }

        } finally {
            fakeMongoPrimary.destroy();
        }
    });
});
