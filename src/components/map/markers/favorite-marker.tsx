import { MapMarker } from 'react-kakao-maps-sdk';
import FavoriteMarkerIcon from '@/assets/icons/map/markers/ic-favorite-marker.svg';
import type { MarkerProps } from '@/types/map/map.types';

export default function FavoriteLocationMarker({ position, size = { width: 21, height: 31.5 } }: MarkerProps) {
    return (
        <MapMarker
            position={position}
            image={{
                src: FavoriteMarkerIcon,
                size,
            }}
        />
    );
}
