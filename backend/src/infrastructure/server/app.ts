import express from 'express';
import { ComplianceController } from '@/adapters/inbound/http/controllers/ComplianceController';
import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';

export function createApp() {
  const app = express();
  app.use(express.json());

  const computeCB = new ComputeComplianceBalance(new GHGIntensity(89.3368));

  const controller = new ComplianceController(computeCB);

  app.post('/compliance/cb', controller.compute);

  return app;
}
