import { ListIcon, LocationIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import { useMapStore } from '@/stores/use-map-store';
import { useFetchLocation, useUserCoordinates, useUserLocationIsRefetching } from '@/stores/use-user-location-store';

interface MapBottomControlsProps {
    // 매장 목록 수 (목록보기 버튼에 표시)
    storeCount: number | null;
    // 매장 목록 다시 불러오기
    onRefetch: () => void;
    onOpenBottomSheet: () => void;
}

/**
 * 지도 하단 좌측/우측 컨트롤 버튼
 * - 좌: 목록보기 (현재 영역의 매장 수 표시)
 * - 우: 위치 재설정 (사용자 현재 위치로 지도 이동)
 */
export default function MapBottomControls({ storeCount, onRefetch, onOpenBottomSheet }: MapBottomControlsProps) {
    const { clearSelection, setPanTarget, setIsBoundsChanged } = useMapStore();
    const fetchLocation = useFetchLocation(); // 사용자 위치 정보를 새로 패칭해오는 함수
    const userLocation = useUserCoordinates(); // 사용자의 현재 위치
    const isRefetching = useUserLocationIsRefetching();

    // 위치 재설정: 사용자 위치로 지도 복귀, 선택 초기화, 재검색
    const handleLocationReset = () => {
        fetchLocation(); // 위치 정보 새로고침
        setIsBoundsChanged(false);
        if (userLocation) setPanTarget(userLocation);
        clearSelection();
        onRefetch();
    };

    return (
        <FlexBox justify={'between'} align={'center'} className="w-full px-5">
            {storeCount && (
                <button
                    onClick={onOpenBottomSheet}
                    type="button"
                    className="flex items-center p-2 gap-2 text-gray-700 text-base bg-white rounded-xl cursor-pointer leading-none"
                >
                    <ListIcon className="size-6" />
                    목록보기 ({storeCount})
                </button>
            )}
            <button
                type="button"
                onClick={handleLocationReset}
                disabled={isRefetching}
                className="cursor-pointer transition-all duration-100 hover:text-divider-primary bg-white rounded-full size-[42px] flex items-center justify-center disabled:cursor-default"
            >
                <LocationIcon className={`size-6 ${isRefetching ? 'text-gray-400' : ''}`} />
            </button>
        </FlexBox>
    );
}
