export interface ComplianceBalance {
    shipId: string;
    year: number;
    value: number;           // gCO2eq
}

export interface AdjustedComplianceBalance {
    shipId: string;
    year: number;
    originalValue: number;
    applied: number;
    adjustedValue: number;
}

export const ComplianceBalance = {
    fromApi(data: any): ComplianceBalance {
        return {
            shipId: data.shipId,
            year: data.year,
            value: data.value,
        };
    },
};

export const AdjustedComplianceBalance = {
    fromApi(data: any): AdjustedComplianceBalance {
        return {
            shipId: data.shipId,
            year: data.year,
            originalValue: data.originalValue,
            applied: data.adjustedValue - data.originalValue,
            adjustedValue: data.adjustedValue,
        };
    },
};
