import { EditIcon, FilterIcon, ListIcon, LocationIcon, SearchIcon } from '@/assets/icons';
import { SearchInput } from '@/components/common/search-input/search-input';
import { FlexBox } from '@/components/layout/flexbox';
import { InteractiveMap } from '@/components/map/interactive-map';
import useGeolocation, { DEFAULT_LOCATION } from '@/hooks/map/use-user-location';
import type { Coordinates } from '@/types/map/map.types';
import type { StoreItem } from '@/types/store/store.types';
import { useState, useRef } from 'react';
import { ChatIcon, FeedbackIcon, HomeIcon, MyIcon, StarIcon } from '@/assets/icons';
import { BottomNav } from '@/components/common/bottom-nav/bottom-nav';

export default function MapPage() {
    const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_LOCATION);
    const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
    const [isMapBoundsChanged, setIsMapBoundsChanged] = useState(false);

    const mapBoundsRef = useRef<{
        north: number;
        south: number;
        east: number;
        west: number;
    } | null>(null);

    const { loading, coordinates, heading, error, accuracy } = useGeolocation({
        watch: true,
        enableHighAccuracy: true,
    });

    if (loading) {
        return '로딩 중...';
    }

    if (error) {
        return `${error}`;
    }

    const handleChangeBounds = (map: kakao.maps.Map) => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const newBounds = {
            east: ne.getLng(),
            west: sw.getLng(),
            south: sw.getLat(),
            north: ne.getLat(),
        };

        const prevBounds = mapBoundsRef.current;

        // ✅ 이전 bounds와 비교
        if (prevBounds) {
            const isUnchanged =
                prevBounds.north === newBounds.north &&
                prevBounds.south === newBounds.south &&
                prevBounds.east === newBounds.east &&
                prevBounds.west === newBounds.west;

            if (isUnchanged) {
                return; // 변경 없으면 early return
            }
        }

        // ✅ bounds 업데이트 (리렌더링 없음)
        mapBoundsRef.current = newBounds;

        // ✅ bounds가 실제로 변경되었을 때만 버튼 표시
        setIsMapBoundsChanged(true);
    };

    // TODO: storesInBounds를 실제로 구현하거나 props로 받아야 함
    const storesInBounds: StoreItem[] = [];

    return (
        <div className="w-full h-full relative">
            <FlexBox direction="column" gap="lg" className="w-full absolute top-10 z-10 px-4">
                <FlexBox direction="row" justify="center" align="center" gap="xs" className="h-11 w-full">
                    <SearchInput placeholder="양천구 목동" icon={<SearchIcon className="size-6" />} />
                    <button className="h-full aspect-square flex items-center justify-center rounded-full bg-white/40 border-gay-200 backdrop-blur-[33px] cursor-pointer hover:text-divider-primary active:text-divider-primary transition-all duration-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04)]">
                        <FilterIcon className="size-6" />
                    </button>
                </FlexBox>
                <FlexBox
                    direction="column"
                    align="center"
                    className="w-full bg-white rounded-[20px] py-2 px-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04)]"
                >
                    <p className="text-xs font-medium">
                        <span className="text-brand-main1 leading-normal">'환영해요'</span> 달성까지 앞으로{' '}
                        <span className="text-brand-main1">3일</span>!
                    </p>
                    <FlexBox gap="md" align="center" className="w-full">
                        <span className="text-xs">
                            <span className="text-brand-main1">4</span> / 7
                        </span>
                        <div className="flex-1 bg-gray-300 rounded-full h-2">
                            <div className="w-[56%] bg-brand-main1 rounded-full h-2" />
                        </div>
                    </FlexBox>
                </FlexBox>
            </FlexBox>
            <InteractiveMap
                stores={selectedStore ? [selectedStore] : storesInBounds}
                center={mapCenter}
                userPosition={coordinates}
                heading={heading}
                accuracy={accuracy}
                level={3}
                onCenterChange={(center) => setMapCenter(center)}
                onChangeBounds={handleChangeBounds}
                onLoad={(map) => handleChangeBounds(map)}
            />

            <div className="fixed bottom-5 left-0 right-0 z-10 px-4 max-w-[var(--app-max-width)] mx-auto">
                <FlexBox align="center" justify="between" gap="sm">
                    <button className="flex items-center gap-2 cursor-pointer p-2 rounded-xl text-gray-700 text-base bg-white">
                        <ListIcon className="size-6" />
                        목록보기
                    </button>
                    <button className="cursor-pointer transition-all duration-100 hover:text-divider-primary bg-white rounded-full size-[42px] flex items-center justify-center">
                        <LocationIcon className="size-6" />
                    </button>
                </FlexBox>
                <FlexBox direction="column" gap="lg" className="w-full mt-2">
                    <FlexBox direction="row" gap="md" className="overflow-x-scroll w-full">
                        <div className="flex flex-col gap-3 bg-white rounded-xl px-5 py-4 w-[85%] min-w-[308px] border-brand-main3-light shadow-[0px_0px_8px_0px_rgba(255,217,61,0.36)]">
                            <FlexBox align="center" justify="between" className="px-2">
                                <FlexBox direction="column" align="start" justify="start">
                                    <h3 className="text-gray-900 text-base font-medium">팡팡뽑기팡</h3>
                                    <FlexBox align="center" gap="sm">
                                        <FlexBox align="center" gap="xs" asChild>
                                            <span className="inline-flex text-gray-900 text-base font-medium">
                                                <StarIcon className="text-brand-main3 w-6 h-6" />
                                                3.8
                                            </span>
                                        </FlexBox>
                                        <span className="text-base">리뷰 2개</span>
                                    </FlexBox>
                                </FlexBox>

                                <button className="bg-brand-main1 rounded-xl px-2 py-1.5 text-white text-base flex items-center gap-1 cursor-pointer">
                                    <EditIcon />
                                    방문인증
                                </button>
                            </FlexBox>

                            <div className="w-full bg-bg-primary p-3 rounded-xl text-xs text-gray-900">
                                <p className="line-clamp-2">
                                    의외로 잘 뽑히고, 초심자의 행운이 있었습니다. 다들 인형뽑기 파이팅입니다! 여기
                                    단골될것 같아요!! 다음에 또 방문할 예정입니다
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 bg-white rounded-xl px-5 py-4 w-[85%] min-w-[308px]  border-brand-main3-light shadow-[0px_0px_8px_0px_rgba(255,217,61,0.36)]">
                            <FlexBox align="center" justify="between" className="px-2">
                                <FlexBox direction="column" align="start" justify="start">
                                    <h3 className="text-gray-900 text-base font-medium">팡팡뽑기팡</h3>
                                    <FlexBox align="center" gap="sm">
                                        <FlexBox align="center" gap="xs" asChild>
                                            <span className="inline-flex text-gray-900 text-base font-medium">
                                                <StarIcon className="text-brand-main3 w-6 h-6" />
                                                3.8
                                            </span>
                                        </FlexBox>
                                        <span className="text-base">리뷰 2개</span>
                                    </FlexBox>
                                </FlexBox>

                                <button className="bg-brand-main1 rounded-xl px-2 py-1.5 text-white text-base flex items-center gap-1 cursor-pointer">
                                    <EditIcon />
                                    방문인증
                                </button>
                            </FlexBox>

                            <div className="w-full bg-bg-primary p-3 rounded-xl text-xs text-gray-900">
                                <p className="line-clamp-2">
                                    의외로 잘 뽑히고, 초심자의 행운이 있었습니다. 다들 인형뽑기 파이팅입니다! 여기
                                    단골될것 같아요!! 다음에 또 방문할 예정입니다
                                </p>
                            </div>
                        </div>
                    </FlexBox>
                    <BottomNav>
                        <BottomNav.Item to="/maps" icon={<HomeIcon />} />
                        <BottomNav.Item to="/feed" icon={<FeedbackIcon />} />
                        <BottomNav.Item to="/star" icon={<StarIcon />} />
                        <BottomNav.Item to="/chat" icon={<ChatIcon />} />
                        <BottomNav.Item to="/my" icon={<MyIcon />} />
                    </BottomNav>
                </FlexBox>
            </div>
        </div>
    );
}
