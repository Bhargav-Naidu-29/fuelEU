import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useBankSurplus } from '../../hooks/banking/useBankSurplus';

export const BankForm: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();

    const [amount, setAmount] = useState(0);
    const { execute, loading, error } = useBankSurplus();
    const [msg, setMsg] = useState('');

    const handleBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg('');
        try {
            await execute(shipId, year, amount);
            setMsg('Surplus successfully banked!');
            setShipId('');
            setAmount(0);
        } catch (err) {
            // Error managed by hook
        }
    };

    return (
        <form onSubmit={handleBank} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4 text-center">Bank Compliance Surplus</h3>

            <div>
                <label htmlFor="bankShipId" className="block text-xs font-bold text-slate-500 uppercase mb-1">Ship ID</label>
                <input
                    id="bankShipId"
                    name="bankShipId"
                    required
                    type="text"
                    value={shipId}
                    onChange={(e) => setShipId(e.target.value)}
                    className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                    placeholder="Identify ship..."
                />
            </div>

            <div>
                <label htmlFor="bankYear" className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Year</label>
                <div className="grid grid-cols-2 gap-4">
                    <select
                        id="bankYear"
                        name="bankYear"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <div className="relative">
                        <input
                            id="bankAmount"
                            name="bankAmount"
                            required
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm font-mono pr-8"
                            placeholder="Amt"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">MJ</span>
                    </div>
                </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">Initiate Banking</Button>

            {error && <div className="p-3 bg-rose-50 text-rose-600 rounded text-xs font-medium">{error}</div>}
            {msg && <div className="p-3 bg-emerald-50 text-emerald-600 rounded text-xs font-medium font-bold text-center">{msg}</div>}
        </form>
    );
};
