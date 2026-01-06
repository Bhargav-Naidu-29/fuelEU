import { Request, Response } from 'express';
import { CreatePool } from '@/core/application/use-cases/CreatePool';
import { Year } from '@/core/domain/value-objects/Year';

interface CreatePoolRequest {
  year: number;
  members: { shipId: string; cb: number }[];
}

export class PoolingController {
  constructor(private readonly createPool: CreatePool) { }

  create = async (
    req: Request<unknown, unknown, CreatePoolRequest>,
    res: Response,
  ) => {
    try {
      const { year, members } = req.body;

      // Handle both formats if necessary, but frontend uses cbBefore
      const mappedMembers = members.map(m => ({
        shipId: m.shipId,
        cb: (m as any).cbBefore !== undefined ? (m as any).cbBefore : m.cb
      }));

      const pool = await this.createPool.execute({
        year: new Year(Number(year)),
        members: mappedMembers,
      });

      res.json({
        members: pool.members.map(member => ({
          shipId: member.shipId,
          cbBefore: member.cbBefore,
          cbAfter: member.cbAfter,
        })),
      });
    } catch (error: any) {
      const status = error.message.includes('Pool sum') ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  };
}
