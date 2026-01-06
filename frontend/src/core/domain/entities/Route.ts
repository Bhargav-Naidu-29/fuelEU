export type VesselType =
    | 'Container'
    | 'BulkCarrier'
    | 'Tanker'
    | 'RoRo';

export type FuelType =
    | 'HFO'
    | 'LNG'
    | 'MGO';

export interface Route {
    routeId: string;
    vesselType: VesselType;
    fuelType: FuelType;
    year: number;
    ghgIntensity: number;        // gCO₂e/MJ
    fuelConsumption: number;    // t
    distance: number;           // km
    totalEmissions: number;     // t
    isBaseline: boolean;
}

export const Route = {
    fromApi(data: any): Route {
        return {
            routeId: data.routeId,
            vesselType: data.vesselType,
            fuelType: data.fuelType,
            year: data.year,
            ghgIntensity: data.ghgIntensity,
            fuelConsumption: data.fuelConsumption,
            distance: data.distance,
            totalEmissions: data.totalEmissions,
            isBaseline: data.isBaseline,
        };
    }
};
