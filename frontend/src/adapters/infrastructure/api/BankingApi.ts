import { BankingPort } from '@/core/ports';
import { BankRecord } from '@/core/domain';
import { HttpClientPort } from '@/core/ports';

export class BankingApi implements BankingPort {
  constructor(private readonly http: HttpClientPort) { }

  async getBankingRecords(
    shipId: string,
    year: number
  ): Promise<BankRecord[]> {
    const data = await this.http.get<any[]>(
      '/banking/records',
      { shipId, year }
    );

    return data.map(BankRecord.fromApi);
  }

  async bankSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<void> {
    await this.http.post('/banking/bank', {
      shipId,
      year,
      amount,
    });
  }

  async applyBankedSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<void> {
    await this.http.post('/banking/apply', {
      shipId,
      year,
      amount,
    });
  }
}
