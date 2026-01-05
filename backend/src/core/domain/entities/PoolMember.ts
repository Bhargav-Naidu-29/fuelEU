export class PoolMember {
  constructor(
    readonly shipId: string,
    readonly cbBefore: number,
    readonly cbAfter: number,
  ) {
    if (cbBefore < 0 && cbAfter < cbBefore) {
      throw new Error('Deficit ship cannot exit worse');
    }

    if (cbBefore > 0 && cbAfter < 0) {
      throw new Error('Surplus ship cannot exit negative');
    }
  }
}
