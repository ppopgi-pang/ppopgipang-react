import { ListIcon, LocationIcon } from '@/assets/icons';
import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';
import { FlexBox } from '@/components/layout/flexbox';
import StoreFilteringButton from '@/components/map/buttons/store-filtering-button';
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
import type { Coordinates } from '@/types/map/map.types';
import type { StoreInBounds } from '@/types/store/store.types';
import { useEffect, useState } from 'react';
import { Map } from 'react-kakao-maps-sdk';

export default function MapPage() {
    const { loading, error, location: userLocation } = useGeolocation();
    const { updateCurrentBounds, searchBounds, commitSearchBounds, initializeSearchBounds } = useMapBounds();

    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [centerCoordinates, setCenterCoordinates] = useState<Coordinates | null>(null);

    const [isCenterChanged, setIsCenterChanged] = useState(false);

    const { data, refetch } = useFetchStoresInBounds(searchBounds);
    const { isOpen, open, close } = useModal();

    const handleRefetchStore = () => {
        commitSearchBounds();
        setIsCenterChanged(false);
    };

    const handleSelectStore = (store: StoreInBounds) => {
        if (selectedStore === store.id) {
            setSelectedStore(null);
            return;
        }

        setSelectedStore(store.id);
        setCenterCoordinates({ lat: store.latitude, lng: store.longitude });
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

            {/** 지도 */}
            <Map
                center={centerCoordinates || userLocation}
                style={{ width: '100%', height: '100%', zIndex: ZINDEX.map }}
                isPanto
                level={3}
                maxLevel={1}
                minLevel={9}
                onDragEnd={(map) => {
                    const mapCenter = map.getCenter();
                    setCenterCoordinates({ lat: mapCenter.getLat(), lng: mapCenter.getLng() });
                    setIsCenterChanged(true);
                }}
                onCreate={initializeSearchBounds}
                onBoundsChanged={updateCurrentBounds}
            >
                <UserLocationMarker position={userLocation} />
                {data && (
                    <StoreMarkers stores={data} selectedStoreId={selectedStore} onSelectStore={handleSelectStore} />
                )}
            </Map>

            {/** 지도 상단 헤더 */}
            <FlexBox
                direction={'column'}
                align={'center'}
                justify={'center'}
                className="py-4 px-5 absolute top-0 left-1/2 -translate-x-1/2 w-full"
                style={{ zIndex: ZINDEX.mapButton }}
                gap={'md'}
            >
                <MapHeader>
                    <SearchBarButton searchedPlace="" onClick={open} />
                    <StoreFilteringButton />
                </MapHeader>
                <QuestBox />

                {isCenterChanged && (
                    <RefetchStoreButton isVisible={isCenterChanged} onRefetchStore={handleRefetchStore} />
                )}
            </FlexBox>

            {/** 지도 하단 */}
            <FlexBox
                direction={'column'}
                align={'center'}
                className="absolute bottom-28 w-full"
                gap={'sm'}
                style={{ zIndex: ZINDEX.mapButton }}
            >
                <FlexBox justify={'between'} align={'center'} className="w-full px-5">
                    <button
                        type="button"
                        className="flex items-center p-2 gap-2 text-gray-700 text-base bg-white rounded-xl cursor-pointer leading-none"
                    >
                        <ListIcon className="size-6" />
                        목록보기
                    </button>
                    <button
                        onClick={() => {
                            setIsCenterChanged(false);
                            refetch();
                            setSelectedStore(null);
                            setCenterCoordinates(userLocation);
                        }}
                        className="cursor-pointer transition-all duration-100 hover:text-divider-primary bg-white rounded-full size-[42px] flex items-center justify-center"
                    >
                        <LocationIcon className="size-6" />
                    </button>
                </FlexBox>
                <div className="w-full flex items-center gap-2">
                    <FlexBox direction="row" gap="md" className="w-full">
                        {selectedStore && data && (
                            <StoreCardList
                                selectedStoreId={selectedStore}
                                onSelectStore={handleSelectStore}
                                storeItems={data}
                            />
                        )}
                    </FlexBox>
                </div>
            </FlexBox>
        </div>
    );
}
