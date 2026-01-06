import request from 'supertest';
import { createApp } from '../../src/infrastructure/server/app';

// Mock Prisma to avoid hitting a real database
import { jest } from '@jest/globals';

jest.mock('@/infrastructure/db/prisma', () => {
  const routeFindMany = jest.fn();
  const routeFindUnique = jest.fn();
  const routeFindFirst = jest.fn();
  const routeUpdateMany = jest.fn();
  const routeUpdate = jest.fn();


  const shipUpsert = jest.fn();
  const shipFindUnique = jest.fn();

  const bankCreate = jest.fn();
  const bankAggregate = jest.fn();
  const bankFindMany = jest.fn();

  const poolCreate = jest.fn();
  const poolFindMany = jest.fn();
  const poolMemberCreateMany = jest.fn();
  const $transaction = jest.fn(async (ops: any) => {
    if (Array.isArray(ops)) {
      // emulate sequential success
      for (const _ of ops) {
        // no-op for updateMany/update
        await Promise.resolve();
      }
      return;
    }
    // emulate callback-style transaction
    return await ops({
      route: { updateMany: routeUpdateMany, update: routeUpdate },
    });
  });

  return {
    prisma: {
      route: {
        findMany: routeFindMany,
        findUnique: routeFindUnique,
        findFirst: routeFindFirst,
        updateMany: routeUpdateMany,
        update: routeUpdate,
      },
      shipCompliance: {
        upsert: shipUpsert,
        findUnique: shipFindUnique,
      },
      bankEntry: {
        create: bankCreate,
        aggregate: bankAggregate,
        findMany: bankFindMany,
      },
      pool: {
        create: poolCreate,
        findMany: poolFindMany,
      },
      poolMember: {
        createMany: poolMemberCreateMany,
      },
      $transaction,
    },
  };
});

const app = createApp();

import { describe } from '@jest/globals';

