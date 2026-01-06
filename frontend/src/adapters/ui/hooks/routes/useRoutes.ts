import { useState, useEffect, useCallback } from 'react';
import { Route } from '@/core/domain';
import { GetRoutes } from '@/core/application/use-cases';
import { routesApi } from '../dependencies';

export function useRoutes() {
    const [data, setData] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new GetRoutes(routesApi);
            const routes = await useCase.execute();
            setData(routes);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { data, loading, error, refresh };
}
