import { PoolMember } from './PoolMember';

export interface Pool {
    year: number;
    members: PoolMember[];
}

export const Pool = {
    fromApi(data: any): Pool {
        return {
            year: data.year,
            members: (data.members || []).map((m: any) => PoolMember.fromApi(m)),
        };
    },
};
