import { queryClient } from '@/providers/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-dvw h-dvh bg-gray-200 flex justify-center">
                <Toaster position="top-center" duration={2000} />
                <div className="app-shell bg-white h-full">
                    <Outlet />
                </div>
            </div>
        </QueryClientProvider>
    );
}
