import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useBankSurplus } from '../../hooks/banking/useBankSurplus';

export const BankForm: React.FC = () => {
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(2025);
    const { execute, loading, error } = useBankSurplus();
    const [msg, setMsg] = useState('');

    const handleBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg('');
        try {
            await execute(shipId, year);
            setMsg('Surplus successfully banked!');
            setShipId('');
        } catch (err) {
            // Error managed by hook
        }
    };

    return (
        <form onSubmit={handleBank} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4 text-center">Bank Compliance Surplus</h3>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ship ID</label>
                <input
                    required
                    type="text"
                    value={shipId}
                    onChange={(e) => setShipId(e.target.value)}
                    className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                    placeholder="Identify ship..."
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Year</label>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                </select>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">Initiate Banking</Button>

            {error && <div className="p-3 bg-rose-50 text-rose-600 rounded text-xs font-medium">{error}</div>}
            {msg && <div className="p-3 bg-emerald-50 text-emerald-600 rounded text-xs font-medium font-bold text-center">{msg}</div>}
        </form>
    );
};
