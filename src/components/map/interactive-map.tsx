import { Map } from 'react-kakao-maps-sdk';
import type { StoreItem } from '@/types/store/store.types';
import UserLocationMarker from './markers/favorite-marker';
import type { Coordinates } from '@/types/map/map.types';

interface InteractiveMapProps {
    center: Coordinates;
    userPosition?: Coordinates;
    heading?: number | null;
    accuracy?: number | null;
    stores: StoreItem[];
    onCenterChange: (center: Coordinates) => void;
    onChangeBounds: (map: kakao.maps.Map) => void;
    onLoad: (map: kakao.maps.Map) => void;
    level?: number;
}

export function InteractiveMap({
    center,
    userPosition,
    // heading,
    // accuracy,
    onCenterChange,
    onChangeBounds,
    onLoad,
    level = 3,
}: InteractiveMapProps) {
    const handleDragEnd = (map: kakao.maps.Map) => {
        const latlng = map.getCenter();
        onCenterChange({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
        });
    };

    return (
        <Map
            id="map"
            center={center}
            level={level}
            isPanto
            onDragEnd={handleDragEnd}
            style={{ width: '100%', height: '100%', zIndex: '3' }}
            onBoundsChanged={onChangeBounds}
            onCreate={onLoad}
        >
            <>
                {/* 사용자 위치 마커 */}
                {userPosition && <UserLocationMarker position={userPosition} />}
            </>
        </Map>
    );
}
