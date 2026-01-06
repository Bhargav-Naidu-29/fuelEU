import { useState, useCallback } from 'react';
import { CreatePool } from '@/core/application/use-cases';
import { poolingApi } from '../dependencies';

export function useCreatePool() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (input: {
        year: number;
        members: {
            shipId: string;
            cbBefore: number;
        }[];
    }) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new CreatePool(poolingApi);
            const result = await useCase.execute(input);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { execute, loading, error };
}
