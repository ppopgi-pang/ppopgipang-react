import { queryClient } from '@/providers/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { MainBottomNav } from '@/components/common/bottom-nav/main-bottom-nav';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-dvw h-dvh bg-gray-200 flex justify-center">
                <div className="app-shell bg-white h-full">
                    <Outlet />
                    <MainBottomNav />
                </div>
            </div>
        </QueryClientProvider>
    );
}
