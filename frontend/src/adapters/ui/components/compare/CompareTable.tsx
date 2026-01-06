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

            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium">Error: {error}</div>}

            {result && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 uppercase">Metrics Comparison</h3>
                        <Table headers={['Metric', 'Baseline', 'Comparison']}>
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">Total Emissions (t)</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">{result.baseline.totalEmissions.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">{result.comparison.totalEmissions.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">Distance (km)</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">{result.baseline.distance.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">{result.comparison.distance.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">GHG Intensity (gCO2e/MJ)</td>
                                <td className="px-6 py-4 text-sm font-bold text-indigo-600 font-mono">{result.baseline.ghgIntensity.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm font-bold text-indigo-600 font-mono">{result.comparison.ghgIntensity.toFixed(2)}</td>
                            </tr>
                        </Table>
                    </div>

                    <CompareChart
                        percentDiff={result.percentDiff}
                        baselineValue={result.baseline.ghgIntensity}
                        comparisonValue={result.comparison.ghgIntensity}
                    />
                </div>
            )}
        </div>
    );
};
