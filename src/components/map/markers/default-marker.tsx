import { MapMarker } from 'react-kakao-maps-sdk';
import defaultPositionMarkerIcon from '@/assets/icons/map/markers/ic-default-marker.svg';
import type { MarkerProps } from '@/types/map/map.types';

export default function DefaultMarker({ position, size = { width: 21, height: 31.5 } }: MarkerProps) {
    return (
        <MapMarker
            position={position}
            image={{
                src: defaultPositionMarkerIcon,
                size,
            }}
        />
    );
}
