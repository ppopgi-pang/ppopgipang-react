import StoreDetailModal from '@/components/map/store-detail-modal';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';

type TabValue = 'info' | 'visits' | 'reviews';

interface TabSearch {
    tab?: TabValue;
}

const VALID_TABS: TabValue[] = ['info', 'visits', 'reviews'];

function validateTab(raw: unknown): TabValue | undefined {
    if (typeof raw === 'string' && (VALID_TABS as string[]).includes(raw)) {
        return raw as TabValue;
    }
    return undefined;
}

export const Route = createFileRoute('/_layout/maps/$storeId')({
    validateSearch: (search: Record<string, unknown>): TabSearch => ({
        tab: validateTab(search['tab']),
    }),
    loader: ({ params }) => {
        // 숫자가 아닌 storeId는 렌더 전에 차단
        if (!Number(params.storeId)) {
            throw redirect({ to: '/maps', replace: true });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { storeId } = Route.useParams();
    const { tab } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const handleClose = () => {
        navigate({ to: '/maps', replace: true });
    };

    return (
        <StoreDetailModal
            storeId={Number(storeId)}
            initialTab={tab}
            onClose={handleClose}
        />
    );
}
