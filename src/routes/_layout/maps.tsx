import { FlexBox } from '@/components/layout/flexbox';
import MapPage from '@/pages/maps/MapPage';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/maps')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <FlexBox direction="column" justify="start" align="center" className="relative w-full h-full">
            <header></header>
            <main className="w-full h-full">
                <MapPage />
            </main>
            {/** 자식 라우트 - 모달 */}
            <Outlet />
        </FlexBox>
    );
}
