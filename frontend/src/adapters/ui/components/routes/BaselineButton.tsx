import React from 'react';
import { Button } from '@/shared/ui/Button';
import { useSetBaseline } from '../../hooks/routes/useSetBaseline';

interface BaselineButtonProps {
    routeId: string;
    year: number;
    onSuccess: () => void;
}

export const BaselineButton: React.FC<BaselineButtonProps> = ({ routeId, year, onSuccess }) => {
    const { execute, loading } = useSetBaseline();

    const handleClick = async () => {
        try {
            await execute(routeId, year);
            onSuccess();
        } catch (err) {
            // Error handled by hook state, but we catch to prevent unhandled rejection
        }
    };

    return (
        <Button
            variant="secondary"
            isLoading={loading}
            onClick={handleClick}
            className="text-xs"
        >
            Set Baseline
        </Button>
    );
};
