import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useCompareRoutes } from '../../hooks/routes/useCompareRoutes';
import { CompareChart } from './CompareChart';

export const CompareTable: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();
    const { data: result, execute, loading, error } = useCompareRoutes();

    const handleCompare = () => {
        execute(year, shipId || undefined);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-end space-x-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ship ID (Optional)</label>
                    <input
                        type="text"
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                        placeholder="Leave empty to compare all ships..."
                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Year</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="rounded-lg border-slate-200 focus:ring-indigo-500 text-sm p-2"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleCompare} isLoading={loading}>Run Comparison</Button>
            </div>

            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-200">Error: {error}</div>}

            {loading && (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-500 font-medium">Calculating compliance delta...</p>
                </div>
            )}

            {!result && !loading && !error && (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-slate-900 font-semibold mb-1">No Comparison Data</h3>
                    <p className="text-slate-500 text-sm max-w-xs">{shipId ? `Click the button to compare ${shipId} against the ${year} baseline.` : `Click the button to compare all routes against the ${year} baseline.`}</p>
                </div>
            )}

            {result && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 uppercase">Comparison Summary</h3>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <span className="text-sm text-slate-500">Baseline Target</span>
                                <span className="text-sm font-bold text-slate-900">{result.baseline?.ghgIntensity?.toFixed(2) ?? '0.00'} gCO2e/MJ</span>
                            </div>
                            {result.comparisonRoute ? (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Selected Ship ({result.comparisonRoute.routeId})</span>
                                        <span className="text-sm font-bold text-slate-900">{result.comparisonRoute.ghgIntensity?.toFixed(2) ?? '0.00'} gCO2e/MJ</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm text-slate-500">Performance Delta</span>
                                        <span className={`text-sm font-bold ${result.comparison?.compliant ? 'text-green-600' : 'text-rose-600'}`}>
                                            {result.comparison?.percentDiff > 0 ? '+' : ''}{(result.comparison?.percentDiff ?? 0).toFixed(1)}%
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Total Routes Compared</span>
                                    <span className="text-sm font-bold text-indigo-600">{result.results?.length ?? 0}</span>
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${result.comparison?.compliant ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {result.comparisonRoute
                                        ? (result.comparison?.compliant ? 'COMPLIANT' : 'NON-COMPLIANT')
                                        : 'SYSTEM PERFORMANCE OVERVIEW'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                        <CompareChart
                            baselineValue={result.baseline.ghgIntensity}
                            comparisonValue={result.comparisonRoute?.ghgIntensity}
                            results={result.results}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
