import { useState, useCallback } from 'react';
import { AdjustedComplianceBalance } from '@/core/domain';
import { GetAdjustedComplianceBalance } from '@/core/application/use-cases';
import { complianceApi } from '../dependencies';

export function useAdjustedComplianceBalance() {
    const [data, setData] = useState<AdjustedComplianceBalance | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (shipId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new GetAdjustedComplianceBalance(complianceApi);
            const result = await useCase.execute(shipId, year);
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
