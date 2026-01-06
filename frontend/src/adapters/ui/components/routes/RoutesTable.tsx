import React from 'react';
import { Table } from '@/shared/ui/Table';
import { Loader } from '@/shared/ui/Loader';
import { Button } from '@/shared/ui/Button';
import { useRoutes } from '../../hooks/routes/useRoutes';
import { BaselineButton } from './BaselineButton';

interface RoutesTableProps {
    filters: {
        vesselType: string;
        shipId: string;
        year: number;
    };
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ filters }) => {
    const { data: routes, loading, error, refresh } = useRoutes();
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 10;

    if (loading) return <Loader />;
    if (error) return <div className="p-4 text-red-500 bg-red-50 rounded">Error: {error}</div>;

    const filteredRoutes = routes.filter(route => {
        const matchesType = !filters.vesselType || route.vesselType === filters.vesselType;
        const matchesShip = !filters.shipId || route.routeId.toLowerCase().includes(filters.shipId.toLowerCase());
        const matchesYear = !filters.year || route.year === filters.year;
        return matchesType && matchesShip && matchesYear;
    });

    const totalPages = Math.ceil(filteredRoutes.length / pageSize);
    const paginatedRoutes = filteredRoutes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const headers = [
        'Status',
        'Route ID',
        'Vessel Type',
        'Fuel',
        'Year',
        'Distance (km)',
        'Emissions (t)',
        'GHG Intensity',
        'Actions'
    ];

    return (
        <div className="space-y-4">
            <Table headers={headers}>
                {paginatedRoutes.map((route) => (
                    <tr key={`${route.routeId}-${route.year}`} className={`transition-colors ${route.isBaseline ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                        <td className="px-6 py-4">
                            {route.isBaseline ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">Baseline</span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 uppercase tracking-wider">Draft</span>
                            )}
                        </td>
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
                            {!route.isBaseline && (
                                <BaselineButton
                                    routeId={route.routeId}
                                    year={route.year}
                                    onSuccess={refresh}
                                />
                            )}
                        </td>
                    </tr>
                ))}
            </Table>

            {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-semibold text-slate-900">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * pageSize, filteredRoutes.length)}</span> of <span className="font-semibold text-slate-900">{filteredRoutes.length}</span> results
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-xs"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center px-4 text-xs font-bold text-slate-600">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-xs"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
