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
  private readonly _year: number;
  private readonly _ghgIntensity: number;
  private readonly _fuelConsumption: number;
  private readonly _distance: number;
  private readonly _totalEmissions: number;
  private readonly _isBaseline: boolean;

  constructor(params: {
    routeId: string;
    vesselType: VesselType;
    fuelType: FuelType;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline?: boolean;
  }) {
    if (params.ghgIntensity <= 0) {
      throw new Error('GHG intensity must be positive');
    }

    if (params.fuelConsumption <= 0) {
      throw new Error('Fuel consumption must be positive');
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

  // Read-only getters
  get routeId() { return this._routeId; }
  get vesselType() { return this._vesselType; }
  get fuelType() { return this._fuelType; }
  get year() { return this._year; }
  get ghgIntensity() { return this._ghgIntensity; }
  get fuelConsumption() { return this._fuelConsumption; }
  get distance() { return this._distance; }
  get totalEmissions() { return this._totalEmissions; }
  get isBaseline() { return this._isBaseline; }
}
