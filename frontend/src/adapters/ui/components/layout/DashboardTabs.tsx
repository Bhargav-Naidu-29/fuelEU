import React from 'react';

interface Tab {
    id: string;
    label: string;
}

interface DashboardTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="mb-8 border-b border-slate-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-all
                            ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};
