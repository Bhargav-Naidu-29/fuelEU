import { EnergyUsed } from '@/core/domain/value-objects/EnergyUsed';

describe('EnergyUsed value object', () => {
  it('creates valid energy used from fuel consumption', () => {
    const energy = new EnergyUsed(1000);
    expect(energy.value).toBe(41000000);
  });

  it('rejects negative fuel consumption', () => {
    expect(() => new EnergyUsed(-100)).toThrow();
  });
});
