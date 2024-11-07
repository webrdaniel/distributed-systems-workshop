/**
 * DO NOT EDIT THIS CLASS!
 */
export class FakeRedisNode {
    private data = new Map<string, unknown>();
    private getCalledCount = 0;
    private setCalledCount = 0;
    private delCalledCount = 0;

    /**
     * Returns the value associated with the key, or `undefined` if there is none.
     */
    get(key: string): unknown {
        this.getCalledCount++;
        return this.data.get(key);
    }

    /**
     * Associates the value with the key.
     */
    set(key: string, value: unknown): void {
        this.setCalledCount++;
        this.data.set(key, value);
    }

    /**
     * Deletes the key and its associated value.
     */
    del(key: string): void {
        this.delCalledCount++;
        this.data.delete(key);
    }
}
