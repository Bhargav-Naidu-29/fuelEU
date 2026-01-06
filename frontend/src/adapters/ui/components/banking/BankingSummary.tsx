import React, { useState } from 'react';
import { Table } from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { useComplianceBalance } from '../../hooks/compliance/useComplianceBalance';
import { useBankingRecords } from '../../hooks/banking/useBankingRecords';

export const BankingSummary: React.FC = () => {
    const [shipId, setShipId] = useState('');
    const [year] = useState(2025);
    const { data: balance, execute: getBalance, loading: balanceLoading } = useComplianceBalance();
    const { data: records, execute: getRecords, loading: recordsLoading } = useBankingRecords();

    const handleRefresh = () => {
        if (!shipId) return;
        getBalance(shipId, year);
        getRecords(shipId, year);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end space-x-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ship ID</label>
                    <input
                        type="text"
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                        placeholder="Enter ship id..."
                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                    />
                </div>
                <Button onClick={handleRefresh} isLoading={balanceLoading || recordsLoading}>Fetch Status</Button>
            </div>

            {balance && (
                <div className="p-6 bg-indigo-600 rounded-xl text-white shadow-lg overflow-hidden relative">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <svg width="200" height="200" fill="currentColor"><circle cx="100" cy="100" r="100" /></svg>
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Current Compliance Balance</h3>
                    <div className="text-4xl font-mono font-bold">{balance.value.toLocaleString()} <span className="text-lg opacity-70">gCO2eq</span></div>
                    <div className="mt-4 text-xs bg-white/20 inline-block px-3 py-1 rounded-full">{shipId} • {year}</div>
                </div>
            )}

            {records.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase">Banking History</h3>
                    <Table headers={['Ship ID', 'Year', 'Banked Amount', 'Date']}>
                        {records.map((record, i) => (
                            <tr key={i}>
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
            )}
        </div>
    );
};
