import React, { useState } from 'react';
import { Table } from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { useComplianceBalance } from '../../hooks/compliance/useComplianceBalance';
import { useAdjustedComplianceBalance } from '../../hooks/compliance/useAdjustedComplianceBalance';
import { useBankingRecords } from '../../hooks/banking/useBankingRecords';
import { ComplianceCard } from '../ComplianceCard';
import {
    BarChart,
    Bar,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export const BankingSummary: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();

    const { data: balance, execute: getBalance, loading: balanceLoading, error: errorBalance } = useComplianceBalance();
    const { data: adjustedBalance, execute: getAdjustedBalance, loading: adjustedLoading, error: errorAdjusted } = useAdjustedComplianceBalance();
    const { data: records, execute: getRecords, loading: recordsLoading, error: errorRecords } = useBankingRecords();

    const handleRefresh = () => {
        if (!shipId) return;
        getBalance(shipId, year);
        getAdjustedBalance(shipId, year);
        getRecords(shipId, year);
    };

    const chartData = [...records].reverse().map(r => ({
        date: new Date(r.createdAt).toLocaleDateString(),
        amount: r.amount
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-end space-x-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-[2]">
                    <label htmlFor="shipIdSearch" className="block text-xs font-bold text-slate-500 uppercase mb-2">Ship ID</label>
                    <input
                        id="shipIdSearch"
                        name="shipIdSearch"
                        type="text"
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                        placeholder="Enter ship id..."
                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm p-2"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="bankingYearSelect" className="block text-xs font-bold text-slate-500 uppercase mb-2">Year</label>
                    <select
                        id="bankingYearSelect"
                        name="bankingYearSelect"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm p-2"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleRefresh} isLoading={balanceLoading || recordsLoading || adjustedLoading}>Fetch Status</Button>
            </div>

            {(errorBalance || errorRecords || errorAdjusted) && (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-200">
                    {errorBalance || errorRecords || errorAdjusted}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {balance ? (
                    <ComplianceCard
                        shipId={shipId}
                        year={year}
                        value={balance.value}
                    />
                ) : !balanceLoading && shipId && (
                    <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center flex items-center justify-center">
                        <p className="text-slate-400 text-sm italic">No compliance balance found for {shipId} in {year}.</p>
                    </div>
                )}

                {records.length > 0 && (
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Banking Velocity</h3>
                        <div className="h-24 w-full relative min-w-0">
                            <ResponsiveContainer width="100%" height="100%" minHeight={100} aspect={4}>
                                <BarChart data={chartData}>
                                    <Bar dataKey="amount" fill="#6366f1" radius={[2, 2, 0, 0]} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ fontSize: '10px', borderRadius: '4px', border: 'none' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {records.length === 0 && !recordsLoading && shipId && (
                    <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center flex items-center justify-center">
                        <p className="text-slate-400 text-sm italic">No banking history available.</p>
                    </div>
                )}
            </div>

            {records.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase flex items-center">
                        <span className="mr-2">Banking History</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{records.length} Records</span>
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <Table headers={['Ship ID', 'Year', 'Banked Amount', 'Date']}>
                            {records.map((record, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.shipId}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{record.year}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-bold">{record.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono text-xs">
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                </div>
            )}

            {adjustedBalance && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase">Adjusted Compliance Balance</h3>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        {adjustedBalance.applied === 0 && adjustedBalance.originalValue >= 0 ? (
                            <div className="flex items-center text-green-600 font-medium bg-green-50 p-4 rounded-lg border border-green-100">
                                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                No adjustment required for this period.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Original CB</p>
                                    <p className="text-lg font-mono font-bold text-slate-700">{adjustedBalance.originalValue.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Surplus Applied</p>
                                    <p className="text-lg font-mono font-bold text-indigo-600">+{adjustedBalance.applied.toLocaleString()}</p>
                                </div>
                                <div className={`p-4 rounded-lg border ${adjustedBalance.adjustedValue < 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Adjusted CB</p>
                                    <p className={`text-lg font-mono font-bold ${adjustedBalance.adjustedValue < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {adjustedBalance.adjustedValue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
