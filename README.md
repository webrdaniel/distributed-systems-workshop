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

## Open questions to solve
### Question 1
Imagine you have a sharded database and you want to store some product stock data there (e.g. how many T-shirts of some type you have in each store). The data has format:
```json
{
    "userId": "...", // Identifies the customer, you have many
    "storeId": "...", // Prague store, Brno store
    "productId": "...", // Black T-shirt, T-shirt with Meteor logo
    "stockPerSize": {
        "S": 12,
        "M": 5,
        "L": 4,
        "XL": 22,
    }
}
```
To make everything work properly, each store needs to have all its products on *the same shard*.
You have one really large customer and lots of smaller ones (in total they're not as big as the large customer).
Your colleague suggests you can use the `userId` to partition the data, because if data of one user is stored on one shard, then all stores will be there, therefore data for products of each store are in the same shard.
Do you think this is correct? What would you suggest your colleague?

### Question 2
You have a lovely SaaS product built on top of a database that uses replication.
Your support team is contacted by a very angry user that says:
"I changed some settings and clicked "Save", after that the settings immediately reverted to old values. After I refreshed the page, the settings were again correct. This is very frustrating for me."
Can you figure out what's probably causing this problem? Do you think there's a solution?