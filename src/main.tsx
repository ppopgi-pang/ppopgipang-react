import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter, createRouteMask } from '@tanstack/react-router';
import './styles/globals.css';

import { routeTree } from './routeTree.gen';

const storeDetailModalMask = createRouteMask({
    routeTree,
    from: '/maps/$storeId/modal',
    to: '/maps',
    params: true,
});

const router = createRouter({
    routeTree,
    routeMasks: [storeDetailModalMask],
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    );
}
