import { PoolMember } from './PoolMember';

export class Pool {
  private readonly _year: number;
  private readonly _members: PoolMember[];

  constructor(year: number, members: PoolMember[]) {
    const sum = members.reduce((acc, m) => acc + m.cbAfter, 0);

    if (sum < 0) {
      throw new Error('Pool total CB must be non-negative');
    }

    this._year = year;
    this._members = members;
  }

  get year() { return this._year; }
  get members() { return [...this._members]; }
}
