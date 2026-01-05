import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { Year } from '../../domain/value-objects/Year';

export class SetBaselineRoute {
    constructor(private readonly repository: RouteRepository) { }

    async execute(routeId: string, year: Year): Promise<void> {
        await this.repository.setBaseline(routeId, year);
    }
}
