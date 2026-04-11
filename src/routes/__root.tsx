import type { AuthContext } from '@/providers/auth-provider';
import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext, useRouteContext } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';

interface RouterContext {
    auth: AuthContext;
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    const { auth } = useRouteContext({ from: '__root__' });

    // auth 로딩 중에는 라우트 렌더링 전에 스피너 표시
    // RouterProvider 자체는 항상 마운트되어 있으므로 URL 처리는 정상 동작
    if (auth.isLoading) {
        return (
            <div className="w-dvw h-dvh flex items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    }

    return (
        <div className="w-dvw h-dvh bg-gray-200 flex justify-center">
            <Toaster position="top-center" duration={2000} />
            <div className="app-shell bg-white h-full">
                <Outlet />
            </div>
        </div>
    );
}

// function RootComponent() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <div className="w-dvw h-dvh bg-gray-200 flex justify-center">
//                 <Toaster position="top-center" duration={2000} />
//                 <div className="app-shell bg-white h-full">
//                     <Outlet />
//                 </div>
//             </div>
//         </QueryClientProvider>
//     );
// }
