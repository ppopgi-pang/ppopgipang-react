import { StrictMode, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './styles/globals.css';

import { routeTree } from './routeTree.gen';
import { AuthProvider, useAuth } from './providers/auth-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    context: {
        auth: { user: null, isAuthenticated: false, isLoading: true },
        queryClient,
    },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

// eslint-disable-next-line react-refresh/only-export-components
function InnerApp() {
    const auth = useAuth();
    const context = useMemo(() => ({ auth, queryClient }), [auth]);

    useEffect(() => {
        router.invalidate();
    }, [auth]);

    // RouterProvider는 항상 렌더링 — isLoading으로 조건부 마운트하면
    // 라우터가 없는 상태에서 URL이 변경되어 원하는 페이지가 렌더링되지 않음
    return <RouterProvider router={router} context={context} />;
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <InnerApp />
                </AuthProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}
