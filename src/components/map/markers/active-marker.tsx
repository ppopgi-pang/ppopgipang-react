import { MapMarker } from 'react-kakao-maps-sdk';
import ActivePositionMarkerIcon from '@/assets/icons/map/markers/ic-active-marker.svg';
import type { MarkerProps } from '@/types/map/map.types';

export default function ActiveMarker({ position, size = { width: 45, height: 45 } }: MarkerProps) {
    return (
        <MapMarker
            position={position}
            image={{
                src: ActivePositionMarkerIcon,
                size,
            }}
        />
    );
}
