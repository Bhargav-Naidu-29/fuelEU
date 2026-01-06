import React, { useState } from 'react';

interface RoutesFiltersProps {
    onFilterChange: (filters: { vesselType: string; shipId: string; year: number }) => void;
}

export const RoutesFilters: React.FC<RoutesFiltersProps> = ({ onFilterChange }) => {
    const currentYear = new Date().getFullYear();
    const [vesselType, setVesselType] = useState('');
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(currentYear);
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

    return (
        <div className="flex space-x-4 p-4 bg-slate-50 rounded-lg mb-4">
            <div className="flex flex-col">
                <label htmlFor="vesselType" className="text-xs font-semibold uppercase text-slate-500 mb-1">Vessel Type</label>
                <select
                    id="vesselType"
                    name="vesselType"
                    value={vesselType}
                    onChange={(e) => handleVesselChange(e.target.value)}
                    className="rounded border-slate-200 text-sm focus:ring-indigo-500"
                >
                    <option value="">All Types</option>
                    <option value="CONTAINER">Container</option>
                    <option value="RO-PAX">Ro-pax</option>
                    <option value="BULK">Bulk Carrier</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="shipSearch" className="text-xs font-semibold uppercase text-slate-500 mb-1">Search Ship</label>
                <input
                    id="shipSearch"
                    name="shipSearch"
                    type="text"
                    value={shipId}
                    placeholder="Ship ID..."
                    onChange={(e) => handleShipChange(e.target.value)}
                    className="rounded border-slate-200 text-sm focus:ring-indigo-500"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="yearSelect" className="text-xs font-semibold uppercase text-slate-500 mb-1">Year</label>
                <select
                    id="yearSelect"
                    name="yearSelect"
                    value={year}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="rounded border-slate-200 text-sm focus:ring-indigo-500"
                >
                    <option value={0}>All Years</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
