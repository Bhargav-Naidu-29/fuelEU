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

import { Route } from '@/core/domain';

interface CompareChartProps {
    baselineValue: number;
    comparisonValue?: number;
    results?: {
        route: Route;
        percentDiff: number;
        compliant: boolean;
    }[];
}

export const CompareChart: React.FC<CompareChartProps> = ({ baselineValue, comparisonValue, results }) => {
    let chartData: any[] = [];

    if (results && results.length > 0) {
        chartData = results.map(r => ({
            name: r.route.routeId,
            intensity: r.route.ghgIntensity,
            isBaseline: false,
            compliant: r.compliant
        }));
    } else if (comparisonValue !== undefined) {
        chartData = [
            {
                name: 'Selected Ship',
                intensity: comparisonValue,
                isBaseline: false,
                compliant: comparisonValue <= baselineValue
            }
        ];
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-6 flex justify-between items-center">
                Intensity Analysis
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Pass</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Fail</span>
                    </div>
                </div>
            </h3>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            domain={[0, (dataMax: number) => Math.max(dataMax, baselineValue) * 1.2]}
                            label={{ value: 'gCO2e/MJ', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, offset: 0 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                        />
                        <ReferenceLine
                            y={baselineValue}
                            stroke="#6366f1"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                        >
                            <Label value="TARGET" position="top" fill="#6366f1" fontSize={10} fontWeight="bold" />
                        </ReferenceLine>
                        <Bar
                            dataKey="intensity"
                            radius={[4, 4, 0, 0]}
                            barSize={chartData.length > 8 ? 15 : 40}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.compliant ? '#10b981' : '#f43f5e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <p className="text-[10px] text-slate-400 font-medium">Performance metric: GHG Intensity (gCO2e/MJ) vs Annual Baseline</p>
            </div>
        </div>
    );
};
