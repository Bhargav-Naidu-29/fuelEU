import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';

describe('GHGIntensity value object', () => {
  it('creates valid GHG intensity', () => {
    const intensity = new GHGIntensity(89.3368);
    expect(intensity.value).toBe(89.3368);
  });

  it('creates valid zero intensity', () => {
    const intensity = new GHGIntensity(0);
    expect(intensity.value).toBe(0);
  });

  it('rejects negative intensity', () => {
    expect(() => new GHGIntensity(-10)).toThrow(
      'GHG intensity must be non-negative',
    );
  });
});

