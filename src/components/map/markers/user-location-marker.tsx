import { MapMarker } from 'react-kakao-maps-sdk';
import UserPositionIcon from '@/assets/icons/markers/ic-user-marker.svg';
import type { MarkerProps } from '@/types/map/map.types';

/**
 * 사용자 현재 위치 마커
 */
export function UserLocationMarker({ position, size = { width: 45, height: 45 } }: MarkerProps) {
    return (
        <MapMarker
            position={position}
            image={{
                src: UserPositionIcon,
                size,
            }}
        />
    );
}
