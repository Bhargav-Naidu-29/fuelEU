export class Year {
    private readonly _value: number;
  
    constructor(value: number) {
      if (!Number.isInteger(value)) {
        throw new Error('Year must be an integer');
      }
  
      if (value < 2020) {
        throw new Error('Year must be >= 2020 for FuelEU compliance');
      }
  
      this._value = value;
    }
  
    get value(): number {
      return this._value;
    }
  
    equals(other: Year): boolean {
      return this._value === other._value;
    }
  }
  