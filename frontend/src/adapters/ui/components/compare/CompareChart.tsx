import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
    Label
} from 'recharts';

interface CompareChartProps {
    percentDiff: number;
    baselineValue: number;
    comparisonValue: number;
}

export const CompareChart: React.FC<CompareChartProps> = ({ percentDiff, baselineValue, comparisonValue }) => {
    const isCompliant = percentDiff < 0;
    const TARGET_VALUE = 89.3368;

    const data = [
        { name: 'Baseline', value: baselineValue, color: '#94a3b8' },
        { name: 'Comparison', value: comparisonValue, color: isCompliant ? '#10b981' : '#f43f5e' }
    ];

    return (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-6 flex justify-between items-center">
                Intensity Comparison
                <span className={`text-xs px-2 py-1 rounded-full ${isCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isCompliant ? 'Compliant' : 'Non-Compliant'}
                </span>
            </h3>

            <div className="h-64 w-full relative min-w-0">
                <ResponsiveContainer width="100%" height="100%" minHeight={250} aspect={1.7}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            domain={[0, (dataMax: number) => Math.max(dataMax, TARGET_VALUE) * 1.1]}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <ReferenceLine y={TARGET_VALUE} stroke="#6366f1" strokeDasharray="3 3">
                            <Label value="Target" position="top" fill="#6366f1" fontSize={10} fontWeight="bold" />
                        </ReferenceLine>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Delta</div>
                    <div className={`text-lg font-mono font-bold ${isCompliant ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(2)}%
                    </div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                    <div className={`text-xs font-bold uppercase ${isCompliant ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isCompliant ? 'Below Limit' : 'Exceeds Limit'}
                    </div>
                </div>
            </div>
        </div>
    );
};