describe('HTTP Integration Tests (Supertest)', () => {
  const { prisma } = require('@/infrastructure/db/prisma');

  beforeEach(() => {


    jest.clearAllMocks();
  });

  describe('GET /routes', () => {
    it('returns all routes mapped to API schema', async () => {
      prisma.route.findMany.mockResolvedValue([
        {
          id: 1,
          routeId: 'R001',
          vesselType: 'Container',
          fuelType: 'HFO',
          year: 2024,
          ghgIntensity: 91.0,
          fuelConsumption: 5000,
          distance: 12000,
          totalEmissions: 4500,
          isBaseline: true,
        },
      ]);

      const res = await request(app).get('/routes');
      expect(res.status).toBe(200);

      expect(res.body).toEqual([
        expect.objectContaining({
          routeId: 'R001',
          year: 2024,
          vesselType: 'Container',
          fuelType: 'HFO',
          ghgIntensity: 91.0,
          isBaseline: true,
        }),
      ]);
    });
  });

  describe('POST /routes/:routeId/baseline', () => {
    it('sets baseline for the given route and year', async () => {
      prisma.$transaction.mockResolvedValue(undefined);
      prisma.route.updateMany.mockResolvedValue({ count: 1 });
      prisma.route.update.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .post('/routes/R001/baseline')
        .send({ year: 2024 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Baseline set' });
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('GET /routes/comparison', () => {
    it('returns comparison result when route and baseline exist', async () => {
      prisma.route.findUnique.mockResolvedValue({
        routeId: 'R002',
        vesselType: 'BulkCarrier',
        fuelType: 'LNG',
        year: 2024,
        ghgIntensity: 85,
        fuelConsumption: 4800,
        distance: 11500,
        totalEmissions: 4200,
        isBaseline: false,
      });
      prisma.route.findFirst.mockResolvedValue({
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 90,
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: true,
      });

      const res = await request(app).get('/routes/comparison').query({ routeId: 'R002', year: 2024 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          percentDiff: expect.any(Number),
          compliant: true,
          baseline: expect.objectContaining({ ghgIntensity: 90 }),
          comparison: expect.objectContaining({ ghgIntensity: 85 }),
        }),
      );
      const expectedPercent = ((85 / 90) - 1) * 100;
      expect(res.body.percentDiff).toBeCloseTo(expectedPercent, 5);
    });

    it('returns 404 when route not found', async () => {
      prisma.route.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/routes/comparison').query({ routeId: 'R999', year: 2024 });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Route not found' });
    });
  });

  describe('POST /compliance/cb', () => {
    it('computes compliance balance for posted route and saves it', async () => {
      prisma.shipCompliance.upsert.mockResolvedValue({});

      const body = {
        routeId: 'R010',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 88.0,
        fuelConsumption: 100, // tons
        distance: 1000,
        totalEmissions: 900,
      };

      const res = await request(app).post('/compliance/cb').send(body);
      expect(res.status).toBe(200);
      expect(res.body.shipId).toBe('R010');
      expect(res.body.year).toBe(2024);
      const energy = body.fuelConsumption * 41000;
      const expectedValue = (89.3368 - body.ghgIntensity) * energy;
      expect(res.body.value).toBeCloseTo(expectedValue, 5);
      expect(prisma.shipCompliance.upsert).toHaveBeenCalled();
    });
  });

  describe('GET /compliance/cb', () => {
    it('computes compliance from existing routes for ship and year', async () => {
      prisma.route.findMany.mockResolvedValue([
        { routeId: 'R020', year: 2024, ghgIntensity: 90, fuelConsumption: 50, distance: 0, totalEmissions: 0, vesselType: 'Container', fuelType: 'HFO' },
        { routeId: 'R020', year: 2024, ghgIntensity: 88, fuelConsumption: 70, distance: 0, totalEmissions: 0, vesselType: 'Container', fuelType: 'HFO' },
      ]);
      prisma.shipCompliance.upsert.mockResolvedValue({});

      const res = await request(app).get('/compliance/cb').query({ shipId: 'R020', year: 2024 });
      expect(res.status).toBe(200);
      expect(res.body.shipId).toBe('R020');
      expect(res.body.year).toBe(2024);

      const energies = [50 * 41000, 70 * 41000];
      const totalEnergy = energies[0] + energies[1];
      const weightedIntensity = ((90 * energies[0]) + (88 * energies[1])) / totalEnergy;
      const expectedValue = (89.3368 - weightedIntensity) * totalEnergy;
      expect(res.body.value).toBeCloseTo(expectedValue, 5);
    });
  });

  describe('GET /compliance/adjusted-cb', () => {
    it('returns 404 when compliance balance is not found', async () => {
      prisma.shipCompliance.findUnique.mockResolvedValue(null);
      const res = await request(app).get('/compliance/adjusted-cb').query({ shipId: 'R030', year: 2024 });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Compliance balance not found' });
    });

    it('returns adjusted value when deficit and banked surplus available', async () => {
      prisma.shipCompliance.findUnique.mockResolvedValue({ shipId: 'R031', year: 2024, cbGco2eq: -120 });
      prisma.bankEntry.aggregate.mockResolvedValue({ _sum: { amountGco2eq: 50 } });

      const res = await request(app).get('/compliance/adjusted-cb').query({ shipId: 'R031', year: 2024 });
      expect(res.status).toBe(200);
      expect(res.body.originalValue).toBe(-120);
      expect(res.body.adjustedValue).toBe(-70);
    });
  });

  describe('POST /banking/bank', () => {
    it('banks surplus successfully', async () => {
      prisma.shipCompliance.findUnique.mockResolvedValue({ shipId: 'R040', year: 2024, cbGco2eq: 100 });
      prisma.bankEntry.create.mockResolvedValue({});

      const res = await request(app).post('/banking/bank').send({ shipId: 'R040', year: 2024, amount: 40 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ cb_before: 100, banked: 40, cb_after: 60 });
    });

    it('returns 400 when trying to bank from non-positive balance', async () => {
      prisma.shipCompliance.findUnique.mockResolvedValue({ shipId: 'R041', year: 2024, cbGco2eq: -10 });

      const res = await request(app).post('/banking/bank').send({ shipId: 'R041', year: 2024, amount: 5 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Cannot bank a non-positive compliance balance' });
    });
  });

  describe('POST /banking/apply', () => {
    it('returns 409 when insufficient banked surplus available', async () => {
      prisma.shipCompliance.findUnique.mockResolvedValue({ shipId: 'R050', year: 2024, cbGco2eq: -100 });
      prisma.bankEntry.aggregate.mockResolvedValue({ _sum: { amountGco2eq: 50 } });

      const res = await request(app).post('/banking/apply').send({ shipId: 'R050', year: 2024, amount: 80 });
      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Insufficient banked surplus available' });
    });

    it('applies banked surplus to deficit successfully', async () => {
      prisma.shipCompliance.findUnique.mockResolvedValue({ shipId: 'R051', year: 2024, cbGco2eq: -100 });
      prisma.bankEntry.aggregate.mockResolvedValue({ _sum: { amountGco2eq: 150 } });
      prisma.bankEntry.create.mockResolvedValue({});

      const res = await request(app).post('/banking/apply').send({ shipId: 'R051', year: 2024, amount: 100 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ cb_before: -100, applied: 100, cb_after: 0 });
    });
  });

  describe('GET /banking/records', () => {
    it('returns banking records for ship and year', async () => {
      prisma.bankEntry.findMany.mockResolvedValue([
        { id: 'b1', shipId: 'R060', year: 2024, amountGco2eq: 40 },
        { id: 'b2', shipId: 'R060', year: 2024, amountGco2eq: -10 },
      ]);

      const res = await request(app).get('/banking/records').query({ shipId: 'R060', year: 2024 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: 'b1', shipId: 'R060', year: 2024, amountGco2eq: 40 },
        { id: 'b2', shipId: 'R060', year: 2024, amountGco2eq: -10 },
      ]);
    });
  });
});
