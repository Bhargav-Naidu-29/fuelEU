import { Pool } from '../../domain/entities/Pool';
import { Year } from '../../domain/value-objects/Year';

export interface PoolingRepository {
  save(pool: Pool): Promise<void>;
  findPoolsByYear(year: Year): Promise<Pool[]>;
}
