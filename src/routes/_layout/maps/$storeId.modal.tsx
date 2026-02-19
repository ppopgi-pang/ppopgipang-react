import StoreDetailModal from '@/components/map/store-detail-modal';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/maps/$storeId/modal')({
    component: RouteComponent,
});

function RouteComponent() {
    const { storeId } = Route.useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate({ to: '/maps', replace: true });
    };

    return <StoreDetailModal storeId={Number(storeId)} onClose={handleClose} />;
}
