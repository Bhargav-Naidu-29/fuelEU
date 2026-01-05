import { Year } from '../value-objects/Year';

export class BankedSurplus {
  private readonly _shipId: string;
  private readonly _year: Year;
  private readonly _amount: number;

  constructor(params: {
    shipId: string;
    year: Year;
    amount: number;
  }) {
    if (params.amount <= 0) {
      throw new Error('Only positive compliance balance can be banked');
    }

    this._shipId = params.shipId;
    this._year = params.year;
    this._amount = params.amount;
  }

  get shipId(): string {
    return this._shipId;
  }

  get year(): Year {
    return this._year;
  }

  get amount(): number {
    return this._amount;
  }
}
