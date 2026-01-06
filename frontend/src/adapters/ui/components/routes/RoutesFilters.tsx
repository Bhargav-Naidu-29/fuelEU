import React, { useState } from 'react';

interface RoutesFiltersProps {
    onFilterChange: (filters: { vesselType: string; shipId: string; year: number }) => void;
    initialYear?: number;
}

export const RoutesFilters: React.FC<RoutesFiltersProps> = ({ onFilterChange, initialYear }) => {
    const currentYear = new Date().getFullYear();
    const [vesselType, setVesselType] = useState('');
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(initialYear || 0);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).reverse();

    const handleVesselChange = (value: string) => {
        setVesselType(value);
        onFilterChange({ vesselType: value, shipId, year });
    };

    const handleShipChange = (value: string) => {
        setShipId(value);
        onFilterChange({ vesselType, shipId: value, year });
    };

    const handleYearChange = (value: number) => {
        setYear(value);
        onFilterChange({ vesselType, shipId, year: value });
    };

    // Trigger initial filter on mount
    React.useEffect(() => {
        const defaultYear = initialYear !== undefined ? initialYear : 0;
        onFilterChange({ vesselType, shipId, year: defaultYear });
    }, []);

    return (
        <div className="flex flex-wrap gap-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm mb-8 items-end">
            <div className="flex flex-col min-w-[180px]">
                <label htmlFor="vesselType" className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Vessel Type</label>
                <select
                    id="vesselType"
                    name="vesselType"
                    value={vesselType}
                    onChange={(e) => handleVesselChange(e.target.value)}
                    className="rounded-lg border-slate-200 text-sm focus:ring-indigo-500 bg-slate-50 font-medium p-2"
                >
                    <option value="">All Vessels</option>
                    <option value="Container">Container</option>
                    <option value="RoRo">Ro-Ro</option>
                    <option value="BulkCarrier">Bulk Carrier</option>
                    <option value="Tanker">Tanker</option>
                </select>
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label htmlFor="shipSearch" className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Search Ship ID</label>
                <div className="relative">
                    <input
                        id="shipSearch"
                        name="shipSearch"
                        type="text"
                        value={shipId}
                        placeholder="Filter by ID..."
                        onChange={(e) => handleShipChange(e.target.value)}
                        className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500 bg-slate-50 pl-10 p-2"
                    />
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <div className="flex flex-col min-w-[140px]">
                <label htmlFor="yearSelect" className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Report Year</label>
                <select
                    id="yearSelect"
                    name="yearSelect"
                    value={year}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="rounded-lg border-slate-200 text-sm focus:ring-indigo-500 bg-slate-50 font-medium p-2"
                >
                    <option value={0}>Combined</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
