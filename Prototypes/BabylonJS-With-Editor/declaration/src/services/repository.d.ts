export declare class Repository {
    #private;
    constructor(objectStoreName: any);
    list(filterFn?: () => boolean): AsyncGenerator<any, void, unknown>;
    get(key: any): Promise<unknown>;
    save(entity: any): Promise<void>;
}
