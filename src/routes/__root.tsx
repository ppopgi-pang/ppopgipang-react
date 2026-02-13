import { queryClient } from '@/providers/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ChatIcon, FeedbackIcon, HomeIcon, MyIcon, StarIcon } from '@/assets/icons';
import { BottomNav } from '@/components/common/bottom-nav/bottom-nav';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-full min-h-screen bg-gray-200 flex justify-center">
                <div className="app-shell bg-white min-h-screen">
                    <Outlet />
                    <div className="fixed bottom-5 left-0 right-0 z-10 px-4 max-w-[var(--app-max-width)] mx-auto">
                        <BottomNav>
                            <BottomNav.Item to="/maps" icon={<HomeIcon />} />
                            <BottomNav.Item to="/feed" icon={<FeedbackIcon />} />
                            <BottomNav.Item to="/star" icon={<StarIcon />} />
                            <BottomNav.Item to="/chat" icon={<ChatIcon />} />
                            <BottomNav.Item to="/my" icon={<MyIcon />} />
                        </BottomNav>
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
}
