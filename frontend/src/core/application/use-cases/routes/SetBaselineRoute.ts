import { RoutesPort } from '@/core/ports';

export class SetBaselineRoute {
    constructor(private readonly routesPort: RoutesPort) { }

    async execute(routeId: string, year: number): Promise<void> {
        await this.routesPort.setBaseline(routeId, year);
    }
}
