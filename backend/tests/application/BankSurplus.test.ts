import { BankSurplus } from '@/core/application/use-cases/BankSurplus';
import { ComplianceBalance } from '@/core/domain/entities/ComplianceBalance';
import { BankingRepository } from '@/core/ports/outbound/BankingRepository';
import { Year } from '@/core/domain/value-objects/Year';

describe('BankSurplus', () => {
  let mockRepository: BankingRepository;
  let useCase: BankSurplus;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findTotalBankedForShip: jest.fn(),
      applyBankedAmount: jest.fn(),
      findRecordsByShipAndYear: jest.fn().mockResolvedValue([]),
    };
    useCase = new BankSurplus(mockRepository);
  });

  it('banks surplus for positive balance', async () => {
    const balance = new ComplianceBalance({
      shipId: 'SHIP001',
      year: new Year(2025),
      value: 100,
    });

    await useCase.execute({ balance, amount: 50 });

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects banking for non-positive balance', async () => {
    const balance = new ComplianceBalance({
      shipId: 'SHIP001',
      year: new Year(2025),
      value: -50,
    });

    await expect(useCase.execute({ balance, amount: 50 })).rejects.toThrow(
      'Cannot bank a non-positive compliance balance',
    );
  });

  it('rejects banking more than available balance', async () => {
    const balance = new ComplianceBalance({
      shipId: 'SHIP001',
      year: new Year(2025),
      value: 100,
    });

    await expect(useCase.execute({ balance, amount: 150 })).rejects.toThrow(
      'Cannot bank more than available compliance balance',
    );
  });
});

