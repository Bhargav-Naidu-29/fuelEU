import { Request, Response } from 'express';
import { BankSurplus } from '@/core/application/use-cases/BankSurplus';
import { ApplyBankedSurplus } from '@/core/application/use-cases/ApplyBankedSurplus';
import { ComplianceRepository } from '@/core/ports/outbound/ComplianceRepository';
import { Year } from '@/core/domain/value-objects/Year';

interface BankRequest {
  shipId: string;
  year: number;
  amount: number;
}

interface ApplyRequest {
  shipId: string;
  year: number;
  amount: number;
}

export class BankingController {
  constructor(
    private readonly complianceRepo: ComplianceRepository,
    private readonly bankSurplus: BankSurplus,
    private readonly applyBanked: ApplyBankedSurplus,
  ) {}

  bank = async (req: Request<unknown, unknown, BankRequest>, res: Response) => {
    const { shipId, year, amount } = req.body;

    const cb = await this.complianceRepo.findByShipAndYear(
      shipId,
      new Year(year),
    );

    if (!cb) {
      return res.status(404).json({ message: 'Compliance balance not found' });
    }

    await this.bankSurplus.execute({ balance: cb, amount });

    res.json({
      cb_before: cb.value,
      banked: amount,
      cb_after: cb.value,
    });
    return;
  };

  apply = async (
    req: Request<unknown, unknown, ApplyRequest>,
    res: Response,
  ) => {
    const { shipId, year, amount } = req.body;

    const cb = await this.complianceRepo.findByShipAndYear(
      shipId,
      new Year(year),
    );

    if (!cb) {
      return res.status(404).json({ message: 'Compliance balance not found' });
    }

    await this.applyBanked.execute({ balance: cb, amount });

    res.json({
      cb_before: cb.value,
      applied: amount,
      cb_after: cb.value + amount,
    });
    return;
  };
}
