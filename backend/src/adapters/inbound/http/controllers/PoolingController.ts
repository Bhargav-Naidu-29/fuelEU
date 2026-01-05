import { Request, Response } from 'express';
import { CreatePool } from '@/core/application/use-cases/CreatePool';
import { Year } from '@/core/domain/value-objects/Year';

interface CreatePoolRequest {
  year: number;
  members: { shipId: string; cb: number }[];
}

export class PoolingController {
  constructor(private readonly createPool: CreatePool) {}

  create = async (
    req: Request<unknown, unknown, CreatePoolRequest>,
    res: Response,
  ) => {
    const { year, members } = req.body;

    const pool = await this.createPool.execute({
      year: new Year(year),
      members,
    });

    res.json({
      members: pool.members.map(member => ({
        shipId: member.shipId,
        cbBefore: member.cbBefore,
        cbAfter: member.cbAfter,
      })),
    });
  };
}
