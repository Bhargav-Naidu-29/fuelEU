import React from 'react';

interface ComplianceCardProps {
    shipId: string;
    year: number;
    value: number;
    title?: string;
}

export const ComplianceCard: React.FC<ComplianceCardProps> = ({ shipId, year, value, title = 'Compliance Balance' }) => {
    const isSurplus = value >= 0;

    return (
        <div className={`p-6 rounded-xl text-white shadow-lg overflow-hidden relative transition-all duration-500 ${isSurplus ? 'bg-indigo-600' : 'bg-rose-600'}`}>
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <svg width="200" height="200" fill="currentColor"><circle cx="100" cy="100" r="100" /></svg>
            </div>

            <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{title}</h3>
                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-mono font-bold">{value.toLocaleString()}</span>
                    <span className="text-lg opacity-70">gCO2eq</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        {shipId} • {year}
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${isSurplus ? 'bg-emerald-400' : 'bg-rose-300'} animate-pulse`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            {isSurplus ? 'Compliant' : 'Non-Compliant'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
