import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import FullScreenModal from '@/components/common/modal/full-screen-modal';
import { LeftArrowIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import { useFetchStorePageData } from '@/hooks/queries/stores/use-fetch-store-page-data';
import { useStoreImages } from '@/hooks/queries/common/use-store-images';
import StoreProfileSection from './sections/store-profile-section';
import StoreCoverImage from './sections/store-cover-image';
import StoreInfoTab from './tabs/store-info-tab';
import VisitHistoryTab from './tabs/visit-history-tab';
import ReviewsTab from './tabs/reviews-tab';
import VisitCertificationModal from './modals/visit-certification-modal';
import VisitCertificationButton from './buttons/visit-certification-button';

type TabValue = 'info' | 'visits' | 'reviews';

interface StoreDetailModalProps {
    storeId: number;
    initialTab?: TabValue;
    onClose: () => void;
    /** 방문인증 버튼 클릭 시 호출 — visit search param 추가 */
    onCertify: () => void;
    /** 방문인증 모달 표시 여부 — visit search param 존재 여부와 동기화 */
    showVisitCertification: boolean;
    /** 방문인증 모달 닫기 — visit search param 제거 */
    onCertifyClose: () => void;
}

export default function StoreDetailModal({
    storeId,
    initialTab,
    onClose,
    onCertify,
    showVisitCertification,
    onCertifyClose,
}: StoreDetailModalProps) {
    const { storeDetail, storeSummary, isPending, isError, error } = useFetchStorePageData(storeId);
    const { imageUrls } = useStoreImages(storeSummary?.image_names ?? []);

    const [activeTab, setActiveTab] = useState<TabValue>(initialTab ?? 'info');
    const isScrollingRef = useRef<boolean>(false);

    // FullScreenModal 내부 스크롤 컨테이너 ref
    // root: null(브라우저 viewport)이 아닌 실제 스크롤 컨테이너를 IntersectionObserver root로 사용
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const headerRef = useRef<HTMLElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [navHeight, setNavHeight] = useState(0);

    const sectionRefs: Record<TabValue, React.RefObject<HTMLElement | null>> = {
        info: useRef<HTMLElement>(null),
        visits: useRef<HTMLElement>(null),
        reviews: useRef<HTMLElement>(null),
    };

    // 헤더/탭 높이를 동적으로 측정 — ResizeObserver로 변화 시 자동 갱신
    // isPending이 true일 때는 header/nav DOM이 없으므로(early return),
    // isPending → false로 바뀌는 시점에 다시 실행해 실제 높이를 측정
    useLayoutEffect(() => {
        const updateHeights = () => {
            if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
            if (navRef.current) setNavHeight(navRef.current.offsetHeight);
        };
        updateHeights();
        const ro = new ResizeObserver(updateHeights);
        if (headerRef.current) ro.observe(headerRef.current);
        if (navRef.current) ro.observe(navRef.current);
        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPending]);

    const stickyHeight = headerHeight + navHeight;

    const scrollToSection = useCallback(
        (tab: TabValue) => {
            const ref = sectionRefs[tab];
            if (!ref.current) return;
            isScrollingRef.current = true;
            setActiveTab(tab);
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 700);
        },
        // sectionRefs는 렌더마다 새 객체이나 내부 ref는 stable하므로 eslint-disable 처리
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // IntersectionObserver: 스크롤 컨테이너 기준으로 보이는 섹션에 activeTab 동기화
    // FullScreenModal이 fixed inset-0이므로 root: null(브라우저 viewport)로 관찰하면
    // 모든 섹션이 항상 intersecting으로 감지되는 버그가 생김 → 실제 스크롤 컨테이너를 root로 사용
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrollingRef.current) return;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const section = entry.target.getAttribute('data-section') as TabValue | null;
                        if (section) {
                            setActiveTab(section);
                        }
                    }
                }
            },
            {
                root: scrollContainer,
                rootMargin: `-${stickyHeight}px 0px -50% 0px`,
                threshold: 0,
            },
        );

        const refs = [sectionRefs.info, sectionRefs.visits, sectionRefs.reviews];
        refs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPending, stickyHeight]);

    // 마운트 시 initialTab이 'info'가 아니면 해당 섹션으로 스크롤
    useEffect(() => {
        if (initialTab && initialTab !== 'info') {
            const timer = setTimeout(() => scrollToSection(initialTab), 100);
            return () => clearTimeout(timer);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (isPending) {
        return;
    }

    if (isError) {
        return <div>{error?.message || ''}</div>;
    }

    if (!storeDetail || !storeSummary) {
        return <div>에러!</div>;
    }

    return (
        <>
            {/* 방문인증 모달 — visit search param이 true일 때만 렌더링 */}
            {showVisitCertification && <VisitCertificationModal onClose={onCertifyClose} />}

            <FullScreenModal ref={scrollContainerRef}>
                {/* 고정 헤더 */}
                <FlexBox ref={headerRef} align="center" justify="between" gap="sm" asChild>
                    <header className="sticky top-0 z-20 bg-white left-0 right-0 w-full px-5 py-4 border-b-2 border-gray-200">
                        <button type="button" onClick={onClose} className="cursor-pointer">
                            <LeftArrowIcon className="w-[15px] h-[30px]" />
                        </button>
                    </header>
                </FlexBox>

                <main className="w-full flex-1 flex flex-col gap-4">
                    {/* 프로필 + 커버 이미지 (항상 노출) */}
                    <FlexBox direction="column" className="w-full" as="section">
                        {/* 프로필 정보와 방문인증 액션을 레이아웃 레벨에서 조합 */}
                        <FlexBox align="center" justify="between" className="w-full px-5 py-4">
                            <StoreProfileSection storeSummary={storeSummary} thumbnailUrl={imageUrls[0] ?? null} />
                            <VisitCertificationButton onClick={onCertify} />
                        </FlexBox>
                        {imageUrls[1] && <StoreCoverImage src={imageUrls[1]} />}
                    </FlexBox>

                    {/* 스티키 탭 네비게이션 */}
                    <nav ref={navRef} className="sticky z-10 bg-white w-full flex" style={{ top: headerHeight }}>
                        {/* 활성 탭: 브랜드 색상 텍스트 + 굵은 하단 테두리 / 비활성: 회색 텍스트 + 투명 테두리 */}
                        <button
                            type="button"
                            className={`flex-1 p-2.5 font-semibold text-base border-b-1 transition-colors ${
                                activeTab === 'info' ? ' border-brand-main1' : 'text-gray-400 border-gray-400'
                            }`}
                            onClick={() => scrollToSection('info')}
                        >
                            가게정보
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-2.5 font-semibold text-base border-b-1 transition-colors ${
                                activeTab === 'visits' ? ' border-brand-main1' : 'text-gray-400 border-gray-400'
                            }`}
                            onClick={() => scrollToSection('visits')}
                        >
                            방문내역
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-2.5 font-semibold text-base border-b-1 transition-colors ${
                                activeTab === 'reviews' ? ' border-brand-main1' : 'text-gray-400 border-gray-400'
                            }`}
                            onClick={() => scrollToSection('reviews')}
                        >
                            리뷰 ({storeSummary.review_count})
                        </button>
                    </nav>

                    {/* 섹션들 - 항상 렌더링 */}
                    <section ref={sectionRefs.info} data-section="info" style={{ scrollMarginTop: stickyHeight }}>
                        <StoreInfoTab storeDetail={storeDetail} storeName={storeSummary.name} />
                    </section>
                    <section ref={sectionRefs.visits} data-section="visits" style={{ scrollMarginTop: stickyHeight }}>
                        <VisitHistoryTab storeId={storeId} onCertify={onCertify} />
                    </section>
                    <section ref={sectionRefs.reviews} data-section="reviews" style={{ scrollMarginTop: stickyHeight }}>
                        <ReviewsTab storeId={storeId} />
                    </section>
                </main>
            </FullScreenModal>
        </>
    );
}
