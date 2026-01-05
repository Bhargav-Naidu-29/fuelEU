import { Year } from '../value-objects/Year';

export class ComplianceBalance {
  private readonly _shipId: string;
  private readonly _year: Year;
  private readonly _value: number; // gCO2eq

  constructor(params: { shipId: string; year: Year; value: number }) {
    this._shipId = params.shipId;
    this._year = params.year;
    this._value = params.value;
  }

  get shipId() {
    return this._shipId;
  }
  get year() {
    return this._year;
  }
  get value() {
    return this._value;
  }

  isSurplus(): boolean {
    return this._value > 0;
  }

  isDeficit(): boolean {
    return this._value < 0;
  }
}
