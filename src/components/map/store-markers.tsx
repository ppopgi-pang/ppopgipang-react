import { useMapStore, useSelectedStoreId } from '@/stores/use-map-store';
import type { StoreInBounds } from '@/types/store/store.types';
import type { Coordinates } from '@/types/map/map.types';
import DefaultMarker from './markers/default-marker';
import ActiveMarker from './markers/active-marker';

interface StoreMarkersProps {
    stores: StoreInBounds[];
}

export default function StoreMarkers({ stores }: StoreMarkersProps) {
    // 선택된 매장 ID만 구독 (다른 상태 변경 시 리렌더 방지)
    const selectedStoreId = useSelectedStoreId();
    const selectStore = useMapStore((s) => s.selectStore);

    return (
        <>
            {stores.map((store) => {
                const position: Coordinates = {
                    lat: store.latitude,
                    lng: store.longitude,
                };
                const isSelected = selectedStoreId === store.id;

                return isSelected ? (
                    <ActiveMarker key={store.id} onClick={() => selectStore(store)} position={position} />
                ) : (
                    <DefaultMarker key={store.id} position={position} onClick={() => selectStore(store)} />
                );
            })}
        </>
    );
}
