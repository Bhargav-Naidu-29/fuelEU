import { useState, useCallback } from 'react';
import { ApplyBankedSurplus } from '@/core/application/use-cases';
import { bankingApi } from '../dependencies';

export function useApplyBankedSurplus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (shipId: string, year: number, amount: number) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new ApplyBankedSurplus(bankingApi);
            await useCase.execute(shipId, year, amount);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { execute, loading, error };
}
