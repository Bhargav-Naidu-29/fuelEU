import { useState, useCallback } from 'react';
import { Route } from '@/core/domain';
import { CompareRoutes } from '@/core/application/use-cases';
import { routesApi } from '../dependencies';

export function useCompareRoutes() {
    const [data, setData] = useState<{
        baseline: Route;
        comparison: Route;
        percentDiff: number;
        compliant: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (routeId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new CompareRoutes(routesApi);
            const result = await useCase.execute(routeId, year);
            setData(result);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, execute, loading, error };
}
