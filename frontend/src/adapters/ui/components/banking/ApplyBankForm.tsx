import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useApplyBankedSurplus } from '../../hooks/banking/useApplyBankedSurplus';

export const ApplyBankForm: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();

    const [amount, setAmount] = useState(0);
    const { execute, loading, error } = useApplyBankedSurplus();
    const [msg, setMsg] = useState('');

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg('');
        try {
            await execute(shipId, year, amount);
            setMsg('Banked surplus applied successfully!');
            setAmount(0);
        } catch (err) {
            // Local error handling if needed, but hook handles state
        }
    };

    return (
        <form onSubmit={handleApply} className="p-6 bg-slate-900 rounded-xl text-white shadow-xl space-y-4">
            <h3 className="text-sm font-bold opacity-70 uppercase mb-4 text-center">Apply Banked Surplus</h3>

            <div className="space-y-4">
                <div>
                    <label htmlFor="applyShipId" className="block text-[10px] font-bold opacity-50 uppercase mb-1">Ship ID</label>
                    <input
                        id="applyShipId"
                        name="applyShipId"
                        required
                        type="text"
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                        className="w-full bg-white/10 border-transparent rounded-lg focus:ring-indigo-500 text-sm placeholder:text-white/20"
                        placeholder="Target ship..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="applyYear" className="block text-[10px] font-bold opacity-50 uppercase mb-1">Year</label>
                        <select
                            id="applyYear"
                            name="applyYear"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="w-full bg-white/10 border-transparent rounded-lg focus:ring-indigo-500 text-sm"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="applyAmount" className="block text-[10px] font-bold opacity-50 uppercase mb-1">Amount (gCO2eq)</label>
                        <input
                            id="applyAmount"
                            name="applyAmount"
                            required
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-white/10 border-transparent rounded-lg focus:ring-indigo-500 text-sm font-mono"
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" variant="primary" isLoading={loading} className="w-full bg-indigo-500 hover:bg-indigo-400 border-none mt-2">Apply Credit</Button>

            {error && <div className="p-3 bg-rose-500/20 text-rose-300 rounded text-xs border border-rose-500/50">{error}</div>}
            {msg && <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded text-xs border border-emerald-500/50 text-center font-bold">{msg}</div>}
        </form>
    );
};
