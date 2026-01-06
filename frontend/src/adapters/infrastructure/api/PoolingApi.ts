import { PoolingPort } from '@/core/ports';
import { Pool } from '@/core/domain';
import { HttpClientPort } from '@/core/ports';

export class PoolingApi implements PoolingPort {
    constructor(private readonly http: HttpClientPort) { }

    async createPool(input: {
        year: number;
        members: {
            shipId: string;
            cbBefore: number;
        }[];
    }): Promise<Pool> {
        const data = await this.http.post('/pools', input);
        return Pool.fromApi(data);
    }
}
