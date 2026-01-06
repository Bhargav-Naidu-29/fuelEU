import React, { useState } from 'react';
import { Table } from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { useCompareRoutes } from '../../hooks/routes/useCompareRoutes';
import { CompareChart } from './CompareChart';

export const CompareTable: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();
    const { data: result, execute, loading, error } = useCompareRoutes();

    return (
        <div className="space-y-8">
            <div className="flex items-end space-x-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Ship ID</label>
                    <input
                        type="text"
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                        placeholder="Enter ship id to compare..."
                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Year</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="rounded-lg border-slate-200 focus:ring-indigo-500 text-sm"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={() => execute(shipId, year)} isLoading={loading}>Run Comparison</Button>
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
                    <p className="text-slate-500 text-sm max-w-xs">Enter a Ship ID and select a year above to generate a compliance comparison report.</p>
                </div>
            )}

            {result && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 uppercase">Metrics Comparison</h3>
                        <Table headers={['Metric', 'Baseline', 'Comparison']}>
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">Total Emissions (t)</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">
                                    {(result.baseline?.totalEmissions ?? 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">
                                    {(result.comparison?.totalEmissions ?? 0).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">Distance (km)</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">
                                    {(result.baseline?.distance ?? 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">
                                    {(result.comparison?.distance ?? 0).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">GHG Intensity (gCO2e/MJ)</td>
                                <td className="px-6 py-4 text-sm font-bold text-indigo-600 font-mono">
                                    {result.baseline?.ghgIntensity?.toFixed(2) ?? '-'}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-indigo-600 font-mono">
                                    {result.comparison?.ghgIntensity?.toFixed(2) ?? '-'}
                                </td>
                            </tr>
                        </Table>
                    </div>

                    {result.baseline && result.comparison && (
                        <CompareChart
                            percentDiff={result.percentDiff}
                            baselineValue={result.baseline.ghgIntensity}
                            comparisonValue={result.comparison.ghgIntensity}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
