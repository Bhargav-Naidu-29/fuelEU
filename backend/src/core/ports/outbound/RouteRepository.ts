import { Route } from '@/core/domain/entities/Route';
import { Year } from '@/core/domain/value-objects/Year';

export interface RouteRepository {
    findAll(): Promise<Route[]>;
    findByRouteIdAndYear(routeId: string, year: Year): Promise<Route | null>;
    findBaseline(year: Year): Promise<Route | null>;
    setBaseline(routeId: string, year: Year): Promise<void>;
    findByShipAndYear(shipId: string, year: Year): Promise<Route[]>;
    findByYear(year: Year): Promise<Route[]>;
}
