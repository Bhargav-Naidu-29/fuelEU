import React from 'react';
import { Table } from '@/shared/ui/Table';


export const PoolMembersTable: React.FC = () => {
    // In this scaffolding phase, this component is used as a sub-view
    // or specifically for displaying search results for validation.

    // Per requirements, it displays members with cb_before/after
    // We'll leave it as a visual shell for now as no hook provides "list all pools" yet
    // but the CreatePool hook returns the resulting Pool.

    return (
        <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">Historical Pool Participation</h3>
            <Table headers={['Ship ID', 'Year', 'CB Before', 'CB After', 'Status']}>
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic text-sm">
                        Select a ship to view its pooling history
                    </td>
                </tr>
            </Table>
        </div>
    );
};
