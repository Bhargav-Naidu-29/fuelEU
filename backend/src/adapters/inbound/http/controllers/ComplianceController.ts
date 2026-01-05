import { Request, Response } from 'express';
import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { Year } from '@/core/domain/value-objects/Year';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { Route, VesselType, FuelType } from '@/core/domain/entities/Route';

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

export class ComplianceController {
  constructor(private readonly computeCB: ComputeComplianceBalance) {}

  compute = async (
    req: Request<unknown, unknown, ComputeComplianceRequest>,
    res: Response,
  ) => {
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
  };
}
