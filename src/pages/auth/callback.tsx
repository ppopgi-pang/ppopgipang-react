import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function Callback({ provider }: { provider: string }) {
    const navigate = useNavigate();

    useEffect(() => {
        navigate({ to: '/', replace: true });
    }, [provider, navigate]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <CircularLoadingSpinner />
        </div>
    );
}
