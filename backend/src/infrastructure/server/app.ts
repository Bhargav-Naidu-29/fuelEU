import express from 'express';
import { ComplianceController } from '@/adapters/inbound/http/controllers/ComplianceController';
import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { PrismaComplianceRepository } from '@/adapters/outbound/postgres/repositories/PrismaComplianceRepository';
import { PrismaBankingRepository } from '@/adapters/outbound/postgres/repositories/PrismaBankingRepository';
import { BankSurplus } from '@/core/application/use-cases/BankSurplus';
import { ApplyBankedSurplus } from '@/core/application/use-cases/ApplyBankedSurplus';
import { BankingController } from '@/adapters/inbound/http/controllers/BankingController';

export function createApp() {
  const app = express();
  app.use(express.json());

  const repository = new PrismaComplianceRepository();

  const computeCB = new ComputeComplianceBalance(
    new GHGIntensity(89.3368),
    repository
  );
  const bankingRepo = new PrismaBankingRepository();

  const bankSurplusUC = new BankSurplus(bankingRepo);
  const applyBankedUC = new ApplyBankedSurplus(bankingRepo);

  const bankingController = new BankingController(
    repository,
    bankSurplusUC,
    applyBankedUC
  );
  const controller = new ComplianceController(computeCB);

  app.post('/compliance/cb', controller.compute);
  app.post('/banking/bank', bankingController.bank);
  app.post('/banking/apply', bankingController.apply);
  return app;
}
