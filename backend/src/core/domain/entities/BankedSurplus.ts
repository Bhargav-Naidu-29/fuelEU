export class BankedSurplus {
    private readonly _shipId: string;
    private readonly _year: number;
    private readonly _amount: number;
  
    constructor(params: {
      shipId: string;
      year: number;
      amount: number;
    }) {
      if (params.amount <= 0) {
        throw new Error('Banked surplus must be positive');
      }
  
      this._shipId = params.shipId;
      this._year = params.year;
      this._amount = params.amount;
    }
  
    get shipId() { return this._shipId; }
    get year() { return this._year; }
    get amount() { return this._amount; }
  }
  