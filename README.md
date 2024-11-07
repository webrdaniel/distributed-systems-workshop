# Distributed systems workshop
This workshop should help you improve your knowledge of replication and sharding using a coding exercise.

## Replication
Your task is to implement methods in the `src/fake_mongo_replica.ts` file, which implements `IFakeMongoReplica`.
You should implement the methods in the class so that running `npm run test:replication` will pass with no errors.
The class receives a single instance of `FakeMongoPrimary` via the constructor. You must not change the code of `FakeMongoPrimary` class!

Some information:
- Read the implementation of the primary and tests, it will be useful when you're writing the code.
- You cannot use the primary to read, the only way to get the data is to subscribe to changes via `.subscribeToChanges`
- If you run `upsert` or `delete` on some replica, the data should be propagated to all replicas!

## Sharding
Your task is to implement methods in the `src/fake_redis_cluster.ts` file, which implements `IFakeRedisCluster`.
You should implement the methods in the class so that running `npm run test:sharding` will pass with no errors.
The class holds at least 1 instance of the `FakeRedis` class. You must not change the code of `FakeRedis` class!

Some information:
- Read the implementation of the node and tests, it will be useful when you're writing the code.
- Keys with `{...}` have to be handled differently, you choose the shard based on what's inside `{}`, e.g. for `{abc}:123`, you only use `abc` as a way to decide which shard you want to choose. For simplicity, consider that this can only happen once in a key.
