import type { FakeRedisNode } from "./fake_redis_node";
import type { IFakeRedisCluster } from './types';

/**
 * TODO: Implement a sharding algorithm that distributes keys across multiple Redis nodes.
 * See README.md for more details.
 * Run `npm test:sharding` to test your implementation.
 */
export class FakeRedisCluster implements IFakeRedisCluster {
    // TODO: Implement

    constructor(nodes: FakeRedisNode[]) {
        // TODO: Implement
    }

    public get(key: string) {
        // TODO: Implement
    }

    public set(key: string, value: unknown) {
        // TODO: Implement
    }

    public del(key: string) {
        // TODO: Implement
    }
}
