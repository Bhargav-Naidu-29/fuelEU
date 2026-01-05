import { RouteRepository } from '@/core/ports/outbound/RouteRepository';
import { Route, VesselType, FuelType } from '@/core/domain/entities/Route';
import { Year } from '@/core/domain/value-objects/Year';
import { prisma } from '@/infrastructure/db/prisma';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';

export class PrismaRouteRepository implements RouteRepository {
    async findAll(): Promise<Route[]> {
        const routes = await prisma.route.findMany();
        return routes.map(this.toDomain);
    }

    async findByRouteIdAndYear(routeId: string, year: Year): Promise<Route | null> {
        const route = await prisma.route.findUnique({
            where: {
                routeIdYear: {
                    routeId,
                    year: year.value,
                },
            },
        });
        return route ? this.toDomain(route) : null;
    }

    async findBaseline(year: Year): Promise<Route | null> {
        const route = await prisma.route.findFirst({
            where: {
                year: year.value,
                isBaseline: true,
            },
        });
        return route ? this.toDomain(route) : null;
    }

    async setBaseline(routeId: string, year: Year): Promise<void> {
        await prisma.$transaction([
            prisma.route.updateMany({
                where: {
                    year: year.value,
                },
                data: {
                    isBaseline: false,
                },
            }),
            prisma.route.update({
                where: {
                    routeIdYear: {
                        routeId,
                        year: year.value,
                    },
                },
                data: {
                    isBaseline: true,
                },
            }),
        ]);
    }

    private toDomain(orm: any): Route {
        return new Route({
            routeId: orm.routeId,
            vesselType: orm.vesselType as any, // assuming valid enum string from DB
            fuelType: orm.fuelType as any,
            year: new Year(orm.year),
            ghgIntensity: new GHGIntensity(orm.ghgIntensity),
            fuelConsumption: orm.fuelConsumption,
            distance: orm.distance,
            totalEmissions: orm.totalEmissions,
            isBaseline: orm.isBaseline,
        });
    }

    async findByShipAndYear(shipId: string, year: Year): Promise<Route[]> {
        const records = await prisma.route.findMany({
            where: {
                routeId: shipId,
                year: year.value,
            },
        });

        return records.map(
            (r) =>
                new Route({
                    routeId: r.routeId,
                    vesselType: r.vesselType as VesselType,
                    fuelType: r.fuelType as FuelType,
                    year: new Year(r.year),
                    ghgIntensity: new GHGIntensity(r.ghgIntensity),
                    fuelConsumption: r.fuelConsumption,
                    distance: r.distance,
                    totalEmissions: r.totalEmissions,
                }),
        );
    }
}
