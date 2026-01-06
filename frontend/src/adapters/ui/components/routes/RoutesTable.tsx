import React from 'react';
import { Table } from '@/shared/ui/Table';
import { Loader } from '@/shared/ui/Loader';
import { useRoutes } from '../../hooks/routes/useRoutes';
import { BaselineButton } from './BaselineButton';

interface RoutesTableProps {
    filters: {
        vesselType: string;
        shipId: string;
    };
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ filters }) => {
    const { data: routes, loading, error, refresh } = useRoutes();

    if (loading) return <Loader />;
    if (error) return <div className="p-4 text-red-500 bg-red-50 rounded">Error: {error}</div>;

    const filteredRoutes = routes.filter(route => {
        const matchesType = !filters.vesselType || route.vesselType === filters.vesselType;
        const matchesShip = !filters.shipId || route.routeId.toLowerCase().includes(filters.shipId.toLowerCase());
        return matchesType && matchesShip;
    });

    const headers = [
        'Route ID',
        'Vessel Type',
        'Fuel',
        'Year',
        'Distance (km)',
        'Total Emissions (t)',
        'GHG Intensity (gCO2e/MJ)',
        'Actions'
    ];

    return (
        <Table headers={headers}>
            {filteredRoutes.map((route) => (
                <tr key={route.routeId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{route.routeId}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{route.vesselType}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{route.fuelType}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{route.year}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{route.distance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{route.totalEmissions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-semibold">
                        {route.ghgIntensity.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                        <BaselineButton
                            routeId={route.routeId}
                            year={route.year}
                            onSuccess={refresh}
                        />
                    </td>
                </tr>
            ))}
        </Table>
    );
};
