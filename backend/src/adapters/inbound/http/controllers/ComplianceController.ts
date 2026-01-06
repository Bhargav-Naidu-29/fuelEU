import { Request, Response } from 'express';
import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { Year } from '@/core/domain/value-objects/Year';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { Route, VesselType, FuelType } from '@/core/domain/entities/Route';
import { ComplianceRepository } from '@/core/ports/outbound/ComplianceRepository';
import { BankingRepository } from '@/core/ports/outbound/BankingRepository';

interface ComputeComplianceRequest {
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
}

import { ComputeComplianceFromRoutes } from '@/core/application/use-cases/ComputeComplianceFromRoutes';

import { InvalidComplianceValueError } from '@/core/domain/errors/InvalidComplianceValueError';

export class ComplianceController {
  constructor(
    private readonly computeCB: ComputeComplianceBalance,
    private readonly computeFromRoutes: ComputeComplianceFromRoutes,
    private readonly complianceRepo: ComplianceRepository,
    private readonly bankingRepo: BankingRepository,
  ) { }

  async compute(
    req: Request<unknown, unknown, ComputeComplianceRequest>,
    res: Response,
  ) {
    try {
      const route = new Route({
        routeId: req.body.routeId,
        vesselType: req.body.vesselType,
        fuelType: req.body.fuelType,
        year: new Year(req.body.year),
        ghgIntensity: new GHGIntensity(req.body.ghgIntensity),
        fuelConsumption: req.body.fuelConsumption,
        distance: req.body.distance,
        totalEmissions: req.body.totalEmissions,
      });

      const cb = await this.computeCB.execute(route);

      res.json({
        shipId: cb.shipId,
        year: cb.year.value,
        value: cb.value,
      });
    } catch (error: any) {
      if (error instanceof InvalidComplianceValueError || error.message?.includes('No routes found')) {
        res.status(400).json({ error: error.message });
      } else {
        throw error;
      }
    }
  }

  // getCompute = async (
  //   req: Request<
  //     unknown,
  //     unknown,
  //     unknown,
  //     ComputeComplianceRequest & {
  //       year: string;
  //       ghgIntensity: string;
  //       fuelConsumption: string;
  //       distance: string;
  //       totalEmissions: string;
  //     }
  //   >,
  //   res: Response,
  // ) => {
  //   const route = new Route({
  //     routeId: req.query.routeId,
  //     vesselType: req.query.vesselType,
  //     fuelType: req.query.fuelType,
  //     year: new Year(Number(req.query.year)),
  //     ghgIntensity: new GHGIntensity(Number(req.query.ghgIntensity)),
  //     fuelConsumption: Number(req.query.fuelConsumption),
  //     distance: Number(req.query.distance),
  //     totalEmissions: Number(req.query.totalEmissions),
  //   });

  //   const cb = await this.computeCB.execute(route);

  //   res.json({
  //     shipId: cb.shipId,
  //     year: cb.year.value,
  //     value: cb.value,
  //   });
  // };


  async getCompute(
    req: Request<unknown, unknown, unknown, { shipId: string; year: string }>,
    res: Response,
  ) {
    try {
      const shipId = req.query.shipId;
      const year = new Year(Number(req.query.year));

      const cb = await this.computeFromRoutes.execute(shipId, year);

      res.json({
        shipId: cb.shipId,
        year: cb.year.value,
        value: cb.value,
      });
    } catch (error: any) {
      if (error instanceof InvalidComplianceValueError || error.message?.includes('No routes found')) {
        res.status(400).json({ error: error.message });
      } else {
        throw error;
      }
    }
  }


  async getAdjusted(
    req: Request<unknown, unknown, unknown, { shipId: string; year: string }>,
    res: Response,
  ) {
    const year = new Year(Number(req.query.year));
    const shipId = req.query.shipId;

    const cb = await this.complianceRepo.findByShipAndYear(shipId, year);
    if (!cb) {
      res.status(404).json({ error: 'Compliance balance not found' });
      return;
    }

    let adjustedValue = cb.value;

    if (cb.isDeficit()) {
      const banked = await this.bankingRepo.findTotalBankedForShip(
        shipId,
        year,
      );
      // We apply as much banked surplus as needed/available to cover deficit
      // Since it's read-only, we just simulate the math
      // Deficit is negative value.
      const needed = Math.abs(cb.value);
      const applied = Math.min(needed, banked);
      adjustedValue = cb.value + applied;
    }

    res.json({
      shipId: cb.shipId,
      year: cb.year.value,
      originalValue: cb.value,
      adjustedValue,
    });
  }
}
