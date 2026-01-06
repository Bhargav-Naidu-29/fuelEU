import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
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
import { GetBankingRecords } from '@/core/application/use-cases/GetBankingRecords';
import { PrismaRouteRepository } from '@/adapters/outbound/postgres/repositories/PrismaRouteRepository';
import { GetRoutes } from '@/core/application/use-cases/GetRoutes';
import { SetBaselineRoute } from '@/core/application/use-cases/SetBaselineRoute';
import { CompareRoutes } from '@/core/application/use-cases/CompareRoutes';
import { RoutesController } from '@/adapters/inbound/http/controllers/RoutesController';
import { ComputeComplianceFromRoutes } from '@/core/application/use-cases/ComputeComplianceFromRoutes';

export function createApp() {
  const app = express();
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
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
  const getBankingRecordsUC = new GetBankingRecords(bankingRepo);

  const routeRepo = new PrismaRouteRepository();
  const getRoutesUC = new GetRoutes(routeRepo);
  const setBaselineUC = new SetBaselineRoute(routeRepo);
  const compareRoutesUC = new CompareRoutes(routeRepo);
  const routesController = new RoutesController(getRoutesUC, setBaselineUC, compareRoutesUC);

  const computeFromRoutes = new ComputeComplianceFromRoutes(
    new GHGIntensity(89.3368),
    routeRepo,
    repository,
  );

  const bankingController = new BankingController(
    repository,
    bankSurplusUC,
    applyBankedUC,
    getBankingRecordsUC,
  );
  const controller = new ComplianceController(
    computeCB,
    computeFromRoutes,
    repository,
    bankingRepo,
  );


  app.post('/compliance/cb', (req, res, next) => {
    void controller.compute(req, res).catch(next);
  });
  app.get('/compliance/cb', (req, res, next) => {
    void controller.getCompute(req as any, res).catch(next);
  });
  app.get('/compliance/adjusted-cb', (req, res, next) => {
    void controller.getAdjusted(req as any, res).catch(next);
  });


  app.post('/banking/bank', (req, res, next) => {
    void bankingController.bank(req, res).catch(next);
  });
  app.post('/banking/apply', (req, res, next) => {
    void bankingController.apply(req, res).catch(next);
  });
  app.get('/banking/records', (req, res, next) => {
    void bankingController.getRecords(req as any, res).catch(next);
  });

  app.post('/pools', (req, res, next) => {
    void poolingController.create(req, res).catch(next);
  });

  app.get('/routes', (req, res, next) => {
    void routesController.getAll(req, res).catch(next);
  });
  app.post('/routes/:routeId/baseline', (req, res, next) => {
    void routesController.setBaseline(req, res).catch(next);
  });
  app.get('/routes/comparison', (req, res, next) => {
    void routesController.compare(req, res).catch(next);
  });

  // Catch 404 and return JSON
  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });

  // Generic error handler to ensure JSON responses and prevent HTML error pages
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error(`[Error] ${req.method} ${req.path}:`, err.message);
    const status = err.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Internal Server Error' : err.message
    });
  });

  return app;
}

