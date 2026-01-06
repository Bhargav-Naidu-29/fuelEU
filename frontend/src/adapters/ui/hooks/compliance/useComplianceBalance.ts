import { useState, useCallback } from 'react';
import { ComplianceBalance } from '@/core/domain';
import { GetComplianceBalance } from '@/core/application/use-cases';
import { complianceApi } from '../dependencies';

export function useComplianceBalance() {
    const [data, setData] = useState<ComplianceBalance | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (shipId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new GetComplianceBalance(complianceApi);
            const result = await useCase.execute(shipId, year);
            setData(result);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, execute, loading, error };
}
