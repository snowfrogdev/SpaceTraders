import { Dto } from "./dto";

export type ListDto<T> = Dto<T[]> & {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};
