/**
 * gCO2e/MJ intensity value.
 */
export class GHGIntensity {
    readonly value: number;
  
    constructor(value: number) {
      if (value < 0) {
        throw new Error('GHG intensity must be non-negative');
      }
      this.value = value;
    }
  }
  