import { FilterModal, CircularLoadingSpinner, StoreRating } from '@/components/common';
import { FlexBox } from '@/components/layout/flexbox';
import {
    StoreFilteringButton,
    VisitCertificationButton,
    MapBottomControls,
    MapHeader,
    UserLocationMarker,
    QuestBox,
    RefetchStoreButton,
    SearchBarButton,
    SearchModal,
    StoreCardList,
    StoreMarkers,
} from '@/components/map';
import { ZINDEX } from '@/constants/z-index';
import useModal from '@/hooks/common/use-modal';
import { useMapBounds } from '@/hooks/map/use-map-bounds';
import { useFetchStoresInBounds } from '@/hooks/queries/stores/use-fetch-stores';
import { usePanTarget, useIsBoundsChanged, useMapStore } from '@/stores/use-map-store';
import { useUserLocation } from '@/stores/use-user-location-store';
import type { StoreInBounds } from '@/types/store/store.types';
import { useEffect } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { Link, useNavigate } from '@tanstack/react-router';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useAuth } from '@/providers/auth-provider';

export default function MapPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // 사용자 위치
    const { coordinates: userLocation, isLoading, error, fetchLocation } = useUserLocation();

    const { updateCurrentBounds, searchBounds, commitSearchBounds, initializeSearchBounds } = useMapBounds();

    // 지도
    const panTarget = usePanTarget(); // 지도 패닝 타겟
    const isBoundsChanged = useIsBoundsChanged();
    const { setPanTarget, setIsBoundsChanged, reset } = useMapStore();

    // 맵 페이지 진입 시 이전 상태 초기화 (다른 페이지에서 돌아올 때 포함)
    useEffect(() => {
        reset();
        fetchLocation(); // 위치 최초 조회 — Zustand 액션이므로 ESLint set-state-in-effect 미적용
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const { data, refetch } = useFetchStoresInBounds(searchBounds);

    // 로컬 모달 상태 (MapPage 내부에서만 사용)
    const { isOpen, open, close } = useModal();
    const { isOpen: isBottomSheetOpen, open: openBottomSheet, close: closeBottomSheet } = useModal();
    const { isOpen: isFilterModalOpen, open: openFilterModal, close: closeFilterModal } = useModal();

    const handleCardClick = (store: StoreInBounds) => {
        navigate({ to: '/maps/$storeId', params: { storeId: String(store.id) }, search: { tab: 'info' } });
    };

    const handleRefetchStore = () => {
        commitSearchBounds();
        setIsBoundsChanged(false);
    };

    useEffect(() => {
        if (!searchBounds) return;
        refetch();
        // refetch는 매 렌더마다 새 참조이므로 dependency에서 제외
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchBounds]);

    // 최초 조회 중 — 좌표가 없으면 지도를 그릴 수 없으므로 블로킹
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    }
    if (error || !userLocation) {
        return <div>{error}</div>;
    }

    return (
        <div className="w-full h-full relative">
            {isOpen && <SearchModal onClose={close} />}
            <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} />

            {/** 지도 */}
            <Map
                center={panTarget || userLocation}
                style={{ width: '100%', height: '100%', zIndex: ZINDEX.map }}
                isPanto
                level={3}
                maxLevel={1}
                minLevel={15}
                onDragEnd={(map) => {
                    const mapCenter = map.getCenter();
                    setPanTarget({ lat: mapCenter.getLat(), lng: mapCenter.getLng() });
                    setIsBoundsChanged(true);
                }}
                onZoomChanged={() => {
                    setIsBoundsChanged(true);
                }}
                onCreate={initializeSearchBounds}
                onBoundsChanged={updateCurrentBounds}
            >
                <UserLocationMarker position={userLocation} />
                {data && <StoreMarkers stores={data} />}
            </Map>

            {/** 지도 상단: 검색바 + 필터버튼 */}
            <FlexBox
                direction={'column'}
                align={'center'}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full py-4 px-5"
                gap={'md'}
                style={{ zIndex: ZINDEX.mapHeader }}
            >
                <MapHeader>
                    <SearchBarButton searchedPlace="" onClick={open} />
                    <StoreFilteringButton
                        isActive={isFilterModalOpen}
                        onClick={() => {
                            if (isFilterModalOpen) {
                                closeFilterModal();
                            } else openFilterModal();
                        }}
                    />
                </MapHeader>
            </FlexBox>

            {/** 지도 중단: 퀘스트박스 + 재검색 버튼 */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full px-5 pt-[82px] flex flex-col items-center gap-4"
                style={{ zIndex: ZINDEX.mapButton }}
            >
                {isAuthenticated && <QuestBox />}
                {isBoundsChanged && (
                    <RefetchStoreButton isVisible={isBoundsChanged} onRefetchStore={handleRefetchStore} />
                )}
            </div>

            {/** 지도 하단: 목록보기·위치재설정 버튼 + 매장 카드 리스트 */}
            <FlexBox
                direction={'column'}
                align={'center'}
                className="absolute w-full"
                gap={'sm'}
                style={{ zIndex: ZINDEX.mapButton, bottom: 'var(--map-bottom-clearance)' }}
            >
                <MapBottomControls
                    storeCount={data?.length ?? 0}
                    onRefetch={() => refetch()}
                    onOpenBottomSheet={openBottomSheet}
                />
                <div className="w-full flex items-center gap-2">
                    <FlexBox direction="row" gap="md" className="w-full">
                        {data && <StoreCardList onCardClick={handleCardClick} storeItems={data} />}
                    </FlexBox>
                </div>
            </FlexBox>
            <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
                {() => (
                    <FlexBox direction={'column'} className="w-full h-full" as="section">
                        {data && (
                            <FlexBox direction={'column'} className="w-full h-full gap-4" as="ol">
                                {data.map((store) => (
                                    <Link
                                        to="/maps/$storeId"
                                        params={{ storeId: store.id.toString() }}
                                        className="w-full"
                                    >
                                        <FlexBox align={'center'} justify={'between'} className="w-full p-2" as="li">
                                            <FlexBox direction={'column'}>
                                                <h3 className="body-2">{store.name}</h3>
                                                <StoreRating
                                                    averageRating={store.average_rating}
                                                    reviewCount={store.review_count}
                                                />
                                            </FlexBox>
                                            <VisitCertificationButton
                                                onClick={() => {
                                                    navigate({
                                                        to: '/maps/$storeId',
                                                        params: { storeId: String(store.id) },
                                                        search: { visit: true },
                                                    });
                                                }}
                                            />
                                        </FlexBox>
                                    </Link>
                                ))}
                            </FlexBox>
                        )}
                    </FlexBox>
                )}
            </BottomSheet>
        </div>
    );
}
