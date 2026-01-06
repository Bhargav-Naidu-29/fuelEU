import { Request, Response } from 'express';
import { BankSurplus } from '@/core/application/use-cases/BankSurplus';

import { ApplyBankedSurplus } from '@/core/application/use-cases/ApplyBankedSurplus';
import { GetBankingRecords } from '@/core/application/use-cases/GetBankingRecords';
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
    private readonly getBankingRecords: GetBankingRecords,
  ) { }


  async bank(req: Request<unknown, unknown, BankRequest>, res: Response) {
    try {
      const { shipId, year, amount } = req.body;

      if (amount === undefined || amount === null) {
        res.status(400).json({ error: 'amount is required' });
        return;
      }

      const cb = await this.complianceRepo.findByShipAndYear(
        shipId,
        new Year(Number(year)),
      );

      if (!cb) {
        res.status(404).json({ message: 'Compliance balance not found' });
        return;
      }

      await this.bankSurplus.execute({ balance: cb, amount });

      res.json({
        cb_before: cb.value,
        banked: amount,
        cb_after: cb.value - amount,
      });
    } catch (error: any) {
      console.error('[BankingController.bank]', error.message);
      res.status(400).json({ error: error.message || 'Failed to bank surplus' });
    }
  }

  async apply(
    req: Request<unknown, unknown, ApplyRequest>,
    res: Response,
  ) {
    try {
      const { shipId, year, amount } = req.body;

      if (amount === undefined || amount === null) {
        res.status(400).json({ error: 'amount is required' });
        return;
      }

      const cb = await this.complianceRepo.findByShipAndYear(
        shipId,
        new Year(Number(year)),
      );

      if (!cb) {
        res.status(404).json({ message: 'Compliance balance not found' });
        return;
      }

      await this.applyBanked.execute({ balance: cb, amount });

      res.json({
        cb_before: cb.value,
        applied: amount,
        cb_after: cb.value + amount,
      });
    } catch (error: any) {
      if (error.message === 'Insufficient banked surplus available') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }



  async getRecords(
    req: Request<unknown, unknown, unknown, { shipId: string; year: string }>,
    res: Response,
  ) {
    const { shipId, year } = req.query;

    const records = await this.getBankingRecords.execute(
      shipId,
      new Year(Number(year)),
    );

    res.json(records);
  }
}

