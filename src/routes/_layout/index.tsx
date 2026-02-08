import { createFileRoute } from '@tanstack/react-router';
import { FlexBox } from '@/components/layout/flexbox';
import MapPage from '@/pages/maps/MapPage';

export const Route = createFileRoute('/_layout/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <FlexBox direction="column" justify="start" align="center" className="relative w-full h-full">
            <header></header>
            <main className="w-full h-full">
                <MapPage />
            </main>
        </FlexBox>
    );
}
