import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';
import { QUERY_KEYS } from '@/constants/api';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function Callback({ provider }: { provider: string }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient
            .invalidateQueries({ queryKey: QUERY_KEYS.ME.ALL })
            .then(() => navigate({ to: '/', replace: true }));
    }, [provider, navigate, queryClient]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <CircularLoadingSpinner />
        </div>
    );
}
