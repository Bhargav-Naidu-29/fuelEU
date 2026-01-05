import { Request, Response } from 'express';
import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { Year } from '@/core/domain/value-objects/Year';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { Route } from '@/core/domain/entities/Route';

export class ComplianceController {
  constructor(private readonly computeCB: ComputeComplianceBalance) {}

  compute = (req: Request, res: Response) => {
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

    const cb = this.computeCB.execute(route);

    res.json({
      shipId: cb.shipId,
      year: cb.year.value,
      value: cb.value,
    });
  };
}
