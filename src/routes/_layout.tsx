import { MainBottomNav } from '@/components/common/bottom-nav/main-bottom-nav';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Outlet />
            <MainBottomNav />
        </>
    );
}
