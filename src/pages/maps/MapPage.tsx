import FilterModal from '@/components/common/modal/filter-modal';
import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';
import { FlexBox } from '@/components/layout/flexbox';
import StoreFilteringButton from '@/components/map/buttons/store-filtering-button';
import MapBottomControls from '@/components/map/map-bottom-controls';
import MapHeader from '@/components/map/map-header';
import UserLocationMarker from '@/components/map/markers/user-location-marker';
import QuestBox from '@/components/map/quest-box';
import RefetchStoreButton from '@/components/map/refetch-stores-button';
import SearchBarButton from '@/components/map/search-bar-button';
import SearchModal from '@/components/map/search-modal';
import StoreCardList from '@/components/map/store-card-list';
import StoreMarkers from '@/components/map/store-markers';
import { ZINDEX } from '@/constants/z-index';
import useModal from '@/hooks/common/use-modal';
import useGeolocation from '@/hooks/map/use-current-location';
import { useMapBounds } from '@/hooks/map/use-map-bounds';
import { useFetchStoresInBounds } from '@/hooks/queries/stores/use-fetch-stores';
import { useCenterCoordinates, useIsBoundsChanged, useMapStore } from '@/stores/use-map-store';
import type { StoreInBounds } from '@/types/store/store.types';
import { useEffect } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { useNavigate } from '@tanstack/react-router';

export default function MapPage() {
    const navigate = useNavigate();
    const { loading, error, location: userLocation } = useGeolocation();
    const { updateCurrentBounds, searchBounds, commitSearchBounds, initializeSearchBounds } = useMapBounds();

    // 지도 관련 전역 상태
    const centerCoordinates = useCenterCoordinates();
    const isBoundsChanged = useIsBoundsChanged();
    const { setCenterCoordinates, setIsBoundsChanged, reset } = useMapStore();

    // 맵 페이지 진입 시 이전 상태 초기화 (다른 페이지에서 돌아올 때 포함)
    useEffect(() => { reset(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const { data, refetch } = useFetchStoresInBounds(searchBounds);

    // 로컬 모달 상태 (MapPage 내부에서만 사용)
    const { isOpen, open, close } = useModal();
    const { isOpen: isFilterModalOpen, open: openFilterModal, close: closeFilterModal } = useModal();

    const handleCardClick = (store: StoreInBounds) => {
        navigate({ to: '/maps/$storeId/modal', params: { storeId: String(store.id) } });
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

    if (loading) {
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
                center={centerCoordinates || userLocation}
                style={{ width: '100%', height: '100%', zIndex: ZINDEX.map }}
                isPanto
                level={3}
                maxLevel={1}
                minLevel={15}
                onDragEnd={(map) => {
                    const mapCenter = map.getCenter();
                    setCenterCoordinates({ lat: mapCenter.getLat(), lng: mapCenter.getLng() });
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
                <QuestBox />
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
                    userLocation={userLocation}
                    onRefetch={() => refetch()}
                />
                <div className="w-full flex items-center gap-2">
                    <FlexBox direction="row" gap="md" className="w-full">
                        {data && <StoreCardList onCardClick={handleCardClick} storeItems={data} />}
                    </FlexBox>
                </div>
            </FlexBox>
        </div>
    );
}
