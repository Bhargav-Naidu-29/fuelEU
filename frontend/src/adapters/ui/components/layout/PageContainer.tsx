import React from 'react';

interface PageContainerProps {
    title: string;
    children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                    <div className="mt-2 h-1 w-20 rounded bg-indigo-600"></div>
                </header>
                <main className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    {children}
                </main>
            </div>
        </div>
    );
};
