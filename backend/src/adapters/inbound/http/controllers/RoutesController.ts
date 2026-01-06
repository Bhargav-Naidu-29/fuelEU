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

    async getAll(_req: Request, res: Response) {
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
    }

    async setBaseline(req: Request, res: Response) {
        const { routeId } = req.params;
        const { year } = req.body;

        if (!year) {
            res.status(400).json({ error: 'Year is required' });
            return;
        }

        try {
            await this.setBaselineRoute.execute(routeId, new Year(year));
            res.status(200).json({ message: 'Baseline set' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Failed to set baseline' });
        }
    }

    async compare(req: Request, res: Response) {
        const { routeId, year } = req.query;

        if (!year) {
            res.status(400).json({ error: 'Year is required' });
            return;
        }

        try {
            const result = await this.compareRoutes.execute(
                new Year(Number(year)),
                routeId ? String(routeId) : undefined,
            );

            const formatRoute = (r: any) => ({
                routeId: r.routeId,
                vesselType: r.vesselType,
                fuelType: r.fuelType,
                year: r.year.value,
                ghgIntensity: r.ghgIntensity.value,
                fuelConsumption: r.fuelConsumption,
                distance: r.distance,
                totalEmissions: r.totalEmissions,
                isBaseline: r.isBaseline,
            });

            const response: any = {
                baseline: formatRoute(result.baseline),
                comparison: result.comparison,
            };

            if (result.route) {
                response.comparisonRoute = formatRoute(result.route);
            }

            if (result.results) {
                response.results = result.results.map(r => ({
                    route: formatRoute(r.route),
                    percentDiff: r.percentDiff,
                    compliant: r.compliant
                }));
            }

            res.json(response);
        } catch (e: any) {
            console.error('[RoutesController.compare]', e.message);
            if (e.message === 'Route not found' || e.message === 'No baseline set for this year') {
                res.status(404).json({ error: e.message });
            } else {
                res.status(500).json({ error: 'Comparison failed' });
            }
        }
    }
}
