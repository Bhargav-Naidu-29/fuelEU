import { Year } from '@/core/domain/value-objects/Year';

describe('Year value object', () => {
  it('creates valid year', () => {
    const year = new Year(2025);
    expect(year.value).toBe(2025);
  });

  it('rejects invalid year', () => {
    expect(() => new Year(2010)).toThrow();
  });
});
