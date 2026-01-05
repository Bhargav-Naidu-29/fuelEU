import { Year } from '../value-objects/Year';
import { GHGIntensity } from '../value-objects/GHGIntensity';
import { InvalidGHGIntensityError } from '../errors/InvalidGHGIntensityError';

export type VesselType =
  | 'Container'
  | 'BulkCarrier'
  | 'Tanker'
  | 'RoRo';

export type FuelType =
  | 'HFO'
  | 'LNG'
  | 'MGO';

export class Route {
  private readonly _routeId: string;
  private readonly _vesselType: VesselType;
  private readonly _fuelType: FuelType;
  private readonly _year: Year;
  private readonly _ghgIntensity: GHGIntensity;
  private readonly _fuelConsumption: number;
  private readonly _distance: number;
  private readonly _totalEmissions: number;
  private readonly _isBaseline: boolean;

  constructor(params: {
    routeId: string;
    vesselType: VesselType;
    fuelType: FuelType;
    year: Year;
    ghgIntensity: GHGIntensity;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline?: boolean;
  }) {
    if (params.ghgIntensity.value <= 0) {
      throw new InvalidGHGIntensityError(params.ghgIntensity.value);
    }

    if (params.fuelConsumption <= 0) {
      throw new Error('Fuel consumption must be positive');
    }

    if (params.distance < 0) {
      throw new Error('Distance cannot be negative');
    }

    if (params.totalEmissions < 0) {
      throw new Error('Total emissions cannot be negative');
    }

    this._routeId = params.routeId;
    this._vesselType = params.vesselType;
    this._fuelType = params.fuelType;
    this._year = params.year;
    this._ghgIntensity = params.ghgIntensity;
    this._fuelConsumption = params.fuelConsumption;
    this._distance = params.distance;
    this._totalEmissions = params.totalEmissions;
    this._isBaseline = params.isBaseline ?? false;
  }

  get routeId(): string { return this._routeId; }
  get vesselType(): VesselType { return this._vesselType; }
  get fuelType(): FuelType { return this._fuelType; }
  get year(): Year { return this._year; }
  get ghgIntensity(): GHGIntensity { return this._ghgIntensity; }
  get fuelConsumption(): number { return this._fuelConsumption; }
  get distance(): number { return this._distance; }
  get totalEmissions(): number { return this._totalEmissions; }
  get isBaseline(): boolean { return this._isBaseline; }
}
