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

type TabValue = 'info' | 'visits' | 'reviews';

interface StoreDetailModalProps {
    storeId: number;
    initialTab?: TabValue;
    onClose: () => void;
}

export default function StoreDetailModal({ storeId, initialTab, onClose }: StoreDetailModalProps) {
    const { storeDetail, storeSummary, isPending, isError, error } = useFetchStorePageData(storeId);
    const { imageUrls } = useStoreImages(storeSummary?.image_names ?? []);

    const [activeTab, setActiveTab] = useState<TabValue>(initialTab ?? 'info');
    const isScrollingRef = useRef<boolean>(false);

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
    }, []);

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
        []
    );

    // IntersectionObserver: 현재 뷰포트에 보이는 섹션으로 activeTab 동기화
    useEffect(() => {
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
                root: null,
                rootMargin: `-${stickyHeight}px 0px -50% 0px`,
                threshold: 0,
            }
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
        return '스켈레톤';
    }

    if (isError) {
        return <div>{error?.message || ''}</div>;
    }

    if (!storeDetail || !storeSummary) {
        return <div>에러!</div>;
    }

    return (
        <FullScreenModal>
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
                    <StoreProfileSection storeSummary={storeSummary} thumbnailUrl={imageUrls[0] ?? null} />
                    <StoreCoverImage src={imageUrls[1] ?? null} />
                </FlexBox>

                {/* 스티키 탭 네비게이션 */}
                <nav
                    ref={navRef}
                    className="sticky z-10 bg-white w-full flex transition-all duration-200"
                    style={{ top: headerHeight }}
                >
                    <button
                        type="button"
                        className={`flex-1 p-2.5 font-semibold text-base border-b ${
                            activeTab === 'info' ? 'border-brand-main1' : 'text-gray-400 border-gray-400'
                        }`}
                        onClick={() => scrollToSection('info')}
                    >
                        가게정보
                    </button>
                    <button
                        type="button"
                        className={`flex-1 p-2.5 font-semibold text-base border-b ${
                            activeTab === 'visits' ? 'border-brand-main1' : 'text-gray-400 border-gray-400'
                        }`}
                        onClick={() => scrollToSection('visits')}
                    >
                        방문내역
                    </button>
                    <button
                        type="button"
                        className={`flex-1 p-2.5 font-semibold text-base border-b ${
                            activeTab === 'reviews' ? 'border-brand-main1' : 'text-gray-400 border-gray-400'
                        }`}
                        onClick={() => scrollToSection('reviews')}
                    >
                        리뷰 ({storeSummary.review_count})
                    </button>
                </nav>

                {/* 섹션들 - 항상 렌더링 */}
                <section ref={sectionRefs.info} data-section="info" style={{ scrollMarginTop: stickyHeight }}>
                    <StoreInfoTab storeDetail={storeDetail} />
                </section>
                <section ref={sectionRefs.visits} data-section="visits" style={{ scrollMarginTop: stickyHeight }}>
                    <VisitHistoryTab storeId={storeId} />
                </section>
                <section ref={sectionRefs.reviews} data-section="reviews" style={{ scrollMarginTop: stickyHeight }}>
                    <ReviewsTab storeId={storeId} />
                    <div className="w-full h-[400px]"></div>
                </section>
            </main>
        </FullScreenModal>
    );
}
