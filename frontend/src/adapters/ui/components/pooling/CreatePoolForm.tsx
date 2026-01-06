import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useCreatePool } from '../../hooks/pooling/useCreatePool';

interface Member {
    shipId: string;
    cbBefore: number;
}

export const CreatePoolForm: React.FC = () => {
    const [year, setYear] = useState(2025);
    const [members, setMembers] = useState<Member[]>([]);
    const [newShipId, setNewShipId] = useState('');
    const [newCb, setNewCb] = useState(0);
    const { execute, loading, error } = useCreatePool();
    const [successMsg, setSuccessMsg] = useState('');

    const addMember = () => {
        if (!newShipId) return;
        setMembers([...members, { shipId: newShipId, cbBefore: newCb }]);
        setNewShipId('');
        setNewCb(0);
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    // UI-only validation logic: sum(cbBefore) must be >= 0 for a compliant pool
    const totalCbBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    const isCompliant = totalCbBefore >= 0;

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
        <div className="space-y-8">
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
                            <option value={2025}>2025</option>
                            <option value={2026}>2026</option>
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
                                className="w-full rounded-lg border-slate-200 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="CB Before (gCO2eq)"
                                value={newCb}
                                onChange={(e) => setNewCb(Number(e.target.value))}
                                className="w-full rounded-lg border-slate-200 text-sm"
                            />
                            <Button variant="secondary" onClick={addMember} className="w-full">Add to List</Button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">Pool Preview</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                        {members.length === 0 && <p className="text-xs text-slate-400 italic text-center py-8">No members added yet</p>}
                        {members.map((m, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                                <div>
                                    <div className="text-sm font-bold text-slate-900">{m.shipId}</div>
                                    <div className="text-[10px] text-slate-500 font-mono italic">CB: {m.cbBefore.toLocaleString()}</div>
                                </div>
                                <button onClick={() => removeMember(i)} className="p-1 hover:text-rose-500">
                                    <svg height="16" width="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={`p-4 rounded-lg flex justify-between items-center ${members.length > 0 ? (isCompliant ? 'bg-emerald-100' : 'bg-rose-100') : 'bg-slate-200'}`}>
                        <div className="text-xs font-bold opacity-70">Projected Total CB</div>
                        <div className={`text-lg font-mono font-bold ${members.length > 0 ? (isCompliant ? 'text-emerald-700' : 'text-rose-700') : 'text-slate-500'}`}>
                            {totalCbBefore.toLocaleString()}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        isLoading={loading}
                        disabled={!isCompliant || members.length < 2}
                        className="w-full mt-6"
                    >
                        Create Compliance Pool
                    </Button>
                    <p className="mt-2 text-[10px] text-slate-400 text-center italic">Min 2 ships | Total CB must be non-negative</p>
                </div>
            </div>
            {error && <div className="p-3 bg-rose-50 text-rose-600 rounded text-xs font-medium border border-rose-200">{error}</div>}
            {successMsg && <div className="p-3 bg-emerald-50 text-emerald-600 rounded text-xs font-bold border border-emerald-200 text-center">{successMsg}</div>}
        </div>
    );
};
