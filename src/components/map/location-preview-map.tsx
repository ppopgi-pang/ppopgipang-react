import { Map } from 'react-kakao-maps-sdk';
import ActiveMarker from './markers/active-marker';

interface LocationPreviewMapProps {
    latitude: number;
    longitude: number;
    level?: number;
    height?: string;
    draggable?: boolean;
    wheelScrollable?: boolean;
}

/**
 * 특정 위치를 정적으로 표시하는 미니맵
 * - 드래그, 스크롤, 더블탭, 줌 버튼 등 모든 인터랙션 기본적으로 비활성화
 * - 가게 정보 탭, 방문 인증 모달 등 위치 미리보기가 필요한 곳에 공통 사용
 */
export default function LocationPreviewMap({
    latitude,
    longitude,
    level = 4,
    height = '137px',
    draggable = false,
    wheelScrollable = false,
}: LocationPreviewMapProps) {
    const position = { lat: latitude, lng: longitude };

    return (
        <Map
            center={position}
            style={{ width: '100%', height, borderRadius: '12px' }}
            draggable={draggable}
            scrollwheel={wheelScrollable}
            disableDoubleClickZoom
            minLevel={level}
            maxLevel={level}
        >
            <ActiveMarker position={position} />
        </Map>
    );
}
