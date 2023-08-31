export declare class Repository<T> {
    private objectStoreName;
    private db;
    constructor(objectStoreName: string);
    list(filterFn?: () => boolean): AsyncGenerator<Awaited<T>, void, unknown>;
    get(key: any): Promise<T>;
    count(): Promise<number>;
    save(entity: T): Promise<void>;
    private cursorGenerator;
    private getFirstCursor;
    private getNextCursor;
    private ensureDatabaseInitialized;
    private initDatabase;
}
