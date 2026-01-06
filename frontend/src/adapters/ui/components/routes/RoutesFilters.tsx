import React, { useState } from 'react';

interface RoutesFiltersProps {
    onFilterChange: (filters: { vesselType: string; shipId: string }) => void;
}

export const RoutesFilters: React.FC<RoutesFiltersProps> = ({ onFilterChange }) => {
    const [vesselType, setVesselType] = useState('');
    const [shipId, setShipId] = useState('');

    const handleVesselChange = (value: string) => {
        setVesselType(value);
        onFilterChange({ vesselType: value, shipId });
    };

    const handleShipChange = (value: string) => {
        setShipId(value);
        onFilterChange({ vesselType, shipId: value });
    };

    return (
        <div className="flex space-x-4 p-4 bg-slate-50 rounded-lg mb-4">
            <div className="flex flex-col">
                <label className="text-xs font-semibold uppercase text-slate-500 mb-1">Vessel Type</label>
                <select
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
                <label className="text-xs font-semibold uppercase text-slate-500 mb-1">Search Ship</label>
                <input
                    type="text"
                    value={shipId}
                    placeholder="Ship ID..."
                    onChange={(e) => handleShipChange(e.target.value)}
                    className="rounded border-slate-200 text-sm focus:ring-indigo-500"
                />
            </div>
        </div>
    );
};
