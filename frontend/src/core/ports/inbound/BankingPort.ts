import { BankRecord } from '@/core/domain';

export interface BankingPort {
    getBankingRecords(
        shipId: string,
        year: number
    ): Promise<BankRecord[]>;

    bankSurplus(
        shipId: string,
        year: number
    ): Promise<void>;

    applyBankedSurplus(
        shipId: string,
        year: number,
        amount: number
    ): Promise<void>;
}
