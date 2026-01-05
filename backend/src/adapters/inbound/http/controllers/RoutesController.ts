import { Request, Response } from 'express';
import { GetRoutes } from '@/core/application/use-cases/GetRoutes';
import { SetBaselineRoute } from '@/core/application/use-cases/SetBaselineRoute';
import { CompareRoutes } from '@/core/application/use-cases/CompareRoutes';
import { Year } from '@/core/domain/value-objects/Year';

export class RoutesController {
    constructor(
        private readonly getRoutes: GetRoutes,
        private readonly setBaselineRoute: SetBaselineRoute,
        private readonly compareRoutes: CompareRoutes,
    ) { }

    getAll = async (req: Request, res: Response) => {
        const routes = await this.getRoutes.execute();
        const response = routes.map((r) => ({
            routeId: r.routeId,
            year: r.year.value,
            vesselType: r.vesselType,
            fuelType: r.fuelType,
            ghgIntensity: r.ghgIntensity.value,
            fuelConsumption: r.fuelConsumption,
            distance: r.distance,
            totalEmissions: r.totalEmissions,
            isBaseline: r.isBaseline,
        }));
        res.json(response);
    };

    setBaseline = async (req: Request, res: Response) => {
        const { routeId } = req.params;
        const { year } = req.body;

        if (!year) {
            res.status(400).json({ error: 'Year is required' });
            return;
        }

        try {
            await this.setBaselineRoute.execute(routeId, new Year(year));
            res.sendStatus(200);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Failed to set baseline' });
        }
    };

    compare = async (req: Request, res: Response) => {
        const { routeId, year } = req.query;

        if (!routeId || !year) {
            res.status(400).json({ error: 'routeId and year are required' });
            return;
        }

        try {
            const result = await this.compareRoutes.execute(
                String(routeId),
                new Year(Number(year)),
            );

            res.json({
                route: {
                    routeId: result.route.routeId,
                    ghgIntensity: result.route.ghgIntensity.value,
                },
                baseline: {
                    routeId: result.baseline.routeId,
                    ghgIntensity: result.baseline.ghgIntensity.value,
                },
                comparison: result.comparison,
            });
        } catch (e: any) {
            console.error(e);
            if (e.message === 'Route not found' || e.message === 'No baseline set for this year') {
                res.status(404).json({ error: e.message });
            } else {
                res.status(500).json({ error: 'Comparison failed' });
            }
        }
    };
}
