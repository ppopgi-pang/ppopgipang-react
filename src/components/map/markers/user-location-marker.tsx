import { MapMarker } from 'react-kakao-maps-sdk';
import UserMarkerIcon from '@/assets/icons/map/markers/ic-user-marker.svg';
import type { MarkerProps } from '@/types/map/map.types';

export default function UserLocationMarker({ position, size = { width: 45, height: 45 } }: MarkerProps) {
    return (
        <MapMarker
            position={position}
            image={{
                src: UserMarkerIcon,
                size,
            }}
        />
    );
}
