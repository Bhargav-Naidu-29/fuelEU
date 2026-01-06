import React from 'react';

interface CompareChartProps {
    percentDiff: number;
    baselineValue: number;
    comparisonValue: number;
}

export const CompareChart: React.FC<CompareChartProps> = ({ percentDiff, baselineValue, comparisonValue }) => {
    // Pure visualization, no math performed here as per constraints
    const isCompliant = percentDiff < 0; // Negative diff means better than baseline

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-6">Compliance Delta Visualization</h3>

            <div className="space-y-8">
                {/* Baseline Bar */}
                <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-500">Baseline</span>
                        <span className="text-slate-900">{baselineValue.toFixed(2)} gCO2e/MJ</span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-slate-400 rounded-full"></div>
                    </div>
                </div>

                {/* Comparison Bar */}
                <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-500">Comparison</span>
                        <span className="text-slate-900">{comparisonValue.toFixed(2)} gCO2e/MJ</span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${isCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${75 + (percentDiff * 0.5)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Legend/Status */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className={`text-sm font-bold ${isCompliant ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}% Difference
                    </span>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {isCompliant ? 'Better than Baseline' : 'Exceeds Baseline'}
                    </div>
                </div>
            </div>
        </div>
    );
};
