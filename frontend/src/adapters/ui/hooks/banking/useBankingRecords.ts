import { useState, useCallback } from 'react';
import { BankRecord } from '@/core/domain';
import { GetBankingRecords } from '@/core/application/use-cases';
import { bankingApi } from '../dependencies';

export function useBankingRecords() {
    const [data, setData] = useState<BankRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (shipId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const useCase = new GetBankingRecords(bankingApi);
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
