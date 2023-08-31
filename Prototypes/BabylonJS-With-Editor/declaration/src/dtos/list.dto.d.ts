import { Dto } from "./dto";
export declare type ListDto<T> = Dto<T[]> & {
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};
