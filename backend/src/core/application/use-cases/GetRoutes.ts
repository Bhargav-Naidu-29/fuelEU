import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { Route } from '../../domain/entities/Route';

export class GetRoutes {
    constructor(private readonly repository: RouteRepository) { }

    async execute(): Promise<Route[]> {
        return this.repository.findAll();
    }
}
