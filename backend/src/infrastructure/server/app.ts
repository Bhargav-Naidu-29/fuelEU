import express from 'express';
import { ComplianceController } from '@/adapters/inbound/http/controllers/ComplianceController';
import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { PrismaComplianceRepository } from '@/adapters/outbound/postgres/repositories/PrismaComplianceRepository';
import { PrismaBankingRepository } from '@/adapters/outbound/postgres/repositories/PrismaBankingRepository';
import { BankSurplus } from '@/core/application/use-cases/BankSurplus';
import { ApplyBankedSurplus } from '@/core/application/use-cases/ApplyBankedSurplus';
import { BankingController } from '@/adapters/inbound/http/controllers/BankingController';
import { CreatePool } from '@/core/application/use-cases/CreatePool';
import { PrismaPoolingRepository } from '@/adapters/outbound/postgres/repositories/PrismaPoolingRepository';
import { PoolingController } from '@/adapters/inbound/http/controllers/PoolingController';

export function createApp() {
  const app = express();
  app.use(express.json());

  const repository = new PrismaComplianceRepository();

  const computeCB = new ComputeComplianceBalance(
    new GHGIntensity(89.3368),
    repository,
  );
  const bankingRepo = new PrismaBankingRepository();
  const poolingRepo = new PrismaPoolingRepository();
  const createPoolUC = new CreatePool(poolingRepo);
  const poolingController = new PoolingController(createPoolUC);
  const bankSurplusUC = new BankSurplus(bankingRepo);
  const applyBankedUC = new ApplyBankedSurplus(bankingRepo);

  const bankingController = new BankingController(
    repository,
    bankSurplusUC,
    applyBankedUC,
  );
  const controller = new ComplianceController(computeCB);

  app.post('/compliance/cb', (req, res, next) => {
    void controller.compute(req, res).catch(next);
  });
  app.post('/banking/bank', (req, res, next) => {
    void bankingController.bank(req, res).catch(next);
  });
  app.post('/banking/apply', (req, res, next) => {
    void bankingController.apply(req, res).catch(next);
  });
  app.post('/pools', (req, res, next) => {
    void poolingController.create(req, res).catch(next);
  });
  return app;
}
