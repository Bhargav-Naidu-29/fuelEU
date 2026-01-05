import { ApplyBankedSurplus } from '@/core/application/use-cases/ApplyBankedSurplus';
import { ComplianceBalance } from '@/core/domain/entities/ComplianceBalance';
import { BankingRepository } from '@/core/ports/outbound/BankingRepository';
import { Year } from '@/core/domain/value-objects/Year';

describe('ApplyBankedSurplus', () => {
  let mockRepository: BankingRepository;
  let useCase: ApplyBankedSurplus;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findTotalBankedForShip: jest.fn().mockResolvedValue(100),
      applyBankedAmount: jest.fn().mockResolvedValue(undefined),
    };
    useCase = new ApplyBankedSurplus(mockRepository);
  });

  it('applies banked surplus to deficit', async () => {
    const balance = new ComplianceBalance({
      shipId: 'SHIP001',
      year: new Year(2025),
      value: -50,
    });

    await useCase.execute({ balance, amount: 30 });

    expect(mockRepository.findTotalBankedForShip).toHaveBeenCalledWith(
      'SHIP001',
      balance.year,
    );
    expect(mockRepository.applyBankedAmount).toHaveBeenCalledWith(
      'SHIP001',
      balance.year,
      30,
    );
  });

  it('rejects applying to non-deficit balance', async () => {
    const balance = new ComplianceBalance({
      shipId: 'SHIP001',
      year: new Year(2025),
      value: 50,
    });

    await expect(useCase.execute({ balance, amount: 30 })).rejects.toThrow(
      'Banked surplus can only be applied to a deficit',
    );
  });

  it('rejects applying more than available', async () => {
    const balance = new ComplianceBalance({
      shipId: 'SHIP001',
      year: new Year(2025),
      value: -50,
    });

    mockRepository.findTotalBankedForShip = jest.fn().mockResolvedValue(20);

    await expect(useCase.execute({ balance, amount: 30 })).rejects.toThrow(
      'Insufficient banked surplus available',
    );
  });
});

