import { PoolingPort } from '@/core/ports';
import { Pool } from '@/core/domain';

export class CreatePool {
    constructor(private readonly poolingPort: PoolingPort) { }

    async execute(input: {
        year: number;
        members: {
            shipId: string;
            cbBefore: number;
        }[];
    }): Promise<Pool> {
        return await this.poolingPort.createPool(input);
    }
}
