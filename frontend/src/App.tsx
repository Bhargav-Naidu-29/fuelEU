import { useState } from 'react';
import { PageContainer, DashboardTabs } from './adapters/ui/components/layout';
import { RoutesTable, RoutesFilters } from './adapters/ui/components/routes';
import { CompareTable } from './adapters/ui/components/compare';
import { BankingSummary, BankForm, ApplyBankForm } from './adapters/ui/components/banking';
import { CreatePoolForm } from './adapters/ui/components/pooling';

export default function App() {
    const [activeTab, setActiveTab] = useState('routes');
    const [filters, setFilters] = useState({ vesselType: '', shipId: '', year: new Date().getFullYear() });

    const tabs = [
        { id: 'routes', label: 'Monitor Routes' },
        { id: 'compare', label: 'Comparison Tool' },
        { id: 'banking', label: 'Banking' },
        { id: 'pooling', label: 'Compliance Pooling' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'routes':
                return (
                    <div className="space-y-4">
                        <RoutesFilters onFilterChange={setFilters} />
                        <RoutesTable filters={filters} />
                    </div>
                );
            case 'compare':
                return <CompareTable />;
            case 'banking':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <BankingSummary />
                        </div>
                        <div className="space-y-8">
                            <BankForm />
                            <ApplyBankForm />
                        </div>
                    </div>
                );
            case 'pooling':
                return <CreatePoolForm />;
            default:
                return <RoutesTable filters={filters} />;
        }
    };

    return (
        <PageContainer title="FuelEU Maritime Dashboard">
            <DashboardTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <div className="mt-4 transition-all duration-300">
                {renderContent()}
            </div>
        </PageContainer>
    );
}
