/**
 * MJ energy used based on fuel consumption.
 */
export class EnergyUsed {
  readonly value: number;

  constructor(fuelConsumptionTons: number) {
    if (fuelConsumptionTons < 0) {
      throw new Error('Fuel consumption must be non-negative');
    }
    this.value = fuelConsumptionTons * 41000;
  }
}
