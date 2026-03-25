import StoreDetailModal from '@/components/map/store-detail-modal';
import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router';

type TabValue = 'info' | 'visits' | 'reviews';

interface StoreSearch {
    tab?: TabValue;
    visit?: true;
}

const VALID_TABS: TabValue[] = ['info', 'visits', 'reviews'];

function validateTab(raw: unknown): TabValue | undefined {
    if (typeof raw === 'string' && (VALID_TABS as string[]).includes(raw)) {
        return raw as TabValue;
    }
    return undefined;
}

export const Route = createFileRoute('/_layout/maps/$storeId')({
    validateSearch: (search: Record<string, unknown>): StoreSearch => ({
        tab: validateTab(search['tab']),
        // 방문인증 모달 열림 여부 — true 외 값은 undefined로 정규화
        visit: search['visit'] === true || search['visit'] === 'true' ? true : undefined,
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
    const { tab, visit } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
    const router = useRouter();

    const handleClose = () => navigate({ to: '/maps', replace: true });

    // 방문인증 열기
    const handleCertify = () => navigate({ search: (prev) => ({ ...prev, visit: true as const }) });

    // 방문인증 닫기 — 히스토리 역행으로 진입 경로에 따라 자동 분기(/maps, /maps/$storeId/...)
    const handleCertifyClose = () => router.history.back();

    return (
        <StoreDetailModal
            storeId={Number(storeId)}
            initialTab={tab}
            onClose={handleClose}
            onCertify={handleCertify}
            showVisitCertification={visit === true}
            onCertifyClose={handleCertifyClose}
        />
    );
}
