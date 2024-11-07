import { cryptoRandomObjectId } from '@apify/utilities';
import { FakeRedisCluster } from '../src/fake_redis_cluster';
import { FakeRedisNode } from '../src/fake_redis_node';

const createFakeRedisNodes = (count: number) => {
    return new Array(count).fill(null).map(() => new FakeRedisNode());
}

const basicTest = (fakeRedisNodes: FakeRedisNode[]) => {
    const fakeRedisCluster = new FakeRedisCluster(fakeRedisNodes);
    const key = cryptoRandomObjectId();
    const value = cryptoRandomObjectId();
    // Get, should be undefined
    const val = fakeRedisCluster.get(key);
    expect(val).toBe(undefined);
    // Set
    fakeRedisCluster.set(key, value);
    const val2 = fakeRedisCluster.get(key);
    expect(val2).toBe(value);
    // Delete
    fakeRedisCluster.del(key);
    const val3 = fakeRedisCluster.get(key);
    expect(val3).toBe(undefined);

    // @ts-expect-error - getCalledCount is private
    const getCalledTimes = fakeRedisNodes.reduce((acc, node) => acc + node.getCalledCount, 0);
    expect(getCalledTimes).toBe(3);
    // @ts-expect-error - setCalledCount is private
    const setCalledTimes = fakeRedisNodes.reduce((acc, node) => acc + node.setCalledCount, 0);
    expect(setCalledTimes).toBe(1);
    // @ts-expect-error - delCalledCount is private
    const delCalledTimes = fakeRedisNodes.reduce((acc, node) => acc + node.delCalledCount, 0);
    expect(delCalledTimes).toBe(1);
};

describe('sharding', () => {
    test('works with 1 node', () => {
        basicTest(createFakeRedisNodes(1));
    });

    test('works with 5 nodes', () => {
        basicTest(createFakeRedisNodes(5));
    });

    test('reasonably distributes random keys', () => {
        const fakeRedisNodes = createFakeRedisNodes(5);
        const fakeRedisCluster = new FakeRedisCluster(fakeRedisNodes);
        for (let i = 0; i < 10_000; i++) {
            fakeRedisCluster.set(cryptoRandomObjectId(), i);
        }
        fakeRedisNodes.forEach((node) => {
            // @ts-expect-error - setCalledCount is private
            expect(node.setCalledCount).toBeGreaterThan(1_750);
        });
    });

    test('reasonably distributes similar keys', () => {
        const fakeRedisNodes = createFakeRedisNodes(5);
        const fakeRedisCluster = new FakeRedisCluster(fakeRedisNodes);
        for (let i = 0; i < 10_000; i++) {
            fakeRedisCluster.set(`my-key-${i}`, i);
        }
        fakeRedisNodes.forEach((node) => {
            // @ts-expect-error - setCalledCount is private
            expect(node.setCalledCount).toBeGreaterThan(1_750);
        });
    });

    test('supports {...} as a way to restrict the keys to a single node', () => {
        const fakeRedisNodes = createFakeRedisNodes(5);
        const fakeRedisCluster = new FakeRedisCluster(fakeRedisNodes);
        const fixedKeyPart = cryptoRandomObjectId();
        for (let i = 0; i < 10_000; i++) {
            const randomKeyPart = cryptoRandomObjectId();
            fakeRedisCluster.set(`{${fixedKeyPart}}:${randomKeyPart}`, i);
        }
        fakeRedisNodes.forEach((node) => {
            // @ts-expect-error - setCalledCount is private
            expect([0, 10_000]).toContain(node.setCalledCount);
        });
    });
});
