export interface PoolMember {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
}

export const PoolMember = {
    fromApi(data: any): PoolMember {
        return {
            shipId: data.shipId,
            cbBefore: data.cbBefore,
            cbAfter: data.cbAfter,
        };
    },
};
