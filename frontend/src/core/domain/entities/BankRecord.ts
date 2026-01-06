export interface BankRecord {
    shipId: string;
    year: number;
    amount: number;          // gCO2eq
    createdAt: string;       // ISO date
}

export const BankRecord = {
    fromApi(data: any): BankRecord {
        return {
            shipId: data.shipId,
            year: data.year,
            amount: data.amount,
            createdAt: data.createdAt,
        };
    },
};
