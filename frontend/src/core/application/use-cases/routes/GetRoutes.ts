import { RoutesPort } from '@/core/ports';
import { Route } from '@/core/domain';

export class GetRoutes {
    constructor(private readonly routesPort: RoutesPort) { }

    async execute(): Promise<Route[]> {
        return await this.routesPort.getRoutes();
    }
}
