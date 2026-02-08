import { MapMarker } from 'react-kakao-maps-sdk';
import FavoritePositionMarkerIcon from '@/assets/icons/map/markers/ic-favorite-marker.svg';
import type { MarkerProps } from '@/types/map/map.types';

export default function UserLocationMarker({ position, size = { width: 45, height: 45 } }: MarkerProps) {
    return (
        <MapMarker
            position={position}
            image={{
                src: FavoritePositionMarkerIcon,
                size,
            }}
        />
    );
}
