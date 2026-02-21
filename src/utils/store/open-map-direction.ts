import type { Coordinates } from '@/types/common/api.types';

/**
 * 지도 앱별 길찾기 URL 생성 및 이동
 */
export const openMapDirections = (type: 'google' | 'naver' | 'kakao', destination: Coordinates, name: string) => {
    const { lat, lng } = destination;
    // URL 인코딩 (한글 깨짐 방지)
    const encodedName = encodeURIComponent(name);

    let url = '';

    switch (type) {
        case 'google':
            // origin을 생략하면 '현재 위치'가 출발지가 됩니다.
            url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedName}`;
            break;

        case 'naver':
            // elng(경도), elat(위도), etext(도착지명), menu=route(길찾기)
            // 출발지를 비워두면 네이버 지도가 현재 위치를 묻거나 설정을 유도합니다.
            url = `https://m.map.naver.com/index.nhn?elng=${lng}&elat=${lat}&etext=${encodedName}&menu=route`;
            break;

        case 'kakao':
            // 카카오맵 URL 스킴: to/장소명,위도,경도
            url = `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`;
            break;
    }

    // 새 탭으로 열기
    window.open(url, '_blank');
};
