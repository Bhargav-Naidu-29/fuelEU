import { useState, useCallback } from 'react';
import { SetBaselineRoute } from '@/core/application/use-cases';
import { routesApi } from '../dependencies';

export function useSetBaseline() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (routeId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new SetBaselineRoute(routesApi);
            await useCase.execute(routeId, year);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { execute, loading, error };
}
