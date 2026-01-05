import { GHGIntensity } from './GHGIntensity';
import { EnergyUsed } from './EnergyUsed';
import { InvalidComplianceValueError } from '../errors/InvalidComplianceValueError';

export class ComplianceValue {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static calculate(params: {
    target: GHGIntensity;
    actual: GHGIntensity;
    energy: EnergyUsed;
  }): ComplianceValue {
    const { target, actual, energy } = params;

    const value = (target.value - actual.value) * energy.value;

    if (!Number.isFinite(value)) {
      throw new InvalidComplianceValueError();
    }

    return new ComplianceValue(value);
  }

  get value(): number {
    return this._value;
  }

  isSurplus(): boolean {
    return this._value > 0;
  }

  isDeficit(): boolean {
    return this._value < 0;
  }

  equals(other: ComplianceValue): boolean {
    return this._value === other._value;
  }
}

// /**
//  * gCO2eq compliance balance value.
//  */
// export class ComplianceValue {
//     readonly value: number;

//     constructor(
//       target: GHGIntensity,
//       actual: GHGIntensity,
//       energy: EnergyUsed
//     ) {
//       this.value = (target.value - actual.value) * energy.value;
//     }
//   }
