import { Pool } from '@/core/domain';

export interface PoolingPort {
    createPool(input: {
        year: number;
        members: {
            shipId: string;
            cbBefore: number;
        }[];
    }): Promise<Pool>;
}
