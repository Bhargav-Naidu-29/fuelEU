import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useCreatePool } from '../../hooks/pooling/useCreatePool';
import {
    PieChart,
    Pie,
    Cell as RechartsCell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

interface Member {
    shipId: string;
    cbBefore: number;
}

export const CreatePoolForm: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();

    const [members, setMembers] = useState<Member[]>([]);
    const [newShipId, setNewShipId] = useState('');
    const [newCb, setNewCb] = useState(0);
    const { execute, loading, error } = useCreatePool();
    const [successMsg, setSuccessMsg] = useState('');

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const addMember = () => {
        if (!newShipId) return;
        setMembers([...members, { shipId: newShipId, cbBefore: newCb }]);
        setNewShipId('');
        setNewCb(0);
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const totalCbBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    const isCompliant = totalCbBefore >= 0;

    const chartData = members.map(m => ({
        name: m.shipId,
        value: Math.max(0, m.cbBefore) // Pie charts don't like negative values, but we can show contribution to surplus
    }));

    const handleSubmit = async () => {
        setSuccessMsg('');
        try {
            await execute({ year, members });
            setSuccessMsg('Pool created successfully!');
            setMembers([]);
        } catch (err) {
            // Error handled by hook
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase">Configuration</h3>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pool Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Add Member</label>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Ship ID"
                                value={newShipId}
                                onChange={(e) => setNewShipId(e.target.value)}
                                className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500"
                            />
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="CB Before (gCO2eq)"
                                    value={newCb}
                                    onChange={(e) => setNewCb(Number(e.target.value))}
                                    className="w-full rounded-lg border-slate-200 text-sm font-mono pr-12 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">MJ</span>
                            </div>
                            <Button variant="secondary" onClick={addMember} className="w-full text-xs py-2.5">Add to List</Button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">Pool Preview</h3>

                    {members.length >= 2 && (
                        <div className="h-40 w-full mb-4 relative min-w-0">
                            <ResponsiveContainer width="100%" height="100%" minHeight={150} aspect={2}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((_, index) => (
                                            <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="space-y-3 max-h-60 overflow-y-auto mb-4 flex-1">
                        {members.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-xs italic">Build your compliance pool...</p>
                            </div>
                        )}
                        {members.map((m, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200 group hover:border-indigo-300 transition-colors shadow-sm">
                                <div>
                                    <div className="text-sm font-bold text-slate-900">{m.shipId}</div>
                                    <div className={`text-[10px] font-mono font-bold ${m.cbBefore >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {m.cbBefore >= 0 ? '+' : ''}{m.cbBefore.toLocaleString()}
                                    </div>
                                </div>
                                <button onClick={() => removeMember(i)} className="p-1.5 rounded-full hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors">
                                    <svg height="14" width="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={`p-4 rounded-xl flex justify-between items-center transition-all duration-500 ${members.length > 0 ? (isCompliant ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100') : 'bg-slate-100'}`}>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Pool Health</div>
                        <div className={`text-lg font-mono font-bold ${members.length > 0 ? (isCompliant ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}`}>
                            {totalCbBefore.toLocaleString()}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        isLoading={loading}
                        disabled={!isCompliant || members.length < 2}
                        className="w-full mt-6 py-3 font-bold shadow-lg shadow-indigo-200"
                    >
                        Form Compliance Pool
                    </Button>
                    <div className="mt-3 flex items-center justify-center space-x-2 text-[10px] text-slate-400 italic">
                        <span className={`w-1.5 h-1.5 rounded-full ${members.length >= 2 ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                        <span>Min 2 ships</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompliant ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        <span>Positive Balance</span>
                    </div>
                </div>
            </div>
            {error && <div className="p-3 bg-rose-50 text-rose-600 rounded text-xs font-medium border border-rose-200">{error}</div>}
            {successMsg && <div className="p-3 bg-emerald-50 text-emerald-600 rounded text-xs font-bold border border-emerald-200 text-center">{successMsg}</div>}
        </div>
    );
};
